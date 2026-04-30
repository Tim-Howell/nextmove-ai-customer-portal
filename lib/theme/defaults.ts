/**
 * NextMove brand defaults — Apple-style soft-light theme.
 *
 * These are the fallback values used by the runtime theme injection layer
 * when the corresponding `portal_settings` columns are NULL or fail
 * validation.
 *
 * Column semantics (theme-agnostic naming):
 *   - `background_base`  → the dominant page background
 *   - `foreground_base`  → the dominant page text color
 *
 * For the light theme, `background_base` is a cool neutral near-white
 * (Apple's #F5F5F7) and `foreground_base` is a near-black (Apple's #1D1D1F).
 * Keep these in sync with the schema migration.
 */
export const BRAND_DEFAULTS = {
  primary: "#2C3E50", // NextMove Navy — used for structural accents
  accent: "#6FCF97", // NextMove Green — used for CTAs
  background_base: "#F5F5F7", // Apple-style cool gray page bg
  foreground_base: "#1D1D1F", // Apple-style near-black text
} as const;

export type BrandDefaults = typeof BRAND_DEFAULTS;
