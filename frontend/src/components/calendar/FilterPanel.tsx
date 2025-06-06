"use client";

import { FilterOptions } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Filter,
  Clock,
  Calendar as CalendarIcon,
  Briefcase,
  Timer,
  Shield,
} from "lucide-react";

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilter = (key: keyof FilterOptions, value: boolean | number) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.businessHoursOnly) count++;
    if (filters.weekdaysOnly) count++;
    if (filters.minDuration > 30) count++;
    if (filters.bufferTime > 0) count++;
    return count;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 transition-all duration-200 hover:shadow-2xl hover:shadow-slate-200/40 hover:border-slate-400/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center">
            <Filter className="mr-3 h-5 w-5 text-blue-600" />
            <div>
              <span className="text-lg font-semibold">Filters</span>
              <p className="text-sm font-normal text-slate-500 mt-0.5">
                Refine your availability search
              </p>
            </div>
          </div>
          {getActiveFilterCount() > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200"
            >
              {getActiveFilterCount()} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Time Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-700">
              Time Preferences
            </h4>
          </div>

          <div className="space-y-4 pl-6">
            {/* Business Hours Only */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="businessHours"
                  checked={filters.businessHoursOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("businessHoursOnly", checked === true)
                  }
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <div>
                  <label
                    htmlFor="businessHours"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Business hours only
                  </label>
                  <p className="text-xs text-slate-500">
                    9 AM - 5 PM working hours
                  </p>
                </div>
              </div>
              <Briefcase className="h-4 w-4 text-slate-400" />
            </div>

            {/* Working Hours Range */}
            {filters.businessHoursOnly && (
              <div className="pl-4 space-y-3 border-l-2 border-blue-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Start Hour
                    </label>
                    <Select
                      value={filters.startHour.toString()}
                      onValueChange={(value) =>
                        updateFilter("startHour", parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-white/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 6).map(
                          (hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour}:00 {hour < 12 ? "AM" : "PM"}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      End Hour
                    </label>
                    <Select
                      value={filters.endHour.toString()}
                      onValueChange={(value) =>
                        updateFilter("endHour", parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-white/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 12).map(
                          (hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour > 12 ? hour - 12 : hour}:00{" "}
                              {hour < 12 ? "AM" : "PM"}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Day Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-700">
              Day Preferences
            </h4>
          </div>

          <div className="pl-6">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="weekdaysOnly"
                  checked={filters.weekdaysOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("weekdaysOnly", checked === true)
                  }
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <div>
                  <label
                    htmlFor="weekdaysOnly"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Weekdays only
                  </label>
                  <p className="text-xs text-slate-500">Monday - Friday only</p>
                </div>
              </div>
              <CalendarIcon className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Slot Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-700">
              Slot Preferences
            </h4>
          </div>

          <div className="space-y-4 pl-6">
            {/* Minimum Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Minimum Duration
                </label>
                <Badge variant="outline" className="text-xs">
                  {filters.minDuration} min
                </Badge>
              </div>
              <div className="px-3">
                <Slider
                  value={[filters.minDuration]}
                  onValueChange={(value: number[]) =>
                    updateFilter("minDuration", value[0])
                  }
                  max={240}
                  min={15}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>15m</span>
                  <span>4h</span>
                </div>
              </div>
            </div>

            {/* Buffer Time */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Buffer Time
                  </label>
                  <p className="text-xs text-slate-500">
                    Padding between meetings
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {filters.bufferTime} min
                </Badge>
              </div>
              <div className="px-3">
                <Slider
                  value={[filters.bufferTime]}
                  onValueChange={(value: number[]) =>
                    updateFilter("bufferTime", value[0])
                  }
                  max={60}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0m</span>
                  <span>60m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">
                Active Filters
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.businessHoursOnly && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-50 text-blue-700"
                >
                  Business Hours
                </Badge>
              )}
              {filters.weekdaysOnly && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-50 text-purple-700"
                >
                  Weekdays Only
                </Badge>
              )}
              {filters.minDuration > 30 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-50 text-orange-700"
                >
                  {filters.minDuration}m+ Duration
                </Badge>
              )}
              {filters.bufferTime > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700"
                >
                  {filters.bufferTime}m Buffer
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
