"use client";

import { useState, useMemo } from "react";
import { AvailableSlot } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  Search,
  X,
  Download,
  Filter,
  Check,
  Star,
  Sparkles,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface AvailabilityListProps {
  slots: AvailableSlot[];
  loading?: boolean;
}

export function AvailabilityList({
  slots,
  loading = false,
}: AvailabilityListProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSelected, setCopiedSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "duration">("date");

  // Filter and sort slots
  const filteredAndSortedSlots = useMemo(() => {
    let filtered = slots;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = slots.filter(
        (slot) =>
          slot.dayOfWeek.toLowerCase().includes(query) ||
          format(parseISO(slot.date), "MMM d").toLowerCase().includes(query) ||
          slot.startTime.includes(query) ||
          slot.endTime.includes(query)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return b.duration - a.duration;
      }
    });
  }, [slots, searchQuery, sortBy]);

  const toggleSlot = (slotKey: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((key) => key !== slotKey)
        : [...prev, slotKey]
    );
  };

  const selectAll = () => {
    setSelectedSlots(
      filteredAndSortedSlots.map((slot) => `${slot.date}-${slot.startTime}`)
    );
  };

  const selectNone = () => {
    setSelectedSlots([]);
  };

  const formatSlotText = (slot: AvailableSlot) => {
    const date = parseISO(slot.date);
    const hours = Math.floor(slot.duration / 60);
    const minutes = slot.duration % 60;
    const durationText =
      hours > 0
        ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
        : `${minutes}m`;

    return `${format(date, "EEE, MMM d")} • ${slot.startTime} - ${
      slot.endTime
    } (${durationText})`;
  };

  const copyToClipboard = async (text: string, type: "all" | "selected") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else {
        setCopiedSelected(true);
        setTimeout(() => setCopiedSelected(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const copyAllSlots = () => {
    const text = filteredAndSortedSlots.map(formatSlotText).join("\n");
    copyToClipboard(text, "all");
  };

  const copySelectedSlots = () => {
    const selectedSlotsData = filteredAndSortedSlots.filter((slot) =>
      selectedSlots.includes(`${slot.date}-${slot.startTime}`)
    );
    const text = selectedSlotsData.map(formatSlotText).join("\n");
    copyToClipboard(text, "selected");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getDurationColor = (duration: number) => {
    if (duration >= 180)
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (duration >= 120) return "bg-blue-100 text-blue-700 border-blue-200";
    if (duration >= 60)
      return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 h-full">
        <CardHeader className="border-b-2 border-slate-200/80 bg-white/80 backdrop-blur-md">
          <CardTitle className="flex items-center text-slate-800">
            <div className="relative">
              <CalendarIcon className="mr-3 h-5 w-5 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 bg-blue-200 blur-xl opacity-20 animate-pulse"></div>
            </div>
            <span className="text-lg font-semibold">Available Time Slots</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-4 border border-slate-100 rounded-xl bg-white/40 backdrop-blur-sm"
              >
                <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 h-full">
        <CardHeader className="border-b-2 border-slate-200/80 bg-white/80 backdrop-blur-md">
          <CardTitle className="flex items-center text-slate-800">
            <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Available Time Slots</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-slate-500">
            <div className="relative mb-6">
              <CalendarIcon className="mx-auto h-16 w-16 text-slate-300" />
              <div className="absolute inset-0 bg-slate-200 blur-xl opacity-20"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-700">
              No available time slots
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Try adjusting your filters, selecting different calendars, or
              choosing a different time range to find available slots.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md border-2 border-slate-300/70 shadow-xl shadow-slate-200/30 h-full flex flex-col transition-all duration-200 hover:shadow-2xl hover:shadow-slate-200/40">
      <CardHeader className="border-b-2 border-slate-200/80 bg-white/80 backdrop-blur-md flex-shrink-0">
        <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <Sparkles className="ml-1 h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-lg font-semibold text-slate-800">
                Available Slots
              </span>
              <p className="text-sm font-normal text-slate-500 mt-0.5">
                {filteredAndSortedSlots.length} of {slots.length} slots
                {selectedSlots.length > 0 &&
                  ` • ${selectedSlots.length} selected`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSlots.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySelectedSlots}
                  className="h-9 lg:h-8 text-sm lg:text-xs border-blue-200 text-blue-600 hover:bg-blue-50 touch-manipulation"
                >
                  {copiedSelected ? (
                    <CheckCircle className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
                  ) : (
                    <Copy className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
                  )}
                  Copy Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectNone}
                  className="h-9 lg:h-8 text-sm lg:text-xs text-slate-600 hover:bg-slate-50 touch-manipulation"
                >
                  <X className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
                  Clear
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={
                filteredAndSortedSlots.length === selectedSlots.length
                  ? selectNone
                  : selectAll
              }
              className="h-9 lg:h-8 text-sm lg:text-xs border-slate-200 hover:bg-slate-50 touch-manipulation"
            >
              <Check className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
              {filteredAndSortedSlots.length === selectedSlots.length
                ? "None"
                : "All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllSlots}
              className="h-9 lg:h-8 text-sm lg:text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50 touch-manipulation"
            >
              {copiedAll ? (
                <CheckCircle className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
              ) : (
                <Download className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
              )}
              Export All
            </Button>
          </div>
        </CardTitle>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-3 py-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search slots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 lg:h-8 bg-white/60 border-slate-200 text-sm focus:border-blue-300 focus:ring-blue-200"
            />
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 lg:h-6 lg:w-6 p-0 hover:bg-slate-100 touch-manipulation"
              >
                <X className="h-4 w-4 lg:h-3 lg:w-3" />
              </Button>
            )}
          </div>

          {/* Sort */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "date" ? "duration" : "date")}
            className="h-10 lg:h-8 text-sm lg:text-xs border-slate-200 hover:bg-slate-50 whitespace-nowrap touch-manipulation"
          >
            <Filter className="mr-1 h-4 w-4 lg:h-3 lg:w-3" />
            Sort by {sortBy === "date" ? "Duration" : "Date"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          <div className="space-y-3">
            {filteredAndSortedSlots.map((slot) => {
              const slotKey = `${slot.date}-${slot.startTime}`;
              const isSelected = selectedSlots.includes(slotKey);
              const date = parseISO(slot.date);
              const hours = Math.floor(slot.duration / 60);
              const minutes = slot.duration % 60;

              return (
                <div
                  key={slotKey}
                  className={`group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.98] sm:active:scale-100 hover:shadow-md touch-manipulation ${
                    isSelected
                      ? "border-blue-200 bg-blue-50/50 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 bg-white/40 backdrop-blur-sm hover:bg-white/60"
                  }`}
                  onClick={() => toggleSlot(slotKey)}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSlot(slotKey)}
                      className="h-5 w-5 sm:h-4 sm:w-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 touch-manipulation"
                    />

                    <div className="flex-1 min-w-0 sm:min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-800 text-base sm:text-sm">
                          {format(date, "EEE, MMM d")}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-sm sm:text-xs bg-slate-100 text-slate-600 border-slate-200"
                        >
                          {slot.dayOfWeek}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-sm sm:text-xs ${getDurationColor(
                            slot.duration
                          )}`}
                        >
                          {hours > 0 && `${hours}h`}
                          {minutes > 0 && `${hours > 0 ? " " : ""}${minutes}m`}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Clock className="mr-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5 text-blue-500" />
                          <span className="font-medium text-base sm:text-sm">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(formatSlotText(slot), "selected");
                        }}
                        className="h-9 w-9 sm:h-8 sm:w-8 p-0 hover:bg-slate-100 touch-manipulation"
                      >
                        <Copy className="h-4 w-4 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                    {isSelected && (
                      <div className="flex items-center">
                        <Star className="h-5 w-5 sm:h-4 sm:w-4 text-blue-500 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Footer */}
          {filteredAndSortedSlots.length > 10 && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Showing {filteredAndSortedSlots.length} available time slots
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
