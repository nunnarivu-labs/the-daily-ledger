# The Daily Ledger

An order management dashboard built with Next.js 16, React 19, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC enabled)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 18 (via Docker) + Drizzle ORM
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style, CSS variables)
- **Data fetching**: TanStack React Query + TanStack React Table
- **Icons**: Tabler Icons React, Lucide React
- **Charts**: Recharts

## Project Structure

```
app/                  # Next.js App Router pages
  dashboard/          # Dashboard page with KPIs and charts
  orders/             # Orders management page
components/           # React components
  ui/                 # shadcn/ui primitives
  kpi-cards/          # KPI card components
  orders/             # Order-specific components
  skeletons/          # Loading skeleton components
db/                   # Database layer
  schema.ts           # Drizzle schema (products, users, orders, orderItems)
  index.ts            # DB connection
  *.ts                # Query functions (chart, kpi, orders-table, order-detail)
query/                # TanStack React Query setup
  query-options.ts    # Query option factories
  query-client-provider.tsx
hooks/                # Custom React hooks
types/                # TypeScript type definitions
utils/                # Utility functions
```

## Common Commands

```bash
npm run dev           # Start Next.js dev server
npm run dev:all       # Start dev server + Docker (via start-dev.sh)
npm run build         # Production build
npm run lint          # ESLint
npm run prettier      # Format code with Prettier
npm run docker:start  # Start PostgreSQL container
npm run docker:stop   # Stop PostgreSQL container
npm run db:push       # Push Drizzle schema to database
npm run db:seed       # Seed database with faker data
```

## Database

- PostgreSQL runs in Docker on port 5432 (user: `user`, password: `password`, db: `daily_ledger`)
- Schema defined in `db/schema.ts` using Drizzle ORM
- Tables: `products`, `users`, `orders`, `order_items`
- Enums: `category` (Coffee Beans, Equipment, Merchandise), `status` (Pending, Shipped, Delivered, Cancelled)
- Config: `drizzle.config.ts`, connection string via `DATABASE_URL` env var

## Conventions

- Path aliases use `@/*` mapping to project root
- shadcn/ui components go in `components/ui/`
- DB query functions live in `db/` alongside the schema
- Type definitions are in `types/` directory
- React Query options are centralized in `query/query-options.ts`
