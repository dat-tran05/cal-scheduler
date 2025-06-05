# Cal-Scheduler: Calendar Availability Tool

## Product Overview

Cal-Scheduler is a full-stack application that analyzes your Google Calendar to show available time slots. The MVP focuses on core functionality: Google authentication, calendar access (including shared calendars), and availability listing for configurable time ranges.

## Problem Statement

Finding available time slots across multiple calendars (personal + shared) is tedious and time-consuming. Users need a simple tool to quickly see when they're free for meetings or appointments across all their accessible calendars.

## MVP Solution

A clean, modern web application that:

1. **Authenticates** users with Google OAuth
2. **Fetches** calendar events from Google Calendar API (primary + shared calendars)
3. **Calculates** available time slots across all selected calendars
4. **Displays** availability for user-selected time ranges

## MVP Features

### 🔐 Authentication

- Google OAuth 2.0 integration using NextAuth.js
- Session management for the duration of the visit
- Secure access to Google Calendar API
- Read-only calendar permissions

### 📅 Calendar Access

- Connect to user's primary Google Calendar
- **Access to shared/other calendars** that user has read access to
- Fetch calendar events via Google Calendar API
- Handle basic recurring events
- Support for all-day events and timed events
- Calendar selection (choose which calendars to include in availability calculation)

### ⏰ Availability Calculation

- **Time Range Selection**

  - Today
  - Tomorrow
  - This week
  - Next week
  - Custom date range (start/end date picker)

- **Basic Filtering**
  - Business hours only (9 AM - 5 PM)
  - Weekdays only (Monday - Friday)
  - Minimum time slot duration (30 min, 1 hour, 2 hours)

### 📋 Availability Display

- Clean list of available time slots
- Show date, start time, end time, and duration
- Copy individual time slots to clipboard
- Copy all availability to clipboard as formatted text

## Technical Architecture

### Frontend (Next.js)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: NextAuth.js
- **State Management**: React Query + Context
- **API Communication**: REST API calls to backend

### Backend (Node.js/Express) - _Initially Empty_

- **Framework**: Express.js with TypeScript
- **Purpose**: Future API endpoints and business logic
- **Database**: None initially (may add PostgreSQL later)
- **Status**: Empty repository structure for future use

_Note: For MVP, all Google Calendar API calls will be made directly from the frontend. Backend will be set up as empty project structure for future scaling._

## Technical Stack

### Frontend (`/frontend`)

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **shadcn/ui** component library
- **Radix UI** primitives

### Authentication & APIs

- **NextAuth.js** for Google OAuth
- **Google Calendar API v3** (called directly from frontend)
- **React Query** for API state management

### UI Components

- **shadcn/ui** components:
  - Button, Card, Input, Select
  - Calendar, DatePicker
  - Sheet, Dialog, Popover
  - Table, Badge, Separator, Checkbox
- **Radix UI** primitives for accessibility
- **Lucide React** for icons

### Backend (`/backend`) - _Empty Structure_

- **Express.js** with TypeScript
- **Folder structure** prepared for future development
- **No active endpoints** in MVP

### Deployment

- **Frontend**: Vercel
- **Backend**: Railway/Heroku (when needed)
- **Environment variables** for API keys
- **Automatic deployments** from GitHub

## Updated User Flow (MVP)

### 1. Landing Page

```
┌─────────────────────────────────────┐
│         Cal-Scheduler               │
│                                     │
│  Find your available time slots    │
│  across all your calendars         │
│                                     │
│     [Sign in with Google]          │
└─────────────────────────────────────┘
```

### 2. Authentication

- User clicks "Sign in with Google"
- Google OAuth consent screen
- Grant calendar read permissions
- Redirect back to dashboard

### 3. Calendar Selection

```
┌─────────────────────────────────────┐
│  📅 Cal-Scheduler    [User Avatar]  │
├─────────────────────────────────────┤
│                                     │
│  Select Calendars to Include:       │
│  ☑ Personal Calendar               │
│  ☑ Work Calendar                   │
│  ☑ Team Events                     │
│  ☐ Holiday Calendar                │
│                                     │
│     [Continue to Availability]     │
└─────────────────────────────────────┘
```

### 4. Availability Dashboard

```
┌─────────────────────────────────────┐
│  📅 Cal-Scheduler    [User Avatar]  │
├─────────────────────────────────────┤
│                                     │
│  Select Time Range:                 │
│  ○ Today  ○ Tomorrow  ○ This Week   │
│  ○ Next Week  ○ Custom Range       │
│                                     │
│  Filters:                          │
│  ☑ Business Hours (9 AM - 5 PM)   │
│  ☑ Weekdays Only                  │
│  Min Duration: [1 hour ▼]         │
│                                     │
│     [Find Availability]            │
│                                     │
│  📋 Available Time Slots:          │
│  ┌─────────────────────────────┐   │
│  │ Mon, Dec 16                 │   │
│  │ 10:00 AM - 11:30 AM (1.5h) │   │
│  │ 2:00 PM - 4:00 PM (2h)     │   │
│  └─────────────────────────────┘   │
│                                     │
│     [Copy All]  [Copy Selected]    │
└─────────────────────────────────────┘
```

## API Requirements

### Google Calendar API

- **Scope**: `https://www.googleapis.com/auth/calendar.readonly`
- **Endpoints**:
  - `GET /calendar/v3/users/me/calendarList` - List all accessible calendars
  - `GET /calendar/v3/calendars/{calendarId}/events` - Fetch events from specific calendar
  - `GET /calendar/v3/calendars/primary` - Get primary calendar info

### NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
      params: {
        scope:
          "openid email profile https://www.googleapis.com/auth/calendar.readonly",
      },
    },
  }),
];
```

## Project Structure

```
cal-scheduler/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Main dashboard
│   │   │   ├── calendars/
│   │   │   │   └── page.tsx          # Calendar selection
│   │   │   └── api/
│   │   │       ├── auth/[...nextauth]/
│   │   │       ├── calendars/
│   │   │       └── availability/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── auth/
│   │   │   │   └── SignInButton.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── CalendarSelector.tsx
│   │   │   │   ├── TimeRangeSelector.tsx
│   │   │   │   ├── FilterPanel.tsx
│   │   │   │   └── AvailabilityList.tsx
│   │   │   └── layout/
│   │   │       └── Header.tsx
│   │   ├── lib/
│   │   │   ├── auth.ts               # NextAuth config
│   │   │   ├── google-calendar.ts    # API helpers
│   │   │   ├── availability.ts       # Logic for calculating free time
│   │   │   └── utils.ts              # Utility functions
│   │   └── types/
│   │       └── calendar.ts           # TypeScript types
│   ├── components.json               # shadcn/ui config
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
├── backend/                     # Express.js Backend (Empty for now)
│   ├── src/
│   │   ├── routes/              # API routes (empty)
│   │   ├── middleware/          # Express middleware (empty)
│   │   ├── utils/              # Utility functions (empty)
│   │   └── types/              # TypeScript types (empty)
│   ├── package.json
│   └── README.md               # "Backend setup for future use"
├── docs/
│   └── prd.md
└── README.md
```

## Environment Variables

### Frontend (`/frontend/.env.local`)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend (`/backend/.env`) - _Empty for now_

```env
# Future backend environment variables
# PORT=5000
# DATABASE_URL=your-database-url
```

## Development Setup

### 1. Frontend Setup

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app
npm install next-auth
npm install @tanstack/react-query
npm install date-fns lucide-react
npm install googleapis

# UI Components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select calendar checkbox
```

### 2. Backend Setup (Empty structure)

```bash
cd backend
npm init -y
npm install express typescript @types/node @types/express
npm install -D nodemon ts-node

# Create empty folder structure
mkdir -p src/routes src/middleware src/utils src/types
echo "# Backend - Future Development" > README.md
```

### 3. Google Cloud Setup

1. Create project in Google Cloud Console
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:3000` to authorized origins
5. Add `http://localhost:3000/api/auth/callback/google` to redirect URIs

### 4. Run Development Servers

```bash
# Frontend
cd frontend && npm run dev

# Backend (when needed)
cd backend && npm run dev
```

## Key Components for Shared Calendar Support

### CalendarSelector Component

```typescript
interface Calendar {
  id: string;
  summary: string;
  description?: string;
  accessRole: string;
  selected: boolean;
}

const CalendarSelector = ({
  calendars,
  onSelectionChange,
}: {
  calendars: Calendar[];
  onSelectionChange: (selectedIds: string[]) => void;
}) => {
  // Render checkboxes for each calendar
  // Allow user to select which calendars to include
};
```

### Enhanced Google Calendar API Helper

```typescript
// lib/google-calendar.ts
export async function fetchAllCalendars(
  accessToken: string
): Promise<Calendar[]> {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.json();
}

export async function fetchEventsFromMultipleCalendars(
  accessToken: string,
  calendarIds: string[],
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  const allEvents = await Promise.all(
    calendarIds.map((id) =>
      fetchEventsFromCalendar(accessToken, id, timeMin, timeMax)
    )
  );
  return allEvents
    .flat()
    .sort(
      (a, b) =>
        new Date(a.start.dateTime || a.start.date) -
        new Date(b.start.dateTime || b.start.date)
    );
}
```

## MVP Success Criteria

### Functional Requirements

- [ ] User can sign in with Google OAuth
- [ ] App can access user's primary Google Calendar
- [ ] **App can list and access user's shared/other calendars**
- [ ] **User can select which calendars to include in availability calculation**
- [ ] User can select time ranges (today, tomorrow, this week, next week, custom)
- [ ] App calculates and displays available time slots across selected calendars
- [ ] User can apply basic filters (business hours, weekdays only, minimum duration)
- [ ] User can copy availability to clipboard

### Technical Requirements

- [ ] **Separate frontend and backend project structures**
- [ ] **Backend folder structure created (but empty)**
- [ ] Responsive design (mobile and desktop)
- [ ] Fast loading times (<3 seconds)
- [ ] Error handling for API failures
- [ ] Proper TypeScript types throughout
- [ ] Accessible UI components

### Deployment Requirements

- [ ] Deploy frontend to Vercel successfully
- [ ] Environment variables configured
- [ ] Google OAuth working in production
- [ ] HTTPS enabled

## Future Backend Usage

### When Backend Will Be Needed

- **User preferences storage** (selected calendars, default filters)
- **Caching layer** for calendar data
- **Advanced features** like team scheduling
- **Database integration** for user settings
- **Webhook handling** for real-time calendar updates

### Migration Path

1. **Phase 1 (MVP)**: Frontend-only with direct Google API calls
2. **Phase 2**: Introduce backend for user preferences and caching
3. **Phase 3**: Move calendar processing to backend for performance
4. **Phase 4**: Add advanced features requiring server-side logic

---

**Repository**: [github.com/dat-tran05/cal-scheduler](https://github.com/dat-tran05/cal-scheduler)
**Demo**: [cal-scheduler.vercel.app](https://cal-scheduler.vercel.app) _(coming soon)_
**Stack**: Next.js 14, TypeScript, TailwindCSS, shadcn/ui, NextAuth.js (Frontend) + Express.js (Backend - Empty)
**Last Updated**: December 2024
