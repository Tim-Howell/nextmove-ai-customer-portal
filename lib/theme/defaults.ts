/**
 * NextMove brand defaults. These are the fallback values used by the runtime
 * theme injection layer when the corresponding `portal_settings` columns are
 * NULL or fail validation.
 *
 * Keep these in sync with the proposal's color palette.
 */
export const BRAND_DEFAULTS = {
  primary: "#2C3E50", // Primary Navy
  accent: "#6FCF97", // NextMove Green
  background_dark: "#1A1F2E", // Dark Background
  background_light: "#F8F9FA", // Light Background (used as text-on-dark fg)
} as const;

export type BrandDefaults = typeof BRAND_DEFAULTS;
