## Why

The portal currently uses near-default shadcn/ui styling on a light theme. It works but feels generic and doesn't carry the NextMove AI brand. We have a defined brand palette and want to commit to a single, distinctive aesthetic ("Soft Modernist", dark-first) and surface a small set of theme controls in portal settings so the org colors actually drive what users see.

## What Changes

- Establish a **Soft Modernist, dark-first** visual system across the entire portal in a single PR — typography, color tokens, radius, shadows, motion, spacing scale.
- Replace ad-hoc Tailwind colors with a token layer in `app/globals.css` driven by CSS variables; keep all shadcn/ui primitives in place but re-skin them through the tokens.
- Adopt the `motion` (formerly Framer Motion) React library for page-load reveals and key micro-interactions.
- Re-skin the app shell (sidebar, top bar, page headers), all auth pages, dashboard, customer/contract/priority/request lists and detail pages, settings, and reports.
- Re-skin loading skeletons, empty states, and error states to match the new aesthetic.
- Pull the brand palette into runtime: extend `portal_settings` from the current `primary_color` / `secondary_color` pair to a four-color set (primary, accent, dark background, light background). The form on `/settings/portal-branding` becomes the source of truth and these values are emitted as CSS variables on every page.
- **BREAKING (visual only):** every page in the portal will look meaningfully different. Functional behavior is unchanged.

## Capabilities

### New Capabilities
- `portal-theming`: configurable brand theme — admin-managed color tokens persisted in `portal_settings`, applied site-wide as CSS variables, with sensible NextMove defaults.

### Modified Capabilities
- `app-shell`: sidebar, top bar, and page-frame visual treatment updated to the Soft Modernist dark aesthetic; navigation density and grouping unchanged.
- `ux-states`: loading skeletons, empty states, and error states are restyled to match the new aesthetic.

## Impact

- **Code**:
  - `app/globals.css` — token redefinition, font imports, base layer rewrite.
  - `app/layout.tsx` — font loading, `<html>` `data-theme` attribute, theme-variable injection from `portal_settings`.
  - All `(portal)` and `(auth)` route segments — wrapper/header components consume new tokens.
  - `components/ui/*` — small overrides where shadcn defaults clash with the aesthetic (mostly button, card, badge variants).
  - New `components/theme/theme-provider.tsx` and `lib/theme/css-vars.ts`.
  - `components/settings/portal-branding-form.tsx` — adds two new color inputs, live preview swatches.
  - `app/actions/portal-settings.ts` and `lib/validations/portal-settings.ts` — add accent + background fields.
- **Database**: migration adds `accent_color`, `background_dark`, `background_light` columns to `portal_settings` (nullable, with defaults).
- **Dependencies**: add `motion` (React).
- **Fonts**: load a distinctive display + body pair via `next/font` (selection finalized in design.md). No external CDN.
- **Tests**: existing Playwright e2e tests should pass unchanged (no functional change). Add one visual smoke test that loads the dashboard and asserts the configured `--color-primary` CSS var resolves to the value stored in `portal_settings`.
- **Out of scope**: chart styling beyond base tokens (covered by `dashboard-time-charts`); request thread UI (covered by the deferred Requests Module Overhaul); per-user dark/light toggle (the portal is dark-only for this pass).
