# Dealflow Investors Tracker

A React + TypeScript app for tracking startup investor deal flow and pipeline activity.

## Overview

This project is a Vite-based frontend for managing investor opportunities, pipeline stages, reminders, and company insights.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express (for optional backend/server usage)

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/haikalhamir/dealflow-investors-tracker.git
   cd dealflow-investors-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values. At minimum, configure the required AI credentials:

   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   ```

   The sample file includes:

   ```env
   # GEMINI_API_KEY: Required for Gemini AI API calls.
   GEMINI_API_KEY="MY_GEMINI_API_KEY"

   # APP_URL: The URL where this applet is hosted.
   APP_URL="MY_APP_URL"
   ```

## Run the app

Start the local development server:

```bash
npm run dev
```

Then open the app in your browser at:

```text
http://localhost:3000
```

## Production build

To build the app for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Useful scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run clean
```

## Notes

- The app is configured to run on port `3000` and bind to `0.0.0.0`.
- The project uses local storage to persist deal data in the browser.
- The `Reset Data` control restores the starter demo pipeline.

## License

This project does not currently declare a license in the repository.
