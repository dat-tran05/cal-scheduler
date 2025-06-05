import {
  Calendar,
  CalendarEvent,
  CalendarListResponse,
  CalendarEventsResponse,
} from "@/types/calendar";

const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export async function fetchAllCalendars(
  accessToken: string
): Promise<Calendar[]> {
  try {
    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch calendars: ${response.statusText}`);
    }

    const data: CalendarListResponse = await response.json();

    return data.items.map((calendar) => ({
      ...calendar,
      selected: calendar.accessRole === "owner", // Default to selecting owned calendars
    }));
  } catch (error) {
    console.error("Error fetching calendars:", error);
    throw error;
  }
}

export async function fetchEventsFromCalendar(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  try {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "2500",
    });

    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(
        calendarId
      )}/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events from calendar ${calendarId}: ${response.statusText}`
      );
    }

    const data: CalendarEventsResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching events from calendar ${calendarId}:`, error);
    throw error;
  }
}

export async function fetchEventsFromMultipleCalendars(
  accessToken: string,
  calendarIds: string[],
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  try {
    const allEventsPromises = calendarIds.map((id) =>
      fetchEventsFromCalendar(accessToken, id, timeMin, timeMax)
    );

    const allEventsArrays = await Promise.all(allEventsPromises);
    const allEvents = allEventsArrays.flat();

    // Sort events by start time
    return allEvents.sort((a, b) => {
      const aStart = new Date(a.start.dateTime || a.start.date || "");
      const bStart = new Date(b.start.dateTime || b.start.date || "");
      return aStart.getTime() - bStart.getTime();
    });
  } catch (error) {
    console.error("Error fetching events from multiple calendars:", error);
    throw error;
  }
}

export async function fetchPrimaryCalendar(
  accessToken: string
): Promise<Calendar> {
  try {
    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/calendars/primary`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch primary calendar: ${response.statusText}`
      );
    }

    const calendar = await response.json();
    return {
      ...calendar,
      selected: true,
      primary: true,
    };
  } catch (error) {
    console.error("Error fetching primary calendar:", error);
    throw error;
  }
}
