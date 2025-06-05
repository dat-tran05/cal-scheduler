# Cal-Scheduler

Cal-Scheduler is a web application designed to help users quickly find and manage their available time slots by integrating with their Google Calendar.

## Features

- **Google Calendar Integration:** Connects to your Google Calendar(s) to fetch existing events.
- **Availability Calculation:** Intelligently calculates free time slots based on your selected calendars and preferences.
- **Customizable Filters:**
  - Select specific calendars to check.
  - Define time ranges (e.g., Today, Tomorrow, This Week, Custom Range).
  - Filter by business hours, weekdays, custom start/end times.
  - Set minimum event duration and buffer times between slots.
- **Clear Availability Display:** Shows a list of available slots with date, time, and duration.
- **Easy Sharing:** Copy individual or multiple time slots to your clipboard.
- **Secure Authentication:** Uses NextAuth for Google OAuth.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Authentication:** NextAuth.js (Google Provider)
- **API Integration:** Google Calendar API
- **State Management:** React Query, React Context/Hooks

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Google Cloud Platform account with OAuth 2.0 credentials enabled for Google Calendar API.

### Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID= # Your Google OAuth Client ID
GOOGLE_CLIENT_SECRET= # Your Google OAuth Client Secret
```

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cal-scheduler
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    # or
    # yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `frontend/`: Contains the Next.js application.
  - `src/app/`: App Router pages and layouts.
  - `src/components/`: Reusable UI components (including shadcn/ui).
  - `src/lib/`: Utility functions, API clients (e.g., Google Calendar, availability logic).
  - `src/types/`: TypeScript type definitions.
  - `public/`: Static assets.
- `README.md`: This file.
