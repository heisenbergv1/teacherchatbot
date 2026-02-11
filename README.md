<a href="#">
  <h1 align="center">Teaching AI Chat App</h1>
</a>

## Overview

This project is a modern web-based chat application with AI-powered responses, user authentication, and persistent chat history. It is designed as a learning-focused personal project and can be extended for real-world use.

---

## Tech Stack

### Frontend

* **Next.js (App Router)** – Routing, layouts, Server Components
* **React** – UI rendering and client-side interactions
* **Tailwind CSS** – Utility-first styling
* **shadcn/ui** – Accessible component primitives
* **Lucide Icons** – Icon system

### Backend

* **Node.js (Next.js server runtime)** – API routes, Server Actions, middleware
* **PostgreSQL (via Supabase or direct PG driver)** – Persistent storage (users, chats, messages)
* **Authentication (NextAuth.js)** – Session-based authentication with JWT
* **LLM Provider (OpenAI / Anthropic / etc.)** – AI inference via environment-configured provider

### Database Layer

* **Supabase (optional integration)** – Hosted PostgreSQL + auth helpers
* **Drizzle ORM / SQL** – Type-safe database access

---

## Features

- User authentication
- Chat sessions with message history
- Streaming AI responses
- Server-rendered and client-interactive UI
- Database-backed persistence
- Clean separation of UI, domain, and infrastructure

---

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (local or hosted)
- Redis (local or hosted)
- API key for your chosen AI model provider

---

### Environment Variables

Create a `.env.local` file based on `.env.example`:

## Core Application

```env
NODE_ENV=production
APP_URL=http://localhost:3000
````

* **NODE_ENV**
  Sets the runtime mode. Use `production` for deployed builds.

* **APP_URL**
  Public base URL of the application. Must match where the app is accessed.

## Authentication

```env
AUTH_SECRET=your-random-secret
```

* **AUTH_SECRET**
  Used to sign and encrypt authentication sessions.
  Must be a secure random string.

  Generate one using:

  ```bash
  openssl rand -base64 32
  ```

## AI Provider (Anthropic)

```env
ASSISTANT_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

ASSISTANT_ANTHROPIC_CHAT_MODEL=claude-sonnet-4-5-20250929
ASSISTANT_ANTHROPIC_REASONING_MODEL=claude-sonnet-4-5-20250929
ASSISTANT_ANTHROPIC_TITLE_MODEL=claude-3-5-haiku-20241022
ASSISTANT_ANTHROPIC_ARTIFACT_MODEL=claude-3-5-haiku-20241022
```

* **ASSISTANT_PROVIDER**
  Selects the AI backend. Currently set to `anthropic`.

* **ANTHROPIC_API_KEY**
  API key for Anthropic access.

* **Model variables**
  Define which models are used for:

  * Chat responses
  * Reasoning
  * Title generation
  * Artifact generation

## Storage

### PostgreSQL Database

```env
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
```

* **POSTGRES_URL**
  Primary database connection string.
  Required for users, chats, messages, and stream state.

### Redis

```env
REDIS_URL=redis://default:password@host:port
```

* **REDIS_URL**
  Used for caching, streaming state, or ephemeral session data.

## Installation

Install dependencies:

```bash
pnpm install

# Run migrations
pnpm db:migrate

# Optional: reset database
pnpm db:reset

# Open Drizzle Studio
pnpm db:studio
```

Ensure you have a `.env.local` file configured. You can use `.env.example` as a reference.

## Installation

Install dependencies:

```bash
pnpm install
````

---

## Database Setup

The project uses **Drizzle ORM** for database migrations and management.

```bash
# Run migrations
pnpm db:migrate

# Optional: reset database
pnpm db:reset

# Open Drizzle Studio
pnpm db:studio
```

Other useful Drizzle commands:

```bash
pnpm db:generate   # Generate types from schema
pnpm db:push       # Push schema to DB
pnpm db:pull       # Pull schema from DB
pnpm db:check      # Check schema consistency
pnpm db:up         # Apply pending migrations
```

## Running Locally

Start the development server with:

```bash
pnpm dev
```

The app will be available at:

```
http://localhost:3000
```

## Build & Start

Build and start the production version:

```bash
# Build (runs migrations first)
pnpm build

# Start production server
pnpm start
```

## Code Quality

Check linting and formatting:

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

## Testing

Run end-to-end tests using Playwright:

```bash
pnpm test
```

> Make sure `PLAYWRIGHT=True` is set in your environment when running tests.







