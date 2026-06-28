# 🥗 Fitup (Next.js Calorie Tracker)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react&style=flat-square)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.5.0-green?logo=mongodb&style=flat-square)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.0-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/Better--Auth-1.6.19-orange?style=flat-square)](https://better-auth.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini--AI-2.5--flash-7B1FA2?logo=google-gemini&style=flat-square)](https://deepmind.google/technologies/gemini/)

Fitup is a modern, full-featured **Calorie & Physical Activity Tracker** built with Next.js 16 (App Router) and React 19. It is designed to help users log their dietary intake, track physical exercises, and gain insights into their health goals using advanced Gemini AI integrations.

**Check out the Live Application:** [https://fitupjh.vercel.app/](https://fitupjh.vercel.app/)

> Finished application resembles the functionality of [Kalorické Tabuľky](https://kaloricketabulky.sk/).

---

## Application showcase

Here is a showcase video of application:

**[Watch the Fitup Showcase Video on YouTube](https://www.youtube.com/watch?v=4AGnYZbm_gM)**

[![Watch the video](https://img.youtube.com/vi/4AGnYZbm_gM/maxresdefault.jpg)](https://www.youtube.com/watch?v=4AGnYZbm_gM)

---

## Features

- **Calorie & Macro Logging Dashboard**: Keep track of daily meals classified by category timeframe. Track total protein, carbs, fats, fiber, sugar, and salt against personalized daily targets.
- **Gemini AI Integration**:
  - **AI Food Intake Analyzer**: Evaluates daily meals to praise healthy habits, issue warnings, and suggest healthier food alternatives (using structured markup).
  - **AI Food Image Recognition**: Snap or upload a photo of your meal to have the AI identify the dish and estimate its nutritional macro.
- **Hybrid Barcode Scanner**:
  - Uses the browser's native **BarcodeDetector API** for high performance with a fallback to the **ZXing WebAssembly scanner** (`@yudiel/react-qr-scanner`).
  - Supports EAN-13, EAN-8, and UPC-A formats.
  - Queries local database catalog first; if not found, it calls the **Open Food Facts API**, maps nutritional data, seeds it locally, and logs it.
- **Physical Activity & Exercise Tracker**: Log activities (Cardio, Strength, Flexibility, Sports) with MET (Metabolic Equivalent of Task) values to automatically calculate active calorie burn based on user weight.
- **Interactive Onboarding Tour**: Powered by `driver.js` to guide new users step-by-step through the application dashboard.
- **Internationalization (i18n)**: Fully supports dynamic locale routing (`[lng]`) for **English** and **Slovak** (`sk`).
- **Secure Authentication**: Implemented via **Better-Auth** supporting email/password and social OAuth providers (Google, GitHub, Discord).

---

## Security, Validation & Rate Limiting

- **Secure API Authentication**: Custom API endpoints are protected using a centralized `withAuth` wrapper that validates user sessions via **Better Auth**, ensuring only authenticated requests are processed.
- **Granular Rate Limiting**: Leverages **Upstash Redis** (`@upstash/ratelimit`) to enforce rate limiting on a per-user, per-endpoint basis. Custom limits are specified per path (e.g., a default of 60 requests/minute for standard endpoints, and a strict limit of 10 requests/minute for resource-heavy AI endpoints).
- **Zod Schema Validation**: Strict type-safety and data validation are enforced on both the client (Formik forms) and server (database hooks and API inputs) using **Zod schemas** (`updateUserSchema`, `signupSchema`, `onboardingSchema`).
- **AI Route Protection & Injection Prevention**:
  - **Strict Input Allow-listing**: Localization parameters are validated against a strict compile-time allow-list to prevent prompt injection.
  - **Magic Byte Verification**: Decodes base64 data and checks file signatures (magic bytes) to verify that uploaded files are genuine images (`JPEG`, `PNG`, `WEBP`, `GIF`) rather than arbitrary malicious payloads.
  - **Payload Size Limits**: Limits incoming image payloads to a maximum of 10MB to prevent memory exhaustion and Denial of Service (DoS) attacks.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion, HeroUI (`@heroui/react`), React Icons
- **State & Data Fetching**: Redux Toolkit, TanStack React Query (v5)
- **Database**: MongoDB with Mongoose & Typegoose
- **Authentication**: Better-Auth (using MongoDB Adapter)
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash)
- **Data Visualization**: Chart.js (`react-chartjs-2`)
- **Assets & Performance**: Vercel Blob, Vercel Speed Insights

---

## Getting Started

Follow these steps to run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/janho/Fitupjh.git
cd Fitupjh
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fitup

# Better Auth Secret
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here

# Social Authentication Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### 4. Seed the Database

Populate your database with the USDA food database, physical activity metadata, and optional historical data:

```bash
# Seed the core food database
npx tsx scripts/seed-foods.ts

# Seed physical activities
npx tsx scripts/seed-activities.ts

# Seed 30-day historical log data for local testing (don't forget to set userID inside this script)
npx tsx scripts/seedUserMonth.ts
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.
