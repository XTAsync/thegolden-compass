<p align="center">
  <img src="assets/logo.svg" alt="thegolden-compass logo" width="180" />
</p>

# Golden Compass Navigator

A Kenya-focused investment and market-analysis platform prototype, bringing portfolio views, market information, investment workflows, and account tools into one interface.

## Highlights

- Portfolio and account dashboards
- Market views and interactive chart components
- Investment and order-history workflows
- Watchlists, alerts, and brokerage-account interfaces
- Administrative and compliance-oriented screens

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite and Nitro
- Supabase
- Drizzle ORM and PostgreSQL
- Tailwind CSS

## Getting Started

Requirements: Node.js and npm.

```bash
git clone https://github.com/XTAsync/thegolden-compass.git
cd thegolden-compass
npm install
npm run dev
```

## Development Commands

```bash
npm run build
npm run typecheck
npm run lint
npm test
npm run test:sql
npm run test:concurrency
```

## Configuration

Configure the required Supabase and other service credentials in your local environment before running backend-dependent features. Use environment templates where provided and never commit secrets.

## Project Status

This is a development prototype, not a live brokerage service. Real-money transactions and investment execution must remain disabled until the required regulatory, operational, and security approvals are in place.
