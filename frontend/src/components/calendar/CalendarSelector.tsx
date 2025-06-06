"use client";

import { useState } from "react";
import { Calendar } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search, X, Check } from "lucide-react";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  loading?: boolean;
}

export function CalendarSelector({
  calendars,
  selectedCalendarIds,
  onSelectionChange,
  loading = false,
}: CalendarSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calendars based on search query
  const filteredCalendars = calendars.filter(
    (calendar) =>
      calendar.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calendar.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCalendar = (calendarId: string) => {
    const isSelected = selectedCalendarIds.includes(calendarId);
    const newSelection = isSelected
      ? selectedCalendarIds.filter((id) => id !== calendarId)
      : [...selectedCalendarIds, calendarId];

    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(filteredCalendars.map((cal) => cal.id));
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-slate-800">
            <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Select Calendars</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100"
              >
                <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 transition-all duration-200 hover:shadow-2xl hover:shadow-slate-200/40 hover:border-slate-400/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center">
            <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-slate-800">
              Calendars
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="h-9 lg:h-8 px-3 lg:px-2 text-sm lg:text-xs touch-manipulation"
            >
              <Check className="mr-1 h-4 w-4" />
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={selectNone}
              className="h-9 lg:h-8 px-3 lg:px-2 text-sm lg:text-xs touch-manipulation"
            >
              <X className="mr-1 h-4 w-4" />
              None
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Search Input */}
        {calendars.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search calendars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white/60 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
            />
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Calendar List */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 border border-slate-100 rounded-lg bg-slate-50/30">
          <div className="space-y-2 p-3">
            {filteredCalendars.map((calendar) => (
              <div
                key={calendar.id}
                className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:border-slate-200 transition-all duration-200 touch-manipulation cursor-pointer"
                onClick={() => toggleCalendar(calendar.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedCalendarIds.includes(calendar.id)}
                    onCheckedChange={() => toggleCalendar(calendar.id)}
                    className="h-5 w-5 lg:h-4 lg:w-4 touch-manipulation flex-shrink-0"
                    style={{
                      accentColor: calendar.backgroundColor || "#3b82f6",
                    }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{
                      backgroundColor: calendar.backgroundColor || "#3b82f6",
                    }}
                  />
                  <div className="flex-1 min-w-0 mr-3">
                    <h4 className="font-medium text-slate-800 text-base sm:text-sm truncate">
                      {calendar.summary}
                    </h4>
                    {calendar.description && (
                      <p className="text-sm text-slate-500 truncate max-w-[200px] sm:max-w-[250px] mt-0.5">
                        {calendar.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
                  {calendar.primary && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                    >
                      Primary
                    </Badge>
                  )}
                  <span className="text-xs hidden sm:inline">
                    {calendar.accessRole}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredCalendars.length === 0 && searchQuery && (
          <div className="text-center py-6 text-slate-500">
            <p className="text-sm">
              No calendars found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Summary */}
        {selectedCalendarIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              {selectedCalendarIds.length} calendar
              {selectedCalendarIds.length !== 1 ? "s" : ""} selected for
              availability calculation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
