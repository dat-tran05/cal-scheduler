"use client";

import { useState } from "react";
import { TimeRange } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange | null;
  onRangeChange: (range: TimeRange) => void;
  predefinedRanges: TimeRange[];
}

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  predefinedRanges,
}: TimeRangeSelectorProps) {
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleCustomRange = () => {
    if (customStartDate && customEndDate) {
      const customRange: TimeRange = {
        label: `${format(customStartDate, "MMM d")} - ${format(
          customEndDate,
          "MMM d"
        )}`,
        value: "custom",
        startDate: customStartDate,
        endDate: customEndDate,
      };
      onRangeChange(customRange);
      setShowCustomPicker(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Select Time Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Predefined Ranges */}
          <div className="grid grid-cols-2 gap-2">
            {predefinedRanges.map((range) => (
              <Button
                key={range.value}
                variant={
                  selectedRange?.value === range.value ? "default" : "outline"
                }
                onClick={() => onRangeChange(range)}
                className="justify-start"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="border-t pt-3">
            <Popover open={showCustomPicker} onOpenChange={setShowCustomPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant={
                    selectedRange?.value === "custom" ? "default" : "outline"
                  }
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedRange?.value === "custom" &&
                  customStartDate &&
                  customEndDate
                    ? selectedRange.label
                    : "Custom Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      disabled={(date) =>
                        date < new Date() ||
                        (customStartDate ? date < customStartDate : false)
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCustomRange}
                    disabled={!customStartDate || !customEndDate}
                    className="w-full"
                  >
                    Apply Custom Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected Range Display */}
          {selectedRange && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Selected:</strong> {selectedRange.label}
              <br />
              <span className="text-xs">
                {format(selectedRange.startDate, "PPP")} -{" "}
                {format(selectedRange.endDate, "PPP")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
