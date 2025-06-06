"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignInButton } from "@/components/auth/SignInButton";
import { Header } from "@/components/layout/Header";
import { CalendarSelector } from "@/components/calendar/CalendarSelector";
import {
  TimeRangeSelector,
  TimeRange,
} from "@/components/calendar/TimeRangeSelector";
import { FilterPanel } from "@/components/calendar/FilterPanel";
import { AvailabilityList } from "@/components/calendar/AvailabilityList";
import {
  fetchAllCalendars,
  fetchEventsFromCalendar,
} from "@/lib/google-calendar";
import { calculateAvailability } from "@/lib/availability";
import {
  Calendar as CalendarIcon,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Filter,
} from "lucide-react";
import { FilterOptions, AvailableSlot, CalendarEvent } from "@/types/calendar";
import { Button } from "@/components/ui/button";

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

  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(384); // 24rem default
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);

  // State
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);
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
          selectedRange.from.toISOString(),
          selectedRange.to.toISOString()
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

  // Resize handler for sidebar
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        320,
        Math.min(600, startWidth + e.clientX - startX)
      );
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <CalendarIcon className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <div className="absolute inset-0 bg-blue-200 blur-xl opacity-20 animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">
            Access Denied
          </h1>
          <p className="mb-8 text-slate-600">
            You need to be signed in to access this page.
          </p>
          <SignInButton />
        </div>
      </div>
    );
  }

  // Error state
  if (calendarsError) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-16 w-16 mb-6 text-red-400" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Calendars
            </h2>
            <p className="text-slate-600 max-w-md">
              {calendarsError instanceof Error
                ? calendarsError.message
                : "Failed to load calendars"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <Header />

      {/* Main Layout */}
      <div className="lg:flex h-[calc(100vh-4rem)]">
        {/* Mobile Controls Panel - Full screen overlay on mobile */}
        <div
          className={`
            fixed inset-0 z-50 bg-white/95 backdrop-blur-md lg:relative lg:z-auto lg:bg-white/90
            ${
              isMobileControlsOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            transition-transform duration-300 ease-in-out
            lg:border-r-2 lg:border-slate-300/80 lg:shadow-xl
            ${sidebarCollapsed ? "lg:w-0 lg:overflow-hidden" : ""}
          `}
          style={{
            width: sidebarCollapsed
              ? 0
              : window.innerWidth >= 1024
              ? sidebarWidth
              : "100%",
          }}
        >
          {/* Mobile Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b-2 border-slate-300/60 px-4 lg:px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Controls</h2>
              <div className="flex items-center gap-2">
                {/* Mobile Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileControlsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-slate-200/60 lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
                {/* Desktop Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="h-8 w-8 p-0 hover:bg-slate-200/60 hidden lg:flex"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Controls Content */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <div className="p-4 lg:p-6 pb-12 space-y-6">
              {/* Calendar Selector */}
              <CalendarSelector
                calendars={calendars}
                selectedCalendarIds={selectedCalendarIds}
                onSelectionChange={setSelectedCalendarIds}
                loading={calendarsLoading}
              />

              {/* Time Range Selector */}
              <TimeRangeSelector
                onRangeChange={setSelectedRange}
                initialRange={selectedRange || undefined}
              />

              {/* Filter Panel */}
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Resize Handle - Desktop Only */}
          {!sidebarCollapsed && (
            <div
              className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/20 transition-colors group hidden lg:block"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-slate-300 group-hover:bg-blue-500 rounded-full transition-colors"></div>
            </div>
          )}
        </div>

        {/* Mobile Controls Toggle Button */}
        <Button
          onClick={() => setIsMobileControlsOpen(true)}
          className="fixed bottom-4 left-4 z-40 lg:hidden rounded-full bg-blue-600 hover:bg-blue-700 p-3 shadow-lg touch-manipulation"
          size="sm"
        >
          <Filter className="h-6 w-6 text-white" />
        </Button>

        {/* Mobile Overlay */}
        {isMobileControlsOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsMobileControlsOpen(false)}
          />
        )}

        {/* Collapsed Sidebar Toggle - Desktop Only */}
        {sidebarCollapsed && (
          <div className="w-12 bg-white/95 backdrop-blur-md border-r-2 border-slate-300/80 shadow-lg items-start justify-center pt-4 hidden lg:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="h-8 w-8 p-0 hover:bg-slate-200/60"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden bg-white/50 backdrop-blur-sm">
          <div className="h-full p-3 lg:p-6 overflow-hidden">
            <AvailabilityList
              slots={availableSlots}
              loading={calculatingAvailability}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
