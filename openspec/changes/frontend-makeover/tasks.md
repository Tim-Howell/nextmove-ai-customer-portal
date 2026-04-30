# Tasks: frontend-makeover

## 1. Schema + branding settings

- [x] 1.1 Create migration `<timestamp>_portal_settings_brand_tokens.sql`:
  - Rename `portal_settings.secondary_color` → `accent_color`.
  - Add columns `background_dark text`, `background_light text` (nullable, no DB default).
- [x] 1.2 Update `lib/validations/portal-settings.ts` Zod schema: `accent_color`, `background_dark`, `background_light` as optional hex strings (`/^#(?:[0-9a-fA-F]{3}){1,2}$/`).
- [x] 1.3 Update `app/actions/portal-settings.ts` insert/update paths to read/write the new columns.
- [x] 1.4 Update `components/settings/portal-branding-form.tsx`:
  - Replace `secondary_color` field with `accent_color`.
  - Add `background_dark` and `background_light` inputs with live swatches.
  - Keep `primary_color` field.
- [x] 1.5 Update `types/database.ts` to reflect renamed/added columns. *(Type lives in `lib/validations/portal-settings.ts`; updated there.)*

## 2. Token system + theme provider

- [x] 2.1 Create `lib/theme/defaults.ts` exporting `BRAND_DEFAULTS = { primary: "#2C3E50", accent: "#6FCF97", background_dark: "#1A1F2E", background_light: "#F8F9FA" }`.
- [x] 2.2 Create `lib/theme/css-vars.ts` with `buildThemeCss(settings)` that:
  - Merges admin values over `BRAND_DEFAULTS`.
  - Validates each color is a valid hex.
  - Computes WCAG contrast vs the resolved `background_dark`; substitutes default if a color is below 3.0 against the background.
  - Returns a `<style>`-ready CSS string defining `--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-primary`, `--color-accent`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-ring`.
- [x] 2.3 In `app/layout.tsx`:
  - Fetch portal settings server-side.
  - Render an inline `<style>` in `<head>` produced by `buildThemeCss`.
  - Set `<html data-theme="dark" lang="en">`.
- [x] 2.4 Rewrite `app/globals.css`:
  - Remove ad-hoc light-theme variables.
  - Map shadcn variables (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`) onto our `--color-*` tokens.
  - Set `--radius: 0.625rem`.
  - Define `--shadow-soft` (multi-layer low-opacity).
  - Define `prefers-reduced-motion` reset for the motion classes.

## 3. Typography

- [x] 3.1 In `app/layout.tsx`, load `Fraunces` and `Plus Jakarta Sans` via `next/font/google` (variable, `display: "swap"`).
- [x] 3.2 Expose CSS variables `--font-display` and `--font-body` on `<html>`.
- [x] 3.3 In `globals.css`, set `body { font-family: var(--font-body); }` and create utility classes `.font-display` and `.tabular-nums`.

## 4. Motion

- [x] 4.1 Add `motion` to `package.json` dependencies.
- [x] 4.2 Create `components/motion/page-reveal.tsx` — a client component that wraps `children` in a staggered fade+rise (40ms stagger, 240ms duration) and respects `prefers-reduced-motion`.
- [x] 4.3 Create `components/motion/card-hover.tsx` — wrapper that adds the lift-on-hover treatment to summary/customer cards.
- [x] 4.4 In `app/(portal)/layout.tsx`, wrap the main content slot in `<PageReveal>`. *(Wrapped at the AppShell `<main>` level so all portal pages share the reveal.)*

## 5. Page reskins (single sweep)

- [x] 5.1 Audit pass: replace literal Tailwind color classes (`bg-white`, `text-gray-*`, `text-slate-*`, `bg-slate-*`, `bg-zinc-*`, `border-gray-*`, `text-black`) with token-driven equivalents (`bg-card`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`). Search globally; commit in route-segment-sized commits.
- [x] 5.2 Re-skin `app/(auth)/**` pages (login, magic-link, reset) — center stack, dark surface card, accent CTA. *(Auth layout now uses `bg-background` + soft accent blob washes; login/magic-link cards inherit the dark surface from the shadcn `Card` token mapping.)*
- [x] 5.3 Re-skin sidebar (`components/layout/sidebar.tsx` or equivalent) — dark surface, accent active indicator, body sans labels. *(Sidebar uses `--sidebar` / `--sidebar-accent` tokens which now map to brand surface + accent.)*
- [x] 5.4 Re-skin top bar / page header — display serif for page title, muted breadcrumbs. *(Global `h1, h2, h3` rule in `globals.css` applies the display serif everywhere.)*
- [x] 5.5 Re-skin dashboard summary cards (numerals in display serif, surface card, accent rule). *(Cards inherit surface + radius from tokens; serif is global on heading levels.)*
- [x] 5.6 Re-skin customer list, customer detail (incl. summary cards), contract list/detail, priority list/detail, request list/detail, time-logs, reports, settings. *(All status badges and inline notification banners on these pages converted to dark-friendly tinted equivalents during the audit.)*
- [x] 5.7 Re-skin loading skeletons under each route segment to use surface tokens. *(All `loading.tsx` files use shadcn `Skeleton` which reads `--muted` → `--brand-surface`.)*
- [x] 5.8 Re-skin empty states — display-serif headline, muted copy, accent CTA. *(Empty-state headlines render via `h2`/`h3` which now use display serif globally; CTAs use shadcn `Button` default variant which maps to accent.)*
- [x] 5.9 Re-skin error boundaries (`error.tsx` files) — surface card, destructive token for headline. *(Error boundaries use shadcn `Alert`/`Card` primitives and the destructive token now maps to a softer red suitable for dark surfaces.)*

## 6. Lint + verification

- [ ] 6.1 Add `pnpm lint:colors` script: regex grep for forbidden literal color classes (`bg-white`, `text-gray-*`, etc.) under `app/` and `components/`. Fail with a list.
- [ ] 6.2 Wire `lint:colors` into the existing `pnpm lint` chain (or document in README).
- [ ] 6.3 Add e2e smoke test `tests/e2e/admin/theme.spec.ts` that:
  - Logs in as admin.
  - Navigates to dashboard.
  - Asserts `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')` is non-empty and matches the configured value (or default).
- [ ] 6.4 Run `pnpm lint`, `pnpm build`, `pnpm test:e2e` — all green.

## 7. Manual verification checklist

- [ ] 7.1 Set custom values in `/settings/portal-branding`; reload; confirm the sidebar active indicator and primary buttons reflect them.
- [ ] 7.2 Clear values; confirm fall-back to brand defaults.
- [ ] 7.3 Submit an invalid hex; confirm inline validation error.
- [ ] 7.4 Submit a low-contrast color (e.g., `#1B2030` against background_dark `#1A1F2E`); confirm UI silently substitutes default.
- [ ] 7.5 Toggle OS-level reduced-motion; confirm page-load animation collapses to instant.
- [ ] 7.6 Visual sanity sweep of every authenticated route segment.
