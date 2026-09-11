# TRLcs Documentation

This folder contains the implementation documentation for The Racket Lifestyle customer-support application. The master product and technical requirements are in [`../TRLcs.md`](../TRLcs.md).

## Documents

| Document | Covers |
|---|---|
| [`architecture.md`](./architecture.md) | Application boundaries, request lifecycle, API contracts, and failure handling |
| [`ai-integration.md`](./ai-integration.md) | Gemini integration, grounded prompt, structured output, safety, and observability |
| [`data-model.md`](./data-model.md) | Supabase tables, relationships, RLS, indexes, and status lifecycle |
| [`ui-ux.md`](./ui-ux.md) | Brand application, responsive layouts, components, accessibility, and UI states |
| [`deployment.md`](./deployment.md) | GitHub, Vercel, environment variables, migrations, and release operations |

## Recommended implementation order

1. Read [`../brand-context.md`](../brand-context.md) and [`../TRLcs.md`](../TRLcs.md).
2. Implement the schema and RLS from [`data-model.md`](./data-model.md).
3. Build the server request lifecycle from [`architecture.md`](./architecture.md).
4. Add Gemini using [`ai-integration.md`](./ai-integration.md).
5. Build and refine the UI from [`ui-ux.md`](./ui-ux.md).
6. Configure environments and release checks from [`deployment.md`](./deployment.md).
