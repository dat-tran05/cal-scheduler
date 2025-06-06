"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function TestDatePicker() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Date Range Picker Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Date Range Picker Component
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date Range:
              </label>
              <DateRangePicker
                onUpdate={({ range }) => {
                  console.log("Date range updated:", range);
                  setSelectedRange(range);
                }}
                className="w-fit"
              />
            </div>

            {selectedRange && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Selected Range:
                </h3>
                <div className="text-blue-800">
                  {selectedRange.from && (
                    <p>
                      <strong>From:</strong>{" "}
                      {format(selectedRange.from, "EEEE, MMMM dd, yyyy")}
                    </p>
                  )}
                  {selectedRange.to && (
                    <p>
                      <strong>To:</strong>{" "}
                      {format(selectedRange.to, "EEEE, MMMM dd, yyyy")}
                    </p>
                  )}
                  {selectedRange.from && selectedRange.to && (
                    <p className="mt-2 text-sm">
                      <strong>Duration:</strong>{" "}
                      {Math.ceil(
                        (selectedRange.to.getTime() -
                          selectedRange.from.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      days
                    </p>
                  )}
                </div>
              </div>
            )}

            {!selectedRange && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600 text-center">
                  No date range selected yet. Click the button above to select
                  dates.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Auto-close when both dates are selected
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Two-month calendar view
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Proper date formatting with date-fns
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Range selection highlighting
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Responsive design with proper spacing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
