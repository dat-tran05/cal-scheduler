# Backend - Cal-Scheduler

## Status: Empty Structure for Future Development

This backend directory is currently empty and not used in the MVP version of Cal-Scheduler.

### Current Architecture

For the MVP, the frontend makes direct API calls to Google Calendar API using the user's OAuth token. This simplifies the architecture and deployment while still providing full functionality.

### Future Development Plans

The backend will be implemented when we need:

1. **User Preferences Storage**

   - Default calendar selections
   - Saved filter settings
   - Custom time ranges

2. **Caching Layer**

   - Cache calendar data to reduce API calls
   - Improve performance for repeated queries

3. **Advanced Features**

   - Team scheduling
   - Meeting suggestions
   - Integration with other calendar systems

4. **Database Integration**
   - User settings persistence
   - Usage analytics
   - Shared availability links

### Technology Stack (Planned)

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (when needed)
- **Authentication**: NextAuth.js integration
- **Deployment**: Railway or Heroku

### Getting Started (When Backend is Needed)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

**Note**: For MVP development, focus on the `/frontend` directory. This backend structure is prepared for future scaling.
