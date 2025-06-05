"use client";

import { useState } from "react";
import { AvailableSlot } from "@/types/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Copy,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
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

  const toggleSlot = (slotKey: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((key) => key !== slotKey)
        : [...prev, slotKey]
    );
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
    const text = slots.map(formatSlotText).join("\n");
    copyToClipboard(text, "all");
  };

  const copySelectedSlots = () => {
    const selectedSlotsData = slots.filter((slot) =>
      selectedSlots.includes(`${slot.date}-${slot.startTime}`)
    );
    const text = selectedSlotsData.map(formatSlotText).join("\n");
    copyToClipboard(text, "selected");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 border rounded-lg"
              >
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No available time slots</p>
            <p className="text-sm">
              Try adjusting your filters or selecting a different time range.
            </p>
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
            Available Time Slots ({slots.length})
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copySelectedSlots}
              disabled={selectedSlots.length === 0}
            >
              {copiedSelected ? (
                <CheckCircle className="mr-1 h-4 w-4" />
              ) : (
                <Copy className="mr-1 h-4 w-4" />
              )}
              Copy Selected ({selectedSlots.length})
            </Button>
            <Button variant="outline" size="sm" onClick={copyAllSlots}>
              {copiedAll ? (
                <CheckCircle className="mr-1 h-4 w-4" />
              ) : (
                <Copy className="mr-1 h-4 w-4" />
              )}
              Copy All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {slots.map((slot) => {
            const slotKey = `${slot.date}-${slot.startTime}`;
            const isSelected = selectedSlots.includes(slotKey);
            const date = parseISO(slot.date);
            const hours = Math.floor(slot.duration / 60);
            const minutes = slot.duration % 60;

            return (
              <div
                key={slotKey}
                className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSlot(slotKey)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {format(date, "EEE, MMM d")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {slot.dayOfWeek}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="flex items-center">
                      <span>
                        {hours > 0 && `${hours}h`}
                        {minutes > 0 && `${hours > 0 ? " " : ""}${minutes}m`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(formatSlotText(slot), "selected")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
