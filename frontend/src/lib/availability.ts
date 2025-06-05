import {
  CalendarEvent,
  AvailableSlot,
  FilterOptions,
  TimeRange,
} from "@/types/calendar";
import {
  addDays,
  format,
  isWeekend,
  startOfDay,
  endOfDay,
  addMinutes,
  isSameDay,
  parseISO,
} from "date-fns";

export function calculateAvailability(
  events: CalendarEvent[],
  timeRange: TimeRange,
  filters: FilterOptions
): AvailableSlot[] {
  const availableSlots: AvailableSlot[] = [];
  const { startDate, endDate } = timeRange;

  let currentDate = startOfDay(startDate);

  while (currentDate <= endDate) {
    // Skip weekends if weekdays only filter is enabled
    if (filters.weekdaysOnly && isWeekend(currentDate)) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    const daySlots = calculateDayAvailability(currentDate, events, filters);
    availableSlots.push(...daySlots);

    currentDate = addDays(currentDate, 1);
  }

  return availableSlots;
}

function calculateDayAvailability(
  date: Date,
  events: CalendarEvent[],
  filters: FilterOptions
): AvailableSlot[] {
  const daySlots: AvailableSlot[] = [];

  // Get events for this specific day
  const dayEvents = events
    .filter((event) => {
      const eventStart = event.start.dateTime
        ? parseISO(event.start.dateTime)
        : parseISO(event.start.date || "");
      return isSameDay(eventStart, date);
    })
    .sort((a, b) => {
      const aStart = parseISO(a.start.dateTime || a.start.date || "");
      const bStart = parseISO(b.start.dateTime || b.start.date || "");
      return aStart.getTime() - bStart.getTime();
    });

  // Determine working hours for the day
  const dayStart = new Date(date);
  dayStart.setHours(filters.startHour, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(filters.endHour, 0, 0, 0);

  // If business hours only, use 9-17, otherwise use provided hours
  if (filters.businessHoursOnly) {
    dayStart.setHours(9, 0, 0, 0);
    dayEnd.setHours(17, 0, 0, 0);
  }

  let currentTime = dayStart;

  for (const event of dayEvents) {
    // Skip all-day events for availability calculation
    if (!event.start.dateTime || !event.end.dateTime) {
      continue;
    }

    const eventStart = parseISO(event.start.dateTime);
    const eventEnd = parseISO(event.end.dateTime);

    // Apply buffer time
    const bufferedEventStart = addMinutes(eventStart, -filters.bufferTime);
    const bufferedEventEnd = addMinutes(eventEnd, filters.bufferTime);

    // Check if there's a gap between current time and event start
    if (currentTime < bufferedEventStart) {
      const slotEnd = bufferedEventStart;
      const duration =
        (slotEnd.getTime() - currentTime.getTime()) / (1000 * 60);

      if (duration >= filters.minDuration) {
        daySlots.push({
          date: format(date, "yyyy-MM-dd"),
          startTime: format(currentTime, "HH:mm"),
          endTime: format(slotEnd, "HH:mm"),
          duration: Math.floor(duration),
          dayOfWeek: format(date, "EEEE"),
        });
      }
    }

    // Move current time to end of event (with buffer)
    currentTime =
      bufferedEventEnd > currentTime ? bufferedEventEnd : currentTime;
  }

  // Check for availability from last event to end of day
  if (currentTime < dayEnd) {
    const duration = (dayEnd.getTime() - currentTime.getTime()) / (1000 * 60);

    if (duration >= filters.minDuration) {
      daySlots.push({
        date: format(date, "yyyy-MM-dd"),
        startTime: format(currentTime, "HH:mm"),
        endTime: format(dayEnd, "HH:mm"),
        duration: Math.floor(duration),
        dayOfWeek: format(date, "EEEE"),
      });
    }
  }

  return daySlots;
}

export function getTimeRangeOptions(): TimeRange[] {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const thisWeekStart = startOfDay(today);
  const thisWeekEnd = addDays(thisWeekStart, 6);
  const nextWeekStart = addDays(thisWeekEnd, 1);
  const nextWeekEnd = addDays(nextWeekStart, 6);

  return [
    {
      label: "Today",
      value: "today",
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    },
    {
      label: "Tomorrow",
      value: "tomorrow",
      startDate: startOfDay(tomorrow),
      endDate: endOfDay(tomorrow),
    },
    {
      label: "This Week",
      value: "this-week",
      startDate: thisWeekStart,
      endDate: thisWeekEnd,
    },
    {
      label: "Next Week",
      value: "next-week",
      startDate: nextWeekStart,
      endDate: nextWeekEnd,
    },
  ];
}

export function getDefaultFilters(): FilterOptions {
  return {
    businessHoursOnly: true,
    weekdaysOnly: true,
    minDuration: 60, // 1 hour
    startHour: 9,
    endHour: 17,
    bufferTime: 15, // 15 minutes
  };
}
