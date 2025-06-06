"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Clock, Zap } from "lucide-react";

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
    icon: "⚡",
    color:
      "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
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
    icon: "🌅",
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
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
    icon: "📅",
    color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
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
    icon: "⏭️",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
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
    icon: "🗓️",
    color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
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
    <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 transition-all duration-200 hover:shadow-2xl hover:shadow-slate-200/40 hover:border-slate-400/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-slate-800">
          <CalendarDays className="mr-3 h-5 w-5 text-blue-600" />
          <div>
            <span className="text-lg font-semibold">Time Range</span>
            <p className="text-sm font-normal text-slate-500 mt-0.5">
              Choose when to check for availability
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Quick Select Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-700">Quick Select</h4>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_RANGES.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => handlePresetClick(preset)}
                className={`justify-start h-auto p-3 text-left transition-all duration-200 ${
                  selectedPreset === preset.id
                    ? preset.color
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <span className="text-lg mr-3">{preset.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs opacity-75">
                    {preset.id === "today" || preset.id === "tomorrow"
                      ? "Single day"
                      : `${getDayCount(preset.getValue())} days`}
                  </div>
                </div>
                {selectedPreset === preset.id && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Active
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Range Picker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-700">Custom Range</h4>
          </div>
          <div className="p-3 rounded-lg border-2 border-slate-300/70 bg-slate-50/60 overflow-hidden shadow-sm">
            <div className="w-full max-w-full overflow-hidden">
              <DateRangePicker
                onUpdate={handleCustomRangeUpdate}
                className="w-full max-w-full [&_[data-testid=date-range-picker]]:max-w-full [&_.react-day-picker]:max-w-full [&_.react-day-picker]:scale-90 [&_.react-day-picker]:origin-top-left"
              />
            </div>
            {!selectedPreset && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                Using custom date range
              </p>
            )}
          </div>
        </div>

        {/* Selected Range Display */}
        {currentRange && (
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Selected Period
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white/60 text-blue-700"
                >
                  {getDayCount(currentRange)}{" "}
                  {getDayCount(currentRange) === 1 ? "day" : "days"}
                </Badge>
              </div>
              <div className="text-base font-semibold text-slate-800">
                {format(currentRange.from, "MMM d, yyyy")}
                {currentRange.from.getTime() !== currentRange.to.getTime() && (
                  <> — {format(currentRange.to, "MMM d, yyyy")}</>
                )}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {currentRange.from.getTime() === currentRange.to.getTime()
                  ? "Single day selection"
                  : `${getDayCount(
                      currentRange
                    )} day period for availability analysis`}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
