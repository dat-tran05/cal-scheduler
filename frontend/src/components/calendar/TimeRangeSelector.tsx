"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DateRange } from "react-day-picker";

export interface TimeRange {
  from: Date;
  to: Date;
}

interface TimeRangeSelectorProps {
  onRangeChange: (range: TimeRange) => void;
  initialRange?: TimeRange;
}

const PRESET_RANGES = [
  {
    id: "today",
    label: "Today",
    getValue: () => {
      const today = new Date();
      return {
        from: today,
        to: today,
      };
    },
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    getValue: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        from: tomorrow,
        to: tomorrow,
      };
    },
  },
  {
    id: "this-week",
    label: "This Week",
    getValue: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return {
        from: startOfWeek,
        to: endOfWeek,
      };
    },
  },
  {
    id: "next-week",
    label: "Next Week",
    getValue: () => {
      const today = new Date();
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      return {
        from: nextWeekStart,
        to: nextWeekEnd,
      };
    },
  },
  {
    id: "next-30-days",
    label: "Next 30 Days",
    getValue: () => {
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + 30);
      return {
        from: today,
        to: future,
      };
    },
  },
];

export function TimeRangeSelector({
  onRangeChange,
  initialRange,
}: TimeRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [currentRange, setCurrentRange] = useState<TimeRange | null>(
    initialRange || null
  );

  // Set default range to "next 7 days" if no initial range
  useEffect(() => {
    if (!currentRange) {
      const defaultRange = {
        from: new Date(),
        to: (() => {
          const future = new Date();
          future.setDate(future.getDate() + 7);
          return future;
        })(),
      };
      setCurrentRange(defaultRange);
      onRangeChange(defaultRange);
    }
  }, [currentRange, onRangeChange]);

  const handlePresetClick = (preset: (typeof PRESET_RANGES)[0]) => {
    const range = preset.getValue();
    setSelectedPreset(preset.id);
    setCurrentRange(range);
    onRangeChange(range);
  };

  const handleCustomRangeUpdate = (values: { range: DateRange }) => {
    if (values.range.from && values.range.to) {
      const range: TimeRange = {
        from: values.range.from,
        to: values.range.to,
      };
      setCurrentRange(range);
      setSelectedPreset(null); // Clear preset selection when custom range is used
      onRangeChange(range);
    }
  };

  const getDayCount = (range: TimeRange) => {
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Select Buttons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Quick Select
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_RANGES.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="text-xs h-8"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Range Picker */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Custom Range
          </h4>
          <DateRangePicker
            onUpdate={handleCustomRangeUpdate}
            className="w-full"
          />
        </div>

        {/* Selected Range Display */}
        {currentRange && (
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="text-sm font-medium">
              {format(currentRange.from, "MMM d, yyyy")} -{" "}
              {format(currentRange.to, "MMM d, yyyy")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {getDayCount(currentRange)}{" "}
              {getDayCount(currentRange) === 1 ? "day" : "days"} selected
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
