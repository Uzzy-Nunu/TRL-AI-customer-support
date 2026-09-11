# The Racket Lifestyle Customer Support

TRLcs is a responsive Next.js App Router support experience for The Racket Lifestyle. It provides a grounded Gemini support response, structured automation metadata, a request dashboard, detail views, retry/resolve actions, and Supabase persistence.

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

`GEMINI_API_KEY` is required for a real AI response. The server calls Gemini only; it never fabricates a successful response when Gemini is configured or unavailable. `GEMINI_MODEL` defaults to `gemini-1.5-flash`.

When Supabase URL and service-role variables are absent, development uses a process-local in-memory request store. This fallback is intentionally not durable and should never be used in production. With Supabase configured, apply `supabase/migrations/001_support_requests.sql` and requests are stored in Postgres. Service-role credentials are server-only.

See `.env.example` for all variables:

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/Auth configuration |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side persistence only |
| `GEMINI_API_KEY` | Server-side Gemini API key |
| `GEMINI_MODEL` | Gemini model identifier |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL |

## Commands

```bash
npm run dev       # local development
npm run lint      # Next.js lint
npm run typecheck # TypeScript validation
npm run build     # production build
npm start         # serve a production build
```

## API

- `POST /api/support/requests` validates, persists a pending request, calls Gemini server-side, validates the JSON output, and persists the response.
- `GET /api/support/requests` lists requests scoped to the signed owner cookie.
- `GET /api/support/requests/:id` returns an owned request.
- `POST /api/support/requests/:id/retry` retries a pending response.
- `POST /api/support/requests/:id/resolve` marks an owned response resolved.
- `GET /api/health` exposes non-sensitive service configuration status.

The customer message is treated as untrusted input. Sensitive credential patterns are rejected before the provider call, provider JSON is validated with Zod, and provider errors are returned as safe retryable messages. Read `documentation/architecture.md`, `documentation/ai-integration.md`, and `documentation/data-model.md` for the production boundaries and release checklist.
