Eres# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**gestock** is an inventory management system (MVP) built with React, TypeScript, Vite, and Supabase. The application allows users to manage businesses (negocios), warehouses (almacenes), and products (productos) with authentication.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Backend/Database**: Supabase (authentication + PostgreSQL)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation

## Common Commands

### Development
```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Architecture

### Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Radix primitives)
│   └── Layout.tsx       # Main app layout with navigation
├── pages/               # Route pages
│   ├── Dashboard.tsx    # Main dashboard with stats
│   ├── Auth.tsx         # Authentication page
│   ├── Almacenes.tsx    # Warehouses management
│   ├── Productos.tsx    # Products management
│   └── NotFound.tsx
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client instance
│       └── types.ts     # Database type definitions
├── hooks/               # Custom React hooks
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
└── App.tsx              # Root component with routing
```

### Routing
Routes are defined in `src/App.tsx`:
- `/` - Dashboard
- `/auth` - Authentication
- `/almacenes` - Warehouses
- `/productos` - Products
- `*` - 404 NotFound (catch-all, always keep last)

**Important**: When adding new routes, add them ABOVE the catch-all `*` route in `App.tsx`.

### Supabase Integration

The application uses Supabase for:
- **Authentication**: Email/password with localStorage persistence
- **Database**: PostgreSQL with typed queries

**Environment Variables** (required in `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Import Supabase client:
```typescript
import { supabase } from "@/integrations/supabase/client";
```

Database schema types are auto-generated in `src/integrations/supabase/types.ts`.

### State Management

- **Server State**: TanStack React Query (configured in `App.tsx`)
- **Component State**: React useState/useEffect
- **Auth State**: Supabase auth session (localStorage)

### UI Components

All UI components are from shadcn/ui in `src/components/ui/`. These are built on Radix UI primitives and styled with Tailwind.

Common patterns:
- Forms: Use `react-hook-form` + `zod` + `@/components/ui/form`
- Toasts: Import from `@/hooks/use-toast` or use `sonner`
- Icons: Lucide React

### Path Aliases

The project uses `@/*` alias for `./src/*`:
```typescript
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
```

### Styling

- **Utility-first**: Tailwind CSS
- **Custom classes**: See `index.css` for custom utilities
- **Glass morphism**: `.glass-card` class used throughout
- **Gradients**: `.gradient-text` for branded text

### Data Model

Based on `Dashboard.tsx`, the database includes:
- `negocios` (businesses)
- `almacenes` (warehouses)
- `productos` (products) with `cantidad`, `precio_unitario`

## Development Notes

### TypeScript Configuration
- `noImplicitAny: false` - Implicit any is allowed
- `strictNullChecks: false` - Null checks are relaxed
- Base URL configured for `@/*` imports

### Vite Configuration
- Dev server runs on `http://[::]:8080`
- SWC used for React Fast Refresh
- `lovable-tagger` plugin enabled in development mode

### Lovable Integration
This project was initially created with Lovable and can be edited via:
- Lovable platform
- Local IDE
- GitHub directly
- GitHub Codespaces

Changes pushed to the repository are reflected in Lovable.
