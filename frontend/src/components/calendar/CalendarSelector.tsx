"use client";

import { useState } from "react";
import { Calendar } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Users,
  User,
  Search,
  Check,
  X,
} from "lucide-react";

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
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg shadow-slate-200/20">
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
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg shadow-slate-200/20 transition-all duration-200 hover:shadow-xl hover:shadow-slate-200/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
            <div>
              <span className="text-lg font-semibold text-slate-800">
                Calendars
              </span>
              <p className="text-sm font-normal text-slate-500 mt-0.5">
                {selectedCalendarIds.length} of {filteredCalendars.length}{" "}
                selected
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={selectAll}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Check className="h-3 w-3 mr-1" />
              All
            </Button>
            <Button
              onClick={selectNone}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-slate-700 hover:bg-slate-50"
            >
              <X className="h-3 w-3 mr-1" />
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
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredCalendars.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <CalendarIcon className="mx-auto h-8 w-8 mb-2 text-slate-300" />
              <p className="text-sm">
                {searchQuery
                  ? "No calendars match your search"
                  : "No calendars found"}
              </p>
            </div>
          ) : (
            filteredCalendars.map((calendar) => {
              const isSelected = selectedCalendarIds.includes(calendar.id);
              return (
                <div
                  key={calendar.id}
                  className={`group flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-200 bg-blue-50/50 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                  }`}
                  onClick={() => toggleCalendar(calendar.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCalendar(calendar.id)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {calendar.primary ? (
                        <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <Users className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      )}
                      <span className="font-medium text-slate-800 truncate">
                        {calendar.summary}
                      </span>
                      {calendar.primary && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                        >
                          Primary
                        </Badge>
                      )}
                    </div>

                    {calendar.description && (
                      <p className="text-sm text-slate-500 truncate">
                        {calendar.description}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 capitalize mt-1">
                      {calendar.accessRole}
                    </p>
                  </div>

                  {calendar.backgroundColor && (
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: calendar.backgroundColor }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

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
