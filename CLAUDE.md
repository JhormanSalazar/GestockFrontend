Eres# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**gestock** is an inventory management system (MVP) built with React, JavaScript, and Vite. The application allows users to manage businesses (negocios), warehouses (almacenes), and products (productos) with JWT authentication.

**IMPORTANT**: The project is currently migrating from Supabase to Spring Boot backend API. New services and hooks are implemented for Spring Boot integration. See `MIGRATION_GUIDE.md` for details.

## Tech Stack

- **Frontend**: React 18 with JavaScript (JSX)
- **Build Tool**: Vite
- **Backend API**: Spring Boot REST API (`http://localhost:8080/gestock`)
- **Authentication**: JWT tokens with localStorage
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors

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
├── config/
│   └── axios.config.js  # Axios instance with JWT interceptors
├── services/            # API service layer (NEW - Spring Boot integration)
│   ├── api.service.js   # Base service with HTTP methods
│   ├── auth.service.js  # Authentication (login, register, logout)
│   ├── warehouse.service.js  # Warehouse CRUD operations
│   ├── product.service.js    # Product CRUD operations
│   ├── business.service.js   # Business operations
│   ├── user.service.js       # User management
│   └── index.js         # Service exports
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication with React Query
│   ├── useWarehouses.js # Warehouse queries and mutations
│   ├── useProducts.js   # Product queries and mutations
│   ├── useBusiness.js   # Business data queries
│   ├── useUsers.js      # User management queries
│   └── use-toast.ts     # Toast notifications
├── components/
│   ├── ui/              # shadcn/ui components (Radix primitives)
│   └── Layout.jsx       # Main app layout with navigation
├── pages/               # Route pages
│   ├── Dashboard.jsx    # Main dashboard with stats
│   ├── Auth.jsx         # Authentication page
│   ├── Auth.example.jsx # Example migrated component
│   ├── Almacenes.jsx    # Warehouses management
│   ├── Productos.jsx    # Products management
│   └── NotFound.jsx
├── integrations/
│   └── supabase/        # DEPRECATED - Migrating to Spring Boot
│       ├── client.ts    # Supabase client (to be removed)
│       └── types.ts     # Database types (to be removed)
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
└── App.jsx              # Root component with routing
```

### Routing
Routes are defined in `src/App.tsx`:
- `/` - Dashboard
- `/auth` - Authentication
- `/almacenes` - Warehouses
- `/productos` - Products
- `*` - 404 NotFound (catch-all, always keep last)

**Important**: When adding new routes, add them ABOVE the catch-all `*` route in `App.tsx`.

### Spring Boot API Integration

The application communicates with a Spring Boot REST API backend.

**Environment Variables** (required in `.env`):
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8080/gestock`)

**API Architecture - 3 Layers:**

1. **Axios Config** (`src/config/axios.config.js`)
   - Centralized HTTP client with interceptors
   - Automatic JWT token injection
   - Error handling (401, 403, 500)
   - Auto-redirect on session expiration

2. **Services Layer** (`src/services/`)
   - Business logic and API communication
   - Singleton instances, imported as needed
   - Full JSDoc documentation
   - Example usage:
   ```javascript
   import { authService, warehouseService } from '@/services';

   // Login
   const user = await authService.login({ email, password });

   // Create warehouse
   const warehouse = await warehouseService.create({ name, address });
   ```

3. **React Query Hooks** (`src/hooks/`)
   - State management for API data
   - Automatic caching and refetching
   - Optimistic updates ready
   - Example usage:
   ```javascript
   import { useAuth, useWarehouses } from '@/hooks';

   function Component() {
     const { loginMutation, logout, currentUser } = useAuth();
     const { warehouses, createWarehouse, isLoading } = useWarehouses();

     const handleLogin = (credentials) => {
       loginMutation.mutate(credentials);
     };

     return <div>{/* Your UI */}</div>;
   }
   ```

**Available Services:**
- `authService` - Login, register, logout, token management
- `warehouseService` - CRUD for warehouses
- `productService` - CRUD for products
- `businessService` - Business data operations
- `userService` - User management (ADMIN only)

**Available Hooks:**
- `useAuth()` - Authentication state and mutations
- `useWarehouses()` / `useWarehouse(id)` - Warehouse queries/mutations
- `useProducts()` / `useProduct(id)` - Product queries/mutations
- `useCurrentBusiness()` / `useBusiness(id)` - Business data
- `useUsers()` / `useUser(id)` - User management (ADMIN)

See `MIGRATION_GUIDE.md` for complete migration instructions.

### State Management

- **Server State**: TanStack React Query (queries and mutations)
- **Component State**: React useState/useEffect
- **Auth State**: JWT token in localStorage, managed by authService

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

The backend API provides these resources:
- **Businesses (Negocios)** - Multi-tenant root entity
- **Warehouses (Almacenes)** - Belongs to Business
- **Products (Productos)** - Global catalog
- **WarehouseProduct** - Junction table for stock levels
- **Users** - Belongs to Business with role-based access

See `../GestockBackend/CLAUDE.md` for complete backend documentation.

## Migration Status

**Current State:** Migrating from Supabase to Spring Boot API

✅ **COMPLETED:**
- Axios configuration with JWT interceptors
- Complete service layer (5 services)
- React Query hooks for all resources
- Authentication flow (login/register/logout)
- CRUD operations for all entities

⚠️ **PENDING:**
- Update page components (Auth, Dashboard, Almacenes, Productos)
- Remove Supabase dependencies
- Implement protected routes
- End-to-end testing

See `MIGRATION_GUIDE.md` for step-by-step instructions.

## Development Notes

### TypeScript Configuration
- `noImplicitAny: false` - Implicit any is allowed
- `strictNullChecks: false` - Null checks are relaxed
- Base URL configured for `@/*` imports

### Vite Configuration
- Dev server runs on `http://[::]:8080` (consider changing to port 3000)
- SWC used for React Fast Refresh
- `lovable-tagger` plugin enabled in development mode

### Important Development Guidelines

**When working with the new API architecture:**

1. **Always use services and hooks, never call axios directly**
   ```javascript
   // ❌ BAD
   import axios from 'axios';
   const response = await axios.get('/api/products');

   // ✅ GOOD
   import { useProducts } from '@/hooks/useProducts';
   const { products, isLoading } = useProducts();
   ```

2. **Services are singletons - import and use directly**
   ```javascript
   import { authService } from '@/services';
   const isAuthenticated = authService.isAuthenticated();
   ```

3. **Use React Query hooks in components**
   ```javascript
   const { loginMutation } = useAuth();
   loginMutation.mutate({ email, password });
   ```

4. **JWT tokens are managed automatically**
   - Stored in localStorage as `auth_token`
   - Injected automatically by Axios interceptor
   - Auto-redirect on 401 errors

5. **Multi-tenancy is handled by backend**
   - `businessId` is embedded in JWT
   - Services automatically filter by business
   - No manual filtering needed in frontend
