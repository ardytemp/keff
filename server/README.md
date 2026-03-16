# Keff Backend (Node.js + Express + TypeScript)

REST API for expense management and CRM.

## Quick Start

```bash
cp .env .env.local  # optional override
docker-compose up -d  # start Postgres + Redis
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start with ts-node + nodemon (hot reload)
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled JS from `dist/`

## Project Structure

```
src/
├── index.ts          # Express app entry
├── config/           # DB, Redis, env configuration
├── routes/           # API endpoints
├── middleware/       # Auth, validation, error handling
├── models/           # Data models / SQL queries
└── utils/            # Helpers
```
