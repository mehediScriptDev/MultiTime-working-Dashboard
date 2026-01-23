# TimeSync

## Overview

TimeSync is a timezone management web application that allows users to track and compare multiple timezones. Users can add timezone locations, configure working hours, and visualize time differences across different regions. The application offers a freemium model where free users are limited to 3 timezones, while premium users get unlimited access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Date/Time Handling**: Day.js with timezone and UTC plugins

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with Local Strategy, session-based authentication using express-session
- **Password Security**: Scrypt hashing with random salts
- **API Design**: RESTful JSON APIs under `/api` prefix

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via @neondatabase/serverless driver)
- **Schema Location**: `shared/schema.ts` defines tables for users and timezones
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Session Storage**: Currently using MemoryStore (should be replaced with PostgreSQL session store for production)

### Authentication Flow
- Session-based authentication with cookies
- Local strategy for email/password login
- Protected routes redirect unauthenticated users to `/auth`
- Premium status tracked on user model for feature gating

### Shared Code Pattern
- `shared/` directory contains schema definitions and types shared between client and server
- Zod schemas for validation are generated from Drizzle schemas using `drizzle-zod`
- Path aliases configured: `@/*` for client code, `@shared/*` for shared code

### Build Configuration
- Development: Vite dev server with HMR proxied through Express
- Production: Vite builds static assets to `dist/public`, Express serves them
- esbuild bundles server code for production deployment

## External Dependencies

### Database
- **PostgreSQL**: Primary database via Neon serverless driver
- **Connection**: Uses `DATABASE_URL` environment variable

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)

### Key Libraries
- **UI Components**: Full shadcn/ui component library with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Date Handling**: Day.js with timezone support
- **Form Validation**: Zod schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage (configured but using MemoryStore fallback)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (optional, has fallback)