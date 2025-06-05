"use client";

import { FilterOptions } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Clock, Calendar as CalendarIcon } from "lucide-react";

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilter = (key: keyof FilterOptions, value: boolean | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Business Hours Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={filters.businessHoursOnly}
            onCheckedChange={(checked) =>
              updateFilter("businessHoursOnly", !!checked)
            }
          />
          <label className="text-sm font-medium">
            Business Hours Only (9 AM - 5 PM)
          </label>
        </div>

        {/* Weekdays Only Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={filters.weekdaysOnly}
            onCheckedChange={(checked) =>
              updateFilter("weekdaysOnly", !!checked)
            }
          />
          <label className="text-sm font-medium">
            Weekdays Only (Mon - Fri)
          </label>
        </div>

        {/* Custom Hours (when business hours is off) */}
        {!filters.businessHoursOnly && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center mb-1">
                <Clock className="mr-1 h-4 w-4" />
                Start Hour
              </label>
              <Select
                value={filters.startHour.toString()}
                onValueChange={(value) =>
                  updateFilter("startHour", parseInt(value))
                }
              >
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium flex items-center mb-1">
                <Clock className="mr-1 h-4 w-4" />
                End Hour
              </label>
              <Select
                value={filters.endHour.toString()}
                onValueChange={(value) =>
                  updateFilter("endHour", parseInt(value))
                }
              >
                <SelectTrigger>
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
          </div>
        )}

        {/* Minimum Duration */}
        <div>
          <label className="text-sm font-medium flex items-center mb-1">
            <CalendarIcon className="mr-1 h-4 w-4" />
            Minimum Duration
          </label>
          <Select
            value={filters.minDuration.toString()}
            onValueChange={(value) =>
              updateFilter("minDuration", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="180">3 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buffer Time */}
        <div>
          <label className="text-sm font-medium flex items-center mb-1">
            <Clock className="mr-1 h-4 w-4" />
            Buffer Time (minutes)
          </label>
          <Select
            value={filters.bufferTime.toString()}
            onValueChange={(value) =>
              updateFilter("bufferTime", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No buffer</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
