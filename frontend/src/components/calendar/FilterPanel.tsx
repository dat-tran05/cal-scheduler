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
      <CardContent className="p-4 lg:p-3 space-y-4">
        {/* Business Hours Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-100">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="business-hours"
              checked={filters.businessHoursOnly}
              onCheckedChange={(checked) =>
                onFiltersChange({
                  ...filters,
                  businessHoursOnly: checked === true,
                })
              }
              className="h-5 w-5 lg:h-4 lg:w-4 touch-manipulation"
            />
            <div>
              <label
                htmlFor="business-hours"
                className="text-base lg:text-sm font-medium text-slate-800 cursor-pointer"
              >
                Business Hours Only
              </label>
              <p className="text-sm text-slate-500 mt-0.5">
                Show slots only during working hours
              </p>
            </div>
          </div>
          <Briefcase className="h-5 w-5 text-blue-600" />
        </div>

        {/* Weekdays Only Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="weekdays-only"
              checked={filters.weekdaysOnly}
              onCheckedChange={(checked) =>
                onFiltersChange({
                  ...filters,
                  weekdaysOnly: checked === true,
                })
              }
              className="h-5 w-5 lg:h-4 lg:w-4 touch-manipulation"
            />
            <div>
              <label
                htmlFor="weekdays-only"
                className="text-base lg:text-sm font-medium text-slate-800 cursor-pointer"
              >
                Weekdays Only
              </label>
              <p className="text-sm text-slate-500 mt-0.5">
                Exclude weekends from results
              </p>
            </div>
          </div>
          <CalendarIcon className="h-5 w-5 text-emerald-600" />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-base lg:text-sm font-medium text-slate-700 flex items-center">
              <Clock className="mr-2 h-4 w-4 text-blue-600" />
              Start Hour
            </label>
            <Select
              value={filters.startHour.toString()}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, startHour: parseInt(value) })
              }
            >
              <SelectTrigger className="h-10 lg:h-8 touch-manipulation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-base lg:text-sm font-medium text-slate-700 flex items-center">
              <Clock className="mr-2 h-4 w-4 text-blue-600" />
              End Hour
            </label>
            <Select
              value={filters.endHour.toString()}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, endHour: parseInt(value) })
              }
            >
              <SelectTrigger className="h-10 lg:h-8 touch-manipulation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 25 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration Filter */}
        <div className="space-y-3">
          <label className="text-base lg:text-sm font-medium text-slate-700 flex items-center">
            <Timer className="mr-2 h-4 w-4 text-blue-600" />
            Minimum Duration: {filters.minDuration} minutes
          </label>
          <Slider
            value={[filters.minDuration]}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, minDuration: value })
            }
            max={480}
            min={15}
            step={15}
            className="touch-none py-4 lg:py-2"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>15 min</span>
            <span>8 hours</span>
          </div>
        </div>

        {/* Buffer Time */}
        <div className="space-y-3">
          <label className="text-base lg:text-sm font-medium text-slate-700 flex items-center">
            <Shield className="mr-2 h-4 w-4 text-blue-600" />
            Buffer Time: {filters.bufferTime} minutes
          </label>
          <Slider
            value={[filters.bufferTime]}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, bufferTime: value })
            }
            max={60}
            min={0}
            step={5}
            className="touch-none py-4 lg:py-2"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>No buffer</span>
            <span>1 hour</span>
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
