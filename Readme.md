# Fullstack Monorepo

This workspace is a pnpm + Turbo monorepo with:

- apps/api: NestJS backend API
- apps/web: React + Vite frontend
- packages/database: Prisma schema/client package
- packages/shared: Shared DTO/types used by API and Web

## Prerequisites

- Node.js 20+
- pnpm 10.33.0
- PostgreSQL database

## Environment Setup

Create a .env file in the repository root with at least:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
PORT=3000

Notes:

- PORT is optional (API defaults to 4000 if not provided).
- Web dev proxy points to http://127.0.0.1:3000 by default, so set PORT=3000 for the smoothest local setup.

## Install Dependencies

From repository root:

pnpm install

## Database Setup

Run from repository root:

pnpm db:generate
pnpm db:migrate
pnpm db:seed

Optional:

pnpm db:studio

## Run the Project

Run API + Web together:

pnpm dev

Or run each app separately:

pnpm dev:api
pnpm dev:web

Default local URLs:

- API: http://localhost:3000 (or your PORT value)
- Web: http://localhost:5173

## Build, Test, Lint

From repository root:

pnpm build
pnpm test
pnpm lint
pnpm clean

## Implemented Features

### apps/api (NestJS)

- Users module backed by Prisma + PostgreSQL
	- GET /users
	- GET /users/:id
	- POST /users
- Products module with static catalog endpoint
	- GET /products
- Shared DTO usage from packages/shared
- Environment loading from common .env locations in bootstrap

### apps/web (React + Vite)

- TanStack Query configured globally (QueryClientProvider)
- Product catalog list page
	- Route: /products
	- Fetches data from backend products endpoint via /api/products
- Product detail page
	- Route: /products/:productId
	- Handles invalid id, not found, loading, and error states
- React Router-based navigation
- Vite proxy setup for backend API calls in development

### packages/database (Prisma)

- Prisma schema for User model
- PostgreSQL datasource
- Prisma client generated into local package output

### packages/shared

- Shared DTO contracts:
	- UserDTO
	- CreateUserDTO
	- ProductsDTO

## Useful Workspace Scripts

- pnpm dev: run API + Web via Turbo filters
- pnpm dev:api: run only Nest API
- pnpm dev:web: run only React Web app
- pnpm db:generate | db:migrate | db:seed | db:studio

