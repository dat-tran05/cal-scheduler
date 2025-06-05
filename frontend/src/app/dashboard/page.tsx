"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignInButton } from "@/components/auth/SignInButton";
import { Header } from "@/components/layout/Header";
import { CalendarSelector } from "@/components/calendar/CalendarSelector";
import { TimeRangeSelector } from "@/components/calendar/TimeRangeSelector";
import { FilterPanel } from "@/components/calendar/FilterPanel";
import { AvailabilityList } from "@/components/calendar/AvailabilityList";
import {
  fetchAllCalendars,
  fetchEventsFromCalendar,
} from "@/lib/google-calendar";
import { calculateAvailability } from "@/lib/availability";
import {
  CalendarEvent,
  TimeRange,
  FilterOptions,
  AvailableSlot,
} from "@/types/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";

// Predefined time ranges
const PREDEFINED_RANGES: TimeRange[] = [
  {
    label: "Today",
    value: "today",
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  },
  {
    label: "Tomorrow",
    value: "tomorrow",
    startDate: startOfDay(addDays(new Date(), 1)),
    endDate: endOfDay(addDays(new Date(), 1)),
  },
  {
    label: "This Week",
    value: "thisWeek",
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  {
    label: "Next Week",
    value: "nextWeek",
    startDate: startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
    endDate: endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
  },
];

// Default filters
const DEFAULT_FILTERS: FilterOptions = {
  businessHoursOnly: true,
  weekdaysOnly: false,
  startHour: 9,
  endHour: 17,
  minDuration: 60,
  bufferTime: 0,
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(
    PREDEFINED_RANGES[0]
  );
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [calculatingAvailability, setCalculatingAvailability] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch calendars
  const {
    data: calendars = [],
    isLoading: calendarsLoading,
    error: calendarsError,
  } = useQuery({
    queryKey: ["calendars", session?.accessToken],
    queryFn: () => fetchAllCalendars(session?.accessToken || ""),
    enabled: !!session?.accessToken,
  });

  // Auto-select primary calendar when calendars load
  useEffect(() => {
    if (calendars.length > 0 && selectedCalendarIds.length === 0) {
      const primaryCalendar = calendars.find((cal) => cal.primary);
      if (primaryCalendar) {
        setSelectedCalendarIds([primaryCalendar.id]);
      }
    }
  }, [calendars, selectedCalendarIds.length]);

  // Calculate availability when dependencies change
  const calculateAvailabilitySlots = useCallback(async () => {
    if (!selectedRange || !session?.accessToken) return;

    setCalculatingAvailability(true);
    try {
      // Fetch events for all selected calendars
      const allEvents: CalendarEvent[] = [];

      for (const calendarId of selectedCalendarIds) {
        const events = await fetchEventsFromCalendar(
          session.accessToken,
          calendarId,
          selectedRange.startDate.toISOString(),
          selectedRange.endDate.toISOString()
        );
        allEvents.push(...events);
      }

      // Calculate availability
      const slots = calculateAvailability(allEvents, selectedRange, filters);

      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error calculating availability:", error);
      setAvailableSlots([]);
    } finally {
      setCalculatingAvailability(false);
    }
  }, [selectedRange, session?.accessToken, selectedCalendarIds, filters]);

  useEffect(() => {
    if (
      selectedCalendarIds.length > 0 &&
      selectedRange &&
      session?.accessToken
    ) {
      calculateAvailabilitySlots();
    } else {
      setAvailableSlots([]);
    }
  }, [
    selectedCalendarIds,
    selectedRange,
    filters,
    session?.accessToken,
    calculateAvailabilitySlots,
  ]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You need to be signed in to access this page.</p>
          <SignInButton />
        </div>
      </div>
    );
  }

  // Error state
  if (calendarsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 mb-4 text-red-400" />
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Error Loading Calendars
              </h2>
              <p className="text-gray-600">
                {calendarsError instanceof Error
                  ? calendarsError.message
                  : "Failed to load calendars"}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Calendar Selector */}
              <CalendarSelector
                calendars={calendars}
                selectedCalendarIds={selectedCalendarIds}
                onSelectionChange={setSelectedCalendarIds}
                loading={calendarsLoading}
              />

              {/* Time Range Selector */}
              <TimeRangeSelector
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
                predefinedRanges={PREDEFINED_RANGES}
              />

              {/* Filter Panel */}
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              <AvailabilityList
                slots={availableSlots}
                loading={calculatingAvailability}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
