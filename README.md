# Browser Extension Starter

A reusable **Manifest V3 browser extension starter** with TypeScript, Vite, React, and a strict type-safe architecture. Designed for Chrome and Firefox with a sophisticated messaging system between contexts.

## Getting Started

```bash
pnpm install
pnpm dev
```

Load the unpacked extension from `dist/` into Chrome (`chrome://extensions` → Developer mode → Load unpacked) or Firefox (`about:debugging` → This Firefox → Load Temporary Add-on).

The `pnpm dev` command watches for changes and rebuilds automatically.

## Scripts

`pnpm dev` · `pnpm build` · `pnpm build:firefox` · `pnpm type-check` · `pnpm lint` · `pnpm format` · `pnpm test` · `pnpm zip`

## Architecture

The binding conventions live in `.claude/CLAUDE.md`: strict context separation, typed messaging with Zod, single source of truth, and no direct imports between contexts. Read it before adding any code.

### Contexts

| Context      | Purpose                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| **Background** | Service worker, event listeners, cross-context coordination, storage.   |
| **Content**    | DOM manipulation on pages, data extraction, page observation.          |
| **Popup**     | User interface for settings, quick actions, display data.               |
| **Utils**     | Pure functions, helpers, validation schemas (non-message).             |

### Messaging

All inter-context communication uses typed messages via Zod schemas in `src/types/messages.ts`. Background scripts cannot directly import content scripts or popup — use `chrome.runtime.sendMessage` and `chrome.tabs.sendMessage` with the typed contracts.

## What ships

- **Background service worker** with install/update handling and message routing
- **Content script** that sends page data to background and handles responses
- **React popup** with data display and clear actions
- **Typed messaging layer** using Zod schemas for all inter-context communication
- **ESLint + Prettier** with custom rules enforcing context isolation
- **TypeScript** with strict mode and path aliases
- **Vite + CRXJS** for fast builds and hot reload

## File structure

```
src/
├── background/    # Service worker, event listeners, storage
├── content/       # Content scripts, DOM manipulation
├── popup/         # React popup UI
├── utils/         # Pure functions, helpers
└── types/         # Shared types, message contracts (Zod schemas)
public/
├── manifest.json  # Extension manifest v3
└── icons/         # Extension icons
```

## Permissions

Edit `public/manifest.json` to add permissions:

- `storage` — for chrome.storage API
- `tabs` — for chrome.tabs API
- `activeTab` — for accessing the current tab
- `host_permissions` — for accessing specific URLs

## Adding features

1. **Add a new message type** to `src/types/messages.ts` with a Zod schema
2. **Handle the message** in the appropriate context's message listener
3. **Send the message** from the source context using the typed schema
4. **Add permissions** to `manifest.json` if needed

See `.claude/CLAUDE.md` for the full architecture rules and conventions.
