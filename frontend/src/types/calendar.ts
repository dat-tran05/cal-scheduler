export interface Calendar {
  id: string;
  summary: string;
  description?: string;
  accessRole: string;
  selected: boolean;
  backgroundColor?: string;
  primary?: boolean;
}

export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    responseStatus: string;
  }>;
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
  recurrence?: string[];
  status?: string;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  dayOfWeek: string;
}

export interface TimeRange {
  from: Date;
  to: Date;
}

export interface FilterOptions {
  businessHoursOnly: boolean;
  weekdaysOnly: boolean;
  minDuration: number; // in minutes
  startHour: number; // 0-23
  endHour: number; // 0-23
  bufferTime: number; // in minutes
}

export interface CalendarListResponse {
  kind: string;
  etag: string;
  items: Calendar[];
}

export interface CalendarEventsResponse {
  kind: string;
  etag: string;
  summary: string;
  items: CalendarEvent[];
  nextPageToken?: string;
}
