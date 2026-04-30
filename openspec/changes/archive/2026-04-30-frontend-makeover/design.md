## Context

The portal is a Next.js 15 App Router app on shadcn/ui + Tailwind. Today the visual layer is mostly default shadcn — light theme, neutral grays, rounded-md corners, system font, no animation. There is an existing `portal_settings` table with `primary_color` and `secondary_color` text columns, an admin form at `/settings/portal-branding` that captures them, but **nothing in the runtime actually consumes those values** — the rendered colors come from Tailwind defaults.

The brand provides a defined palette (Primary Navy `#2C3E50`, NextMove Green `#6FCF97`, Dark Background `#1A1F2E`, Light Background `#F8F9FA`, Secondary Text `#6C757D`). The product owner has chosen a **Soft Modernist, dark-first** aesthetic. We have the `frontend-design` skill checked into `.windsurf/skills/` to lean on while making creative choices.

This change is intentionally a single-PR makeover, not a phased rollout, because (a) every page shares a small number of layout primitives, (b) a phased visual change creates a visibly inconsistent product mid-flight, and (c) functional surface is frozen for this PR which keeps the diff to skinning.

## Goals / Non-Goals

**Goals:**
- A cohesive Soft Modernist, dark-first aesthetic across every authenticated portal page and the auth pages.
- A persisted, configurable theme: 4 brand colors editable in `/settings/portal-branding`, applied at runtime via CSS variables.
- Replace the system font with a distinctive display + body pair via `next/font` (no CDN).
- Introduce subtle, intentional motion at high-impact moments (page-load reveal, key state changes) using `motion`.
- Keep the existing component contract — no new shadcn primitives are added or removed; existing usages keep working.
- Preserve every passing Playwright test.

**Non-Goals:**
- Per-user light/dark toggle. The portal is dark-only this pass.
- Re-architecting the navigation IA. Sidebar groups, items, and order are unchanged (Requests reorder is its own deferred change).
- Custom chart styling — `dashboard-time-charts` will define how charts read the new tokens, but charts themselves are out of scope here.
- Customer-facing email templates. Branded email is its own concern.
- Bringing back legacy light theme. `prefers-color-scheme: light` is ignored.

## Decisions

### Decision 1: Token system in `app/globals.css`, not Tailwind config

Define semantic tokens as CSS variables under a single `:root[data-theme="dark"]` (and a default `:root` block) and consume them through Tailwind's `theme()` arbitrary-value escape hatch (`bg-[hsl(var(--surface))]`) and through shadcn's existing `--primary`, `--background`, etc., variable contract.

**Why:** runtime theme overrides from `portal_settings` are trivial — we just override CSS vars on the `<html>` element. If we baked colors into `tailwind.config.ts`, runtime overrides would require client-side rewrites or dynamic class generation. Considered a `next-themes` + Tailwind palette extension hybrid; the CSS-vars-only approach is simpler given dark-only scope.

### Decision 2: Token taxonomy

A small, opinionated token set:

| Token | Default (dark) | Source |
| --- | --- | --- |
| `--color-bg` | `#1A1F2E` | `portal_settings.background_dark` |
| `--color-surface` | derived (lighter) | computed in CSS from `--color-bg` |
| `--color-surface-2` | derived | computed |
| `--color-fg` | `#F8F9FA` | `portal_settings.background_light` (used as text-on-dark) |
| `--color-fg-muted` | `#6C757D` | constant |
| `--color-primary` | `#2C3E50` | `portal_settings.primary_color` |
| `--color-accent` | `#6FCF97` | `portal_settings.accent_color` (NEW) |
| `--color-border` | rgba on `--color-fg` | derived |
| `--color-ring` | `--color-accent` | derived |
| `--radius` | `0.625rem` | constant |
| `--shadow-soft` | layered low-opacity | constant |

Only 4 of these are admin-configurable: `primary`, `accent`, `background_dark`, `background_light`. Surface/border/ring derive from those and stay coherent.

Considered exposing all 8+ tokens; rejected — too easy for an admin to break contrast.

### Decision 3: Re-use the existing shadcn variable contract

shadcn already reads `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--card`, `--border`, `--ring`, etc. We map our 4 admin tokens onto those at the `:root` level so every existing shadcn primitive automatically picks up the new theme without us editing each `components/ui/*.tsx` file.

```css
:root {
  --background: var(--color-bg);
  --foreground: var(--color-fg);
  --primary: var(--color-accent);            /* accent drives "primary action" */
  --primary-foreground: var(--color-bg);
  --secondary: var(--color-primary);         /* navy for secondary surfaces */
  --card: var(--color-surface);
  --border: var(--color-border);
  --ring: var(--color-ring);
  /* ...remaining shadcn vars derived */
}
```

**Why:** zero churn on the ~30 shadcn primitives in `components/ui/`. Considered renaming to brand-specific vars; rejected — fights the framework.

### Decision 4: Font pair

- **Display:** `Fraunces` (variable, expressive serif) via `next/font/google`, used for page titles (`h1`, hero numerals on summary cards), some empty-state headings.
- **Body / UI:** `Plus Jakarta Sans` (variable, geometric sans with character) via `next/font/google`, used for everything else.

Both are open-source, both have variable axes that we'll exercise via `font-feature-settings` for tabular numbers in tables/charts. Considered `Inter` (banned by skill guidance), `IBM Plex` (too utilitarian for soft-modernist), `Manrope` (acceptable but predictable).

### Decision 5: Motion policy

Install `motion`. Apply three motion patterns and nothing else:

1. **Page-load reveal** on `(portal)/layout.tsx`'s main content slot — staggered fade+rise (40ms stagger, 240ms duration, ease-out) for top-level page sections.
2. **Card hover lift** on summary cards and customer cards — `translateY(-2px)` + shadow ease.
3. **Toast/dialog enter** — replace shadcn's default with a slightly softer spring.

No scroll-triggered animation. No looping idle motion. The aesthetic is "quiet confidence", not "demo reel".

### Decision 6: Theme-variable injection at the server boundary

`app/layout.tsx` reads `portal_settings` once via the server client and renders an inline `<style>` block in `<head>` that defines the four admin-set CSS vars. No client hydration, no flash of unthemed content. If `portal_settings` is missing or values are invalid, we fall back to the brand defaults.

```tsx
// app/layout.tsx
const settings = await getPortalSettings();
const themeVars = buildThemeCss(settings);  // returns ":root{--color-primary:...}"
```

`buildThemeCss` lives in `lib/theme/css-vars.ts`, validates each color (regex, contrast floor against `--color-bg`), and silently drops invalid values back to the default.

Considered storing tokens in cookies and applying client-side; rejected (FOUC).

### Decision 7: Branding form schema extension

Extend the Zod schema and DB schema in lockstep:

- Add `accent_color text`, `background_dark text`, `background_light text` (all nullable, with brand defaults via app code, not DB defaults — keeps the migration trivial).
- Form gains 2 new color inputs (accent + dark background; light background defaults are exposed but optional).
- Live preview swatches on the form. Save persists; reload reflects the change everywhere via the SSR injection above.

Existing `primary_color` / `secondary_color` columns: `primary_color` keeps its meaning (Primary Navy default). `secondary_color` is **renamed via migration** to `accent_color` — semantically that's what the existing field has been driving (and the live form already shows it as a "secondary" swatch). The migration also seeds the brand defaults for any `portal_settings` row missing values.

### Decision 8: One-PR rollout

The PR includes:
1. Migration + schema/form updates.
2. Token system + font load + base layer rewrite.
3. Audit pass over every authenticated page to remove ad-hoc color classes (e.g., `bg-white`, `text-gray-700`) in favor of token classes.
4. Motion wrapper components.
5. Visual smoke e2e test.

A reviewer-friendly diff is achieved by keeping component **structure** identical and only changing class strings, and by isolating the few new components (theme provider, motion wrappers) into new files.

## Risks / Trade-offs

- **Risk: contrast regressions on dynamic admin colors** → Mitigation: `buildThemeCss` enforces a contrast floor against `--color-bg` for `primary`/`accent`/`fg`. If an admin picks a color that fails, we silently substitute the brand default and surface a warning toast in the form.
- **Risk: ad-hoc color classes scattered across 100+ files mean some pages slip back to legacy colors** → Mitigation: a grep audit step in tasks.md (look for `bg-white`, `text-gray-`, `border-gray-`, `bg-slate-`, `bg-zinc-`) and a CI lint rule (regex check) added to `pnpm lint:colors`.
- **Risk: e2e visual diffs explode** → Mitigation: existing tests assert behavior, not pixels, so they should pass. Added smoke test only checks one CSS var resolves; no full visual regression suite is introduced this PR.
- **Risk: large single PR is hard to review** → Mitigation: token + infra changes land in commit 1 (small), page reskins land in subsequent commits grouped by route segment so the diff per commit is digestible.
- **Trade-off: dark-only** — some users prefer light. Accepted; light theme can be added later by toggling `data-theme="light"` and shipping a second token block.
- **Trade-off: motion is conservative** — won't wow on first impression but will not feel dated in 2 years.

## Migration Plan

1. Apply migration `<timestamp>_portal_settings_brand_tokens.sql` (renames `secondary_color` → `accent_color`, adds `background_dark`, `background_light`).
2. Deploy. SSR theme injection picks up new columns; form picks up new inputs; everything still renders thanks to defaults.
3. Admin opens `/settings/portal-branding`, sets values to confirm they propagate.
4. Rollback: revert migration (rename back, drop new columns), revert app deploy. The `secondary_color`/`primary_color` data round-trips losslessly since we keep the same color values.

## Open Questions

- None blocking implementation. Final font pair confirmation can be made during commit 1 review if Fraunces+Jakarta feels off in context.
