"use client";

import { Calendar } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Users, User } from "lucide-react";

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
  const toggleCalendar = (calendarId: string) => {
    const isSelected = selectedCalendarIds.includes(calendarId);
    const newSelection = isSelected
      ? selectedCalendarIds.filter((id) => id !== calendarId)
      : [...selectedCalendarIds, calendarId];

    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(calendars.map((cal) => cal.id));
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Select Calendars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Select Calendars ({selectedCalendarIds.length}/{calendars.length})
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <button
              onClick={selectNone}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              None
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {calendars.map((calendar) => {
            const isSelected = selectedCalendarIds.includes(calendar.id);
            return (
              <div
                key={calendar.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleCalendar(calendar.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {calendar.primary ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Users className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium truncate">
                      {calendar.summary}
                    </span>
                    {calendar.primary && (
                      <Badge variant="default" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  {calendar.description && (
                    <p className="text-sm text-gray-500 truncate">
                      {calendar.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 capitalize">
                    {calendar.accessRole}
                  </p>
                </div>
                {calendar.backgroundColor && (
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: calendar.backgroundColor }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
