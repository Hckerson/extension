# Project Instructions

This is a reusable **browser extension starter** with a strict, type-safe architecture designed for Chrome/Firefox Manifest V3 extensions.

## Non-negotiable rules

1. **Every context has exactly one job.** Background = service worker and event handling · Content = DOM manipulation on pages · Popup = UI for user interaction · Utils = pure functions. A file over ~150 lines is doing too much — split it.
2. **Communication only through messaging.** Background scripts cannot directly import content scripts or popup. Content scripts cannot directly import background or popup. Use chrome.runtime.sendMessage and chrome.tabs.sendMessage with typed message contracts.
3. **Single source of truth.** Message schemas in `src/types/messages.ts` using Zod. Domain types in `src/types/`. Configuration in extension storage or env constants. No duplication anywhere.
4. **No hardcoding.** Magic numbers, repeated literals, URLs — all live in constants files or extension storage. Never inline.
5. **No dead code, stubs, or placeholders.** Delete unused code.
6. **No `console.log` or debug statements** in committed code. Use the Chrome extension logger or custom logging utility.
7. **Use the platform APIs.** chrome.storage, chrome.runtime, chrome.tabs — don't reinvent state management.
8. **IDs come from nanoid.** Never `uuid` or `Date.now()`.

**Absolute imports via aliases.** Never deep-relative (`../../../background/...`). Use `@background/*`, `@content/*`, `@popup/*`, `@utils/*`, `@types/*`.

**This is the only architecture.** Follow it precisely. If you're unsure where something goes, re-read this instead of inventing new locations.

---

## Core Principle: Derive, Never Reconstruct

If a library or framework generates a type, schema, or validation result, use that derived output directly. Examples: Zod `infer`, Chrome API types, storage schema.

Never replace a derived artifact with `any`, `Record<>`, `as` assertions, or hand-written parallel types. If you need a smaller shape, derive it via TypeScript utilities (`Pick`, `Omit`), not ad hoc object literals.

| Derived artifact        | Source → Use                         | ✅ Do                                | ❌ Don't                           |
| ----------------------- | ------------------------------------ | ------------------------------------ | ---------------------------------- |
| **Zod schema**          | `schema` → validated input + type    | Use `z.infer<typeof schema>`        | Duplicate the type by hand         |
| **Message contract**    | Zod schema → typed message           | Use the schema as the message type   | Send untyped messages             |
| **Storage data**        | chrome.storage.get → typed data      | Validate with Zod before use         | Assume storage shape without check |

## Required patterns

| Context      | Responsibility                                                                                              | Rules                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Background** | Service worker lifecycle, event listeners, cross-context coordination, storage management, API calls to external services. | No DOM access. No direct content script imports. Use messaging. Handle install/update events.                                                                      |
| **Content**    | DOM manipulation on host pages, inject UI, observe page changes, send page data to background.               | No direct background imports. Use messaging. Isolate from page JS (IIFE/wrapped). Minimal footprint.                                                               |
| **Popup**     | User interface for settings, quick actions, display data from background.                                   | No direct content script imports. Use messaging to talk to background. Close after action.                                                                        |
| **Utils**     | Pure functions, helpers, validation schemas, message contracts.                                             | No Chrome API calls. No side effects. Reusable across contexts.                                                                                                   |

## Messaging patterns

All messages must be typed using Zod schemas in `src/types/messages.ts`.

```typescript
// Message from content to background
const MESSAGE_TYPES = {
  CONTENT_TO_BACKGROUND: 'content_to_background',
  BACKGROUND_TO_CONTENT: 'background_to_content',
  POPUP_TO_BACKGROUND: 'popup_to_background',
  BACKGROUND_TO_POPUP: 'background_to_popup',
} as const;
```

**Background script:**
```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const validated = messageSchema.parse(message);
  // Handle message
});
```

**Content script:**
```typescript
chrome.runtime.sendMessage({ type: MESSAGE_TYPES.CONTENT_TO_BACKGROUND, data: payload });
```

**Popup:**
```typescript
chrome.runtime.sendMessage({ type: MESSAGE_TYPES.POPUP_TO_BACKGROUND, data: payload });
```

## Folder structure

| Route               | Purpose                                                                               |
| ------------------- | ------------------------------------------------------------------------------------- |
| `/src/background/`  | Service worker, event listeners, cross-context coordination, storage management.     |
| `/src/content/`     | Content scripts, DOM manipulation, page observation, data extraction.                  |
| `/src/popup/`       | Popup UI, user settings, quick actions, display data from background.                |
| `/src/utils/`       | Pure functions, helpers, validation schemas (non-message), reusable logic.           |
| `/src/types/`       | Shared types, message contracts (Zod schemas), domain types.                          |
| `/public/`          | Static assets, manifest.json, icons.                                                 |

## File rules

- **One file per module.** Kebab-case filename matching the export (`message-handler.ts` → `messageHandler`).
- **Absolute imports via aliases.** Never deep-relative (`../../../background/...`).
- **Any file over ~150 lines gets split.** Logic moves to utils, JSX to popup components, DOM logic to content.

## Before you commit or push

Formatting and linting are automated. They are not chores you run by hand.

- **Commit** — Husky's `pre-commit` hook runs `pnpm lint-staged`: `eslint --fix` then `prettier --write`, over staged files only.
- **Push** — Husky's `pre-push` hook runs `pnpm type-check`, then `pnpm lint`, and blocks on failure. This is the real gate.

`pnpm format` and `pnpm lint` stay available for a manual full-repo sweep, but no workflow requires you to run them.

## Pre-merge checklist

1. No `console.log`, no dead code or stubs.
2. No inline type/lint rule suppressions (`// @ts-ignore`, `// eslint-disable`, `as any`, etc.).
3. No hardcoded config, secrets, or magic values (all in constants or storage).
4. All messages typed with Zod schemas in `src/types/messages.ts`.
5. No direct imports between contexts (background/content/popup) — only through messaging.
6. Followed the context contracts. Background = service worker only. Content = DOM only. Popup = UI only.

**Do not merge if any check fails.**
