# Lens — Agent Notes

## What This Is

A GenUI agent. The LLM generates raw HTML markup from JSON data based on a
text prompt or a user click, and that markup is injected directly into the
page. No predefined components, no static layout — the UI is entirely
LLM-produced on every interaction.

## Architecture

```
User prompt / click
       │
       ▼
<Lens> component (src/components/lens.tsx)
       │  POST { type: "prompt"|"markup", content }
       ▼
/api/ask  (src/pages/api/ask.ts)
       │  calls lensAgent(transport, input, data)
       ▼
lensAgent (src/pages/api/lens.ts)
       │  builds context via createPromptCtx or createViewCtx
       ▼
ctx.ts prompt builders (src/pages/api/ctx.ts)
       │  sends assembled prompt to LLM transport
       ▼
LLM (Anthropic / Groq)
       │  returns ```html ... ``` fenced block
       ▼
extractHtmlContent strips fence → returned as { text: html }
       │
       ▼
setGenUI → dangerouslySetInnerHTML renders the markup
```

## Interaction Model

Two input types share the same `POST /api/ask` endpoint:

| `type`    | Trigger            | Context builder     | What the LLM receives                          |
|-----------|--------------------|---------------------|------------------------------------------------|
| `prompt`  | Ctrl+Enter in textarea | `createPromptCtx` | User description + JSON data + style rules  |
| `markup`  | Click on generated element | `createViewCtx` | Current innerHTML (with `current-event="[ CLICK ]"` on the clicked element) + data + rules |

Click events: `lens.tsx` sets `current-event="[ CLICK ]"` on the target element,
sends the full container HTML, then updates the view with the LLM response.
Clicks on `<INPUT>` elements are excluded so inputs stay interactive.

## File Map

| File | Role |
|------|------|
| `src/components/lens.tsx` | UI shell — textarea, generated view, click handler, fetch wrapper |
| `src/pages/index.tsx` | Mounts `<Lens endpoint="/api/ask" />` |
| `src/pages/api/ask.ts` | Next.js API handler — wires data, transport, lensAgent |
| `src/pages/api/lens.ts` | `lensAgent` — routes to context builder, calls transport, extracts HTML |
| `src/pages/api/ctx.ts` | `createPromptCtx` / `createViewCtx` — prompt assembly + style rules |
| `src/pages/api/data.ts` | Static JSON data passed to every LLM call — replace with real fetch |

## Extending

**Swap the data source** — `data.ts` exports a plain array. Replace it with
an async fetch in `ask.ts` and pass the serialized result to `lensAgent`.

**Switch LLM provider** — `ask.ts` has `llmRouter` with `anthropic` and `groq`
entries. Change the last line: `const transport = llmRouter.groq()`.

**Add a new provider** — implement `(ctx: string) => Promise<string>` and add
it to `llmRouter`.

**Change style rules** — edit the `rules` constant in `ctx.ts`. All prompts
share it. Currently enforces dark Tailwind styling, no scripts, no modals.

**Add a new endpoint** — create `src/pages/api/<name>.ts`, call `lensAgent`
with a different data source or transport, mount `<Lens endpoint="/api/<name>" />`
in a new page.

## Environment Variables

```
ANTHROPIC_API_KEY=...   # required when using llmRouter.anthropic()
GROQ_API_KEY=...        # required when using llmRouter.groq()
```

Copy `.env` to `.env.local` for local overrides (`.env` is checked in for
convenience but should not contain production keys).

## Dev Commands

```bash
npm run dev    # start Next.js dev server on http://localhost:3000
npm run build  # production build
npm run start  # serve production build
npm run lint   # ESLint (eslint-config-next)
```

## Key Constraints

- The LLM output is injected via `dangerouslySetInnerHTML`. The style rules in
  `ctx.ts` explicitly ban `<script>` tags; enforce this if you change the
  prompt, and never remove that restriction.
- Tailwind in the generated markup is loaded from CDN (`cdn.tailwindcss.com`)
  via a `<script>` tag appended by `lens.tsx`. This is separate from the app's
  own Tailwind build.
- The `lensAgent` transport is a plain `(string) => Promise<string>` — keeping
  it that way makes providers trivially swappable without touching agent logic.
- Context window usage scales with the size of the current HTML view on each
  click. Large generated UIs will consume significant tokens per interaction.
