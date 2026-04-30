# portal-theming Specification

## Purpose
Defines the admin-configurable brand theme: persisted color tokens, runtime
CSS-variable injection, validation/contrast safeguards, and the default
Apple-style soft-light aesthetic that every portal page inherits.

## Requirements

### Requirement: Configurable brand theme tokens
The system SHALL persist four admin-editable brand color tokens in `portal_settings` and apply them as CSS variables on every authenticated and unauthenticated page.

The four token columns are:
- `primary_color` — structural chrome, headings, primary buttons
- `accent_color` — ring / focus / secondary highlights / CTAs
- `background_base` — page background
- `foreground_base` — page text

#### Scenario: Admin sets all four brand tokens
- **WHEN** an admin saves valid hex values for `primary_color`, `accent_color`, `background_base`, and `foreground_base` on `/settings/portal-branding`
- **THEN** the values are persisted to `portal_settings`
- **AND** the next request renders with `--brand-primary`, `--brand-accent`, `--brand-bg`, and `--brand-fg` set to those values via an inline `<style>` block in `<head>`

#### Scenario: Defaults when portal_settings is empty or missing
- **WHEN** `portal_settings` has no row, or any of the four color columns is `NULL`
- **THEN** the system uses the NextMove brand defaults (primary `#2C3E50`, accent `#6FCF97`, background_base `#F5F5F7`, foreground_base `#1D1D1F`) for the missing tokens

#### Scenario: Invalid color rejected at save
- **WHEN** an admin submits a color value that is not a valid 3- or 6-digit hex string
- **THEN** the form displays an inline validation error and no database write occurs

#### Scenario: Insufficient-contrast color rejected at runtime
- **WHEN** `buildThemeCss` evaluates a stored `accent_color` whose WCAG contrast ratio against the resolved `background_base` is below 3.0, or a `foreground_base` whose contrast against `background_base` is below 4.5
- **THEN** the system substitutes the brand default for that token in the emitted CSS and the original value remains in the database

### Requirement: Theme variables map to shadcn contract
The system SHALL expose the brand tokens via the variable names that shadcn/ui primitives already consume (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--card`, `--border`, `--ring`).

#### Scenario: shadcn primitive picks up brand color
- **WHEN** a `<Button>` from `components/ui/button.tsx` renders with the default `variant`
- **THEN** its background uses `--primary`, which resolves to the configured `primary_color`

### Requirement: Branding form exposes the four tokens
The form at `/settings/portal-branding` SHALL provide labeled inputs and live swatches for `primary_color`, `accent_color`, `background_base`, and `foreground_base`.

#### Scenario: Admin views the form
- **WHEN** an admin navigates to `/settings/portal-branding`
- **THEN** the form displays all four color inputs with their current values and a live color swatch beside each

#### Scenario: Non-admin denied
- **WHEN** a user with role `staff` or `customer_user` requests `/settings/portal-branding`
- **THEN** the system returns a 403/redirect, matching existing admin-only route protection

### Requirement: Apple-style soft-light aesthetic is the default
The system SHALL render with a light-first Apple-style theme regardless of the user's `prefers-color-scheme` setting, using a distinctive display + body font pair loaded via `next/font`.

#### Scenario: Light background by default
- **WHEN** any portal page renders for any user
- **THEN** the document body's resolved background color matches the configured `background_base` (or its default `#F5F5F7`)
- **AND** the `<html>` element carries `data-theme="light"`

#### Scenario: Distinctive fonts loaded
- **WHEN** any portal page renders
- **THEN** the document loads a serif display family (Fraunces) for headings and a geometric sans family (Plus Jakarta Sans) for body/UI text via `next/font/google`, with no calls to external CDNs at request time
