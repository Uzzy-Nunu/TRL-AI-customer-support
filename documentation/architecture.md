# Architecture

## System boundary

The application owns support requests, AI responses, automation metadata, and customer-facing status. It does not own checkout, payments, inventory, shipping carriers, or a human support CRM. Those systems may be integrated later through authorized server-side adapters.

## Request lifecycle

```text
Form submit
  -> client validation
  -> POST /api/support/requests
  -> server authentication and rate limit
  -> schema validation and normalization
  -> insert PENDING request
  -> build grounded Gemini context
  -> call Gemini with timeout
  -> validate structured output
  -> update request to AI_RESPONDED
  -> return saved response
```

If any step after the initial insert fails, retain the request as `PENDING`, record a safe internal failure code, and return a retryable response. Do not delete the customer’s request because the provider was unavailable.

## API contract

### Create request

`POST /api/support/requests`

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "subject": "Tracking has not updated",
  "complaint": "My order shipped yesterday but the tracking page still has no movement.",
  "category": "SHIPPING",
  "orderNumber": "TRL-10482"
}
```

Success response:

```json
{
  "request": {
    "id": "uuid",
    "status": "AI_RESPONDED",
    "category": "SHIPPING",
    "urgency": "NORMAL",
    "summary": "Customer is asking about an unchanged shipment tracking update.",
    "aiResponse": "If your tracking has not updated yet...",
    "needsEscalation": false,
    "safeNextStep": "Allow some time after the shipping confirmation..."
  }
}
```

Error responses should use stable application codes such as `VALIDATION_ERROR`, `UNAUTHORIZED`, `RATE_LIMITED`, `AI_UNAVAILABLE`, and `INTERNAL_ERROR`. The public message should be safe and actionable; provider details belong only in protected logs.

## Authorization

- Authenticate requests with Supabase Auth where possible.
- Scope dashboard queries to the authenticated user.
- Perform an authorization check on every detail, retry, and resolve operation.
- Keep service-role credentials in server-only modules.
- Never trust a customer-supplied user ID or request owner field.

## Provider abstraction

Create a small server-side `AiSupportProvider` interface so Gemini is the production implementation and a deterministic fake can be used in tests. The interface should accept a normalized support request and context, and return the validated response contract. It must not expose raw provider SDK types to the UI.

## Idempotency and abuse controls

- Disable the submit button while a request is being created.
- Accept an idempotency key for retries and double-click protection.
- Rate-limit by authenticated user and, for guest flows, by IP plus normalized email.
- Cap message length and reject oversized payloads before calling Gemini.
- Add a server timeout and bounded retry policy; do not retry non-retryable validation or safety errors.
