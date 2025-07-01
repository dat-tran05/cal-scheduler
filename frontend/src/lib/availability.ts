import {
  CalendarEvent,
  AvailableSlot,
  FilterOptions,
  TimeRange,
  FilterValidationWarning,
  FilterValidationResult,
} from "@/types/calendar";
import {
  addDays,
  format,
  isWeekend,
  startOfDay,
  addMinutes,
  isSameDay,
  parseISO,
} from "date-fns";

// Filter validation constants
const BUSINESS_HOURS_START = 9;
const BUSINESS_HOURS_END = 17;
const MIN_SLOT_DURATION = 15; // minimum meaningful slot duration
const MAX_BUFFER_TIME = 120; // 2 hours max buffer

/**
 * Validates filter configuration and resolves conflicts
 */
export function validateFilters(
  filters: FilterOptions
): FilterValidationResult {
  const warnings: FilterValidationWarning[] = [];
  const resolvedFilters = { ...filters };

  // 1. Validate time range basics
  if (filters.startHour >= filters.endHour) {
    warnings.push({
      type: "conflict",
      field: "startHour",
      message: "Start hour must be before end hour",
      suggestedFix: {
        startHour: Math.min(filters.startHour, filters.endHour - 1),
        endHour: Math.max(filters.startHour + 1, filters.endHour),
      },
    });

    // Auto-fix: swap or adjust
    if (filters.startHour === filters.endHour) {
      Object.assign(resolvedFilters, {
        endHour: Math.min(23, filters.startHour + 1),
      });
    } else {
      Object.assign(resolvedFilters, {
        startHour: resolvedFilters.endHour,
        endHour: resolvedFilters.startHour,
      });
    }
  }

  // 2. Business hours logic with custom time range
  let effectiveStartHour = resolvedFilters.startHour;
  let effectiveEndHour = resolvedFilters.endHour;

  if (resolvedFilters.businessHoursOnly) {
    // Use intersection of business hours and custom range
    const customStart = resolvedFilters.startHour;
    const customEnd = resolvedFilters.endHour;

    effectiveStartHour = Math.max(BUSINESS_HOURS_START, customStart);
    effectiveEndHour = Math.min(BUSINESS_HOURS_END, customEnd);

    // Check for conflicts
    if (
      customEnd <= BUSINESS_HOURS_START ||
      customStart >= BUSINESS_HOURS_END
    ) {
      warnings.push({
        type: "conflict",
        field: "businessHoursOnly",
        message:
          "Custom time range is completely outside business hours (9 AM - 5 PM)",
        suggestedFix: {
          startHour: BUSINESS_HOURS_START,
          endHour: BUSINESS_HOURS_END,
        },
      });

      // Auto-fix: use business hours
      effectiveStartHour = BUSINESS_HOURS_START;
      effectiveEndHour = BUSINESS_HOURS_END;
    } else if (
      customStart < BUSINESS_HOURS_START ||
      customEnd > BUSINESS_HOURS_END
    ) {
      warnings.push({
        type: "info",
        field: "businessHoursOnly",
        message: `Time range adjusted to business hours: ${effectiveStartHour}:00 - ${effectiveEndHour}:00`,
      });
    }
  }

  // 3. Check if minimum duration is achievable
  const availableHours = effectiveEndHour - effectiveStartHour;
  const availableMinutes = availableHours * 60;

  if (resolvedFilters.minDuration > availableMinutes) {
    warnings.push({
      type: "conflict",
      field: "minDuration",
      message: `Minimum duration (${resolvedFilters.minDuration}m) exceeds available time window (${availableMinutes}m)`,
      suggestedFix: {
        minDuration: Math.max(MIN_SLOT_DURATION, availableMinutes),
      },
    });

    Object.assign(resolvedFilters, {
      minDuration: Math.max(MIN_SLOT_DURATION, availableMinutes),
    });
  }

  // 4. Buffer time warnings
  if (resolvedFilters.bufferTime > MAX_BUFFER_TIME) {
    warnings.push({
      type: "suggestion",
      field: "bufferTime",
      message: `Buffer time (${resolvedFilters.bufferTime}m) is very high and may eliminate most slots`,
      suggestedFix: {
        bufferTime: 30,
      },
    });
  }

  // Check if buffer time significantly impacts availability
  const effectiveSlotTime =
    resolvedFilters.minDuration + resolvedFilters.bufferTime * 2;
  if (effectiveSlotTime > availableMinutes * 0.8) {
    warnings.push({
      type: "suggestion",
      field: "bufferTime",
      message: "High buffer time may severely limit available slots",
    });
  }

  // 5. Validate hour ranges
  if (resolvedFilters.startHour < 0 || resolvedFilters.startHour > 23) {
    warnings.push({
      type: "conflict",
      field: "startHour",
      message: "Start hour must be between 0 and 23",
    });
    Object.assign(resolvedFilters, {
      startHour: Math.max(0, Math.min(23, resolvedFilters.startHour)),
    });
  }

  if (resolvedFilters.endHour < 0 || resolvedFilters.endHour > 24) {
    warnings.push({
      type: "conflict",
      field: "endHour",
      message: "End hour must be between 0 and 24",
    });
    Object.assign(resolvedFilters, {
      endHour: Math.max(0, Math.min(24, resolvedFilters.endHour)),
    });
  }

  // 6. Duration and buffer validation
  if (resolvedFilters.minDuration < MIN_SLOT_DURATION) {
    warnings.push({
      type: "suggestion",
      field: "minDuration",
      message: `Minimum duration below ${MIN_SLOT_DURATION} minutes may not be practical`,
    });
  }

  if (resolvedFilters.bufferTime < 0) {
    warnings.push({
      type: "conflict",
      field: "bufferTime",
      message: "Buffer time cannot be negative",
    });
    Object.assign(resolvedFilters, { bufferTime: 0 });
  }

  return {
    isValid: warnings.filter((w) => w.type === "conflict").length === 0,
    warnings,
    resolvedFilters,
    effectiveTimeRange: {
      startHour: effectiveStartHour,
      endHour: effectiveEndHour,
      duration: effectiveEndHour - effectiveStartHour,
    },
  };
}

/**
 * Gets smart filter suggestions based on context
 */
export function getFilterSuggestions(
  filters: FilterOptions
): FilterValidationWarning[] {
  const suggestions: FilterValidationWarning[] = [];

  // Suggest business hours for common work schedules
  if (
    !filters.businessHoursOnly &&
    filters.startHour >= 8 &&
    filters.endHour <= 18
  ) {
    suggestions.push({
      type: "suggestion",
      field: "businessHoursOnly",
      message: 'Consider enabling "Business Hours Only" for this time range',
      suggestedFix: { businessHoursOnly: true },
    });
  }

  // Suggest weekdays only for business contexts
  if (!filters.weekdaysOnly && filters.businessHoursOnly) {
    suggestions.push({
      type: "suggestion",
      field: "weekdaysOnly",
      message: "Business hours typically work best with weekdays only",
      suggestedFix: { weekdaysOnly: true },
    });
  }

  // Suggest reasonable buffer times
  if (filters.bufferTime === 0 && filters.minDuration >= 60) {
    suggestions.push({
      type: "suggestion",
      field: "bufferTime",
      message: "Consider adding buffer time between meetings",
      suggestedFix: { bufferTime: 15 },
    });
  }

  return suggestions;
}

export function calculateAvailability(
  events: CalendarEvent[],
  timeRange: TimeRange,
  filters: FilterOptions
): AvailableSlot[] {
  // Validate and resolve filter conflicts first
  const validation = validateFilters(filters);
  const validatedFilters = validation.resolvedFilters;

  const availableSlots: AvailableSlot[] = [];
  const { from, to } = timeRange;

  let currentDate = startOfDay(from);

  while (currentDate <= to) {
    // Skip weekends if weekdays only filter is enabled
    if (validatedFilters.weekdaysOnly && isWeekend(currentDate)) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    const daySlots = calculateDayAvailability(
      currentDate,
      events,
      validatedFilters
    );
    availableSlots.push(...daySlots);

    currentDate = addDays(currentDate, 1);
  }

  return availableSlots;
}

function calculateDayAvailability(
  date: Date,
  events: CalendarEvent[],
  validatedFilters: FilterOptions
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

  // Use validated filters to determine working hours
  const validation = validateFilters(validatedFilters);
  const effectiveRange = validation.effectiveTimeRange;

  const dayStart = new Date(date);
  dayStart.setHours(effectiveRange.startHour, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(effectiveRange.endHour, 0, 0, 0);

  let currentTime = dayStart;

  for (const event of dayEvents) {
    // Skip all-day events for availability calculation
    if (!event.start.dateTime || !event.end.dateTime) {
      continue;
    }

    const eventStart = parseISO(event.start.dateTime);
    const eventEnd = parseISO(event.end.dateTime);

    // Apply buffer time
    const bufferedEventStart = addMinutes(
      eventStart,
      -validatedFilters.bufferTime
    );
    const bufferedEventEnd = addMinutes(eventEnd, validatedFilters.bufferTime);

    // Check if there's a gap between current time and event start
    if (currentTime < bufferedEventStart) {
      const slotEnd = bufferedEventStart;
      const duration =
        (slotEnd.getTime() - currentTime.getTime()) / (1000 * 60);

      if (duration >= validatedFilters.minDuration) {
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

    if (duration >= validatedFilters.minDuration) {
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
