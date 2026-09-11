# UI and UX Specification

## Page structure

### Support home

- Compact header with `THE RACKET LIFESTYLE`, Shop, Tennis, Pickleball, Padel, Badminton, Account, and a prominent `Get Support` action.
- Hero headline: “How can we help you today?”
- Supporting text: “Get quick answers about your orders, products, shipping, returns, payments, and account.”
- Large support form with clear labels and a direct submit action.
- Six category cards: Orders, Shipping, Returns, Products, Payments, Account.
- Suggested prompts such as “Track my order”, “Start a return”, and “Help me choose a racket”.

### Dashboard

- Page title and short explanation.
- Filterable request list.
- Status, category, urgency, and date visible at a glance.
- Empty state that invites the first question.
- Detail panel or route for the full conversation.

## Form behavior

- Keep the submit button disabled only while validation or submission is actively running.
- Preserve entered content when Gemini fails.
- Use inline validation near the relevant field.
- Announce the loading state to assistive technology.
- On success, focus the response heading or confirmation region.
- Warn customers not to submit passwords or payment credentials before submission.

## Conversation behavior

- Customer message is visually distinct and right-aligned on wide screens.
- AI response is left-aligned and supports short paragraphs, numbered steps, and safe action links.
- Show “Checking that for you…” during provider processing.
- Display category, urgency, and status as text plus color/icon treatment; never color alone.
- Show an escalation action when `needsEscalation` is true.

## Responsive layout

### Mobile

- Single-column page.
- Compact navigation with a usable menu control.
- Full-width form controls and at least 44px touch targets.
- Sticky or comfortably reachable submit/input area without covering content.
- Category cards stacked or horizontally scrollable with keyboard support.
- No horizontal page overflow.

### Tablet

- Central support panel with two-column category card grid.
- Preserve readable line lengths and generous form spacing.

### Desktop

- Centered or two-column layout with category navigation visible.
- Conversation content should remain readable rather than stretching across the viewport.
- Use whitespace and subtle borders instead of heavy cards and shadows.

## States

### Empty

**What can we help with?**  
“Ask a question about your order, shipping, returns, products, payments, or account.”

### Loading

Use a subtle animated indicator and “Checking that for you…”. Respect `prefers-reduced-motion`.

### Success

Show the AI response, generated category, urgency, status, and next step. Provide a dashboard link.

### Error

**Something went wrong**  
“We couldn’t get an answer right now. Please try again.”

Actions: `Try again`, `Contact support`.

## Accessibility checklist

- Use semantic landmarks and one clear page heading.
- Associate every input with a visible label.
- Provide descriptive error text and `aria-describedby`.
- Move focus intentionally after submission and route changes.
- Use `aria-live` for loading and result announcements.
- Ensure text and controls meet contrast requirements.
- Provide visible `:focus-visible` styling.
- Test keyboard navigation at every breakpoint.
