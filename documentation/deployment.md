# Deployment and Operations

## Environments

Use three Vercel environments:

- **Local:** developer machine with test Supabase project and restricted Gemini key.
- **Preview:** GitHub pull-request deployment with isolated or shared non-production data.
- **Production:** protected Vercel deployment with production Supabase and Gemini credentials.

Never use production customer data in local development or automated tests.

## Environment variables

Configure these in Vercel and local environment files:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
GEMINI_MODEL
NEXT_PUBLIC_APP_URL
```

Only `NEXT_PUBLIC_*` variables may be exposed to browser code. Verify that service-role and Gemini secrets are imported only from server modules. Add local secret files to `.gitignore`.

## GitHub checks

Pull requests should run the project’s existing:

- Formatting/lint check.
- Type check.
- Unit and integration tests.
- Production build.

The CI job should fail on type errors, missing environment configuration required for the build, invalid migrations, and unsafe test regressions. Do not print secret values in CI logs.

## Supabase migrations

1. Create a migration for tables, constraints, indexes, and RLS.
2. Apply it to the preview project.
3. Run schema and RLS tests.
4. Apply the reviewed migration to production before deploying code that depends on it.
5. Keep migrations immutable after they are applied.

## Release checklist

- Confirm Gemini model and API quota.
- Confirm Vercel secrets exist in the intended environment.
- Confirm Supabase RLS is enabled and ownership policies are tested.
- Confirm the support route does not expose provider errors or secrets.
- Submit a real non-sensitive test question in preview.
- Verify the response is grounded in the brand context.
- Verify a provider failure leaves a request as `PENDING` and shows retry.
- Verify dashboard isolation with two test users.
- Verify mobile layout at narrow viewport widths.
- Verify GitHub checks are green.

## Monitoring

Track operational metrics without storing sensitive content:

- Request count and success/failure count.
- AI latency.
- Rate-limit count.
- Structured-output rejection count.
- Requests pending beyond a useful threshold.
- Escalation frequency by category.

Alert on repeated provider failures, elevated latency, or a growing pending queue. Logs should use request IDs and safe error codes rather than complaint text, email addresses, prompts, or credentials.

## Rollback

If the AI integration fails after release:

1. Keep the form available so requests can be stored as `PENDING`.
2. Show the retry/contact-support fallback.
3. Roll back the application deployment if the failure is code-related.
4. Do not roll back database migrations destructively; create a forward migration if schema correction is required.
5. Reprocess pending requests only through an authorized retry path after the provider is healthy.
