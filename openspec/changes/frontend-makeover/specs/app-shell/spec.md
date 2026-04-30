## MODIFIED Requirements

### Requirement: Navigation uses brand styling
The system SHALL style the sidebar, top bar, and active-state indicators using the configured brand theme tokens, rendering a Soft Modernist dark aesthetic.

#### Scenario: Brand tokens applied to chrome
- **WHEN** an authenticated user views any portal page
- **THEN** the sidebar background resolves to a surface derived from `--color-bg` (the configured `background_dark`)
- **AND** the active navigation item uses `--color-accent` (the configured `accent_color`) for its indicator
- **AND** primary text uses `--color-fg` (derived from the configured `background_light`)

#### Scenario: Admin updates accent color
- **WHEN** an admin changes `accent_color` in portal settings and reloads
- **THEN** the active navigation indicator and primary action buttons reflect the new color without any code deployment

### Requirement: App shell page-load motion
The system SHALL apply a subtle staggered reveal animation to the main content region on initial page load using the `motion` React library.

#### Scenario: First paint of a portal page
- **WHEN** a user navigates to any portal route
- **THEN** the top-level page sections fade and rise into place with a 40ms stagger and approximately 240ms duration
- **AND** the animation respects `prefers-reduced-motion: reduce` by collapsing to instant render

### Requirement: Distinctive typography across the app shell
The system SHALL render page titles in a serif display font and body/UI text in a geometric sans font, both loaded via `next/font`.

#### Scenario: Page heading typography
- **WHEN** a portal page renders an `<h1>` page title
- **THEN** the heading uses the configured display serif family (e.g., Fraunces) with appropriate weight and tracking

#### Scenario: Body text typography
- **WHEN** a portal page renders running text, table cells, form labels, or button labels
- **THEN** the text uses the configured body sans family (e.g., Plus Jakarta Sans)
