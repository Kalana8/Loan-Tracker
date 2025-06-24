# Loan-Tracker

A comprehensive application to track loans, payments, and customers.

## ✨ Features

- **Dashboard**: A comprehensive overview of financial activities, including total loans, total payments, and outstanding balances.
- **Customer Management**: Easily add, view, and manage customer information.
- **Loan Management**: Create, track, and manage loans for each customer. View detailed loan information, including principal amount, interest rate, and payment schedule.
- **Payment Tracking**: Record loan payments and keep track of due payments.
- **Authentication**: Secure login for users to access the application.
- **Responsive UI**: A mobile-friendly interface with bottom navigation for easy access on all devices.

## 🛠️ System Details / Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase
- **UI Components**: 
  - Radix UI for accessible and unstyled components.
  - `lucide-react` for icons.
  - `recharts` for charts on the dashboard.
- **Styling**: 
  - `tailwindcss-animate`, `framer-motion` for animations.
  - `tailwind-merge`, `clsx`, `class-variance-authority` for managing CSS classes.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Loan-Tracker.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root directory and add your Supabase credentials:
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Run the development server
    ```sh
    npm run dev
    ```