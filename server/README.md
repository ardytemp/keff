# Keff Backend (Node.js + Express + TypeScript)

REST API for expense management and CRM.

## Setup

```bash
npm init -y
npm install express cors helmet pg redis jsonwebtoken bcrypt dotenv
npm install -D typescript @types/node @types/express ts-node nodemon
npx tsc --init
```

## Environment

Copy `.env.example` to `.env` and configure PostgreSQL connection.

## Run

```bash
npm run dev  # ts-node + nodemon
npm run build && npm start
```
