# Cycle Sync - Personalized Menstrual Cycle Tracking Web Application

<!-- ![Cycle Sync](https://img.shields.io/badge/Cycle%20Sync-Menstrual%20Tracking-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-Latest-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) -->

Cycle Sync is a comprehensive web application designed to help users track, understand, and optimize their lives around their menstrual cycle. The app provides personalized recommendations for nutrition, exercise, and self-care based on the current phase of the user's cycle.

## Features

### 🩸 Cycle Tracking
- **Period Monitoring**: Start and end period tracking with detailed history
- **Cycle Phase Detection**: Automatically identifies your current cycle phase
- **Prediction Algorithm**: Predicts upcoming periods based on your historical data

### 📊 Personalized Dashboard
- **Current Phase Overview**: Visual representation of your current cycle phase
- **Interactive Cycle Chart**: Navigate through your cycle with our intuitive chart
- **Key Stats**: View average cycle length and period duration at a glance

### 🧠 Symptom Tracking
- **Symptom Logging**: Record and monitor symptoms throughout your cycle
- **Severity Rating**: Track symptom intensity to identify patterns
- **Historical Data**: Review past symptoms to understand your unique patterns

### 🥗 Phase-Based Recommendations
- **Nutrition Guidance**: Personalized food recommendations for each phase
- **Exercise Tips**: Optimal workout types and intensities based on your current phase
- **Self-Care Practices**: Physical and emotional self-care suggestions

### 👤 User Profile Management
- **Personal Information**: Manage your personal details
- **Health Metrics**: Track relevant health data
- **Account Settings**: Customize your experience

## Technologies

### Frontend
- **Next.js 14**: React framework with server-side rendering and app router
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Static type-checking for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Accessible and customizable component library
- **Tanstack Query**: Data fetching and state management
- **React Hook Form**: Form validation and handling
- **Chart.js**: Interactive data visualization


## Getting Started

### Prerequisites
- Node.js 16.8.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cycle-sync-webapp.git
cd cycle-sync-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
cycle-sync-webapp/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Dashboard page
│   │   ├── auth/                     # Authentication pages
│   │   ├── onboarding/               # User onboarding flow
│   │   └── user/
│   │       ├── cycle/                # Cycle tracking features
│   │       └── profile/              # User profile management
│   ├── components/
│   │   ├── dashboard/                # Dashboard components
│   │   ├── ui/                       # Reusable UI components
│   │   ├── navbar.tsx                # Navigation bar
│   │   └── footer.tsx                # Footer component
│   ├── lib/
│   │   ├── api-wrapper.ts            # API handling utilities
│   │   ├── helpers.ts                # Helper functions
│   │   ├── routes.ts                 # Application routes
│   │   └── utils.ts                  # Utility functions
│   └── service/
│       └── api/                      # API services
├── public/                           # Static files
└── README.md                         # Project documentation
```


