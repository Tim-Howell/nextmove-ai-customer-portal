## MODIFIED Requirements

### Requirement: Loading states for list pages
The system SHALL display skeleton loading states while data is being fetched on list pages, styled to the Soft Modernist dark theme using the configured surface tokens.

#### Scenario: Customer list loading
- **WHEN** user navigates to /customers and data is loading
- **THEN** system displays a table skeleton with placeholder rows whose background uses `--color-surface` and whose shimmer/pulse uses `--color-surface-2`

#### Scenario: Contract list loading
- **WHEN** user navigates to /contracts and data is loading
- **THEN** system displays a table skeleton with placeholder rows styled with the dark-theme surface tokens

#### Scenario: Time entries loading
- **WHEN** user navigates to time reports and data is loading
- **THEN** system displays a table skeleton with placeholder rows styled with the dark-theme surface tokens

### Requirement: Loading states for dashboard
The system SHALL display skeleton loading states for dashboard widgets, styled to the Soft Modernist dark theme.

#### Scenario: Dashboard cards loading
- **WHEN** user navigates to dashboard and stats are loading
- **THEN** system displays card skeletons for each stat widget using `--color-surface` with subtle pulse animation

#### Scenario: Recent activity loading
- **WHEN** dashboard recent activity is loading
- **THEN** system displays a list skeleton for activity items using the dark-theme surface tokens

### Requirement: Empty states for list pages
The system SHALL display helpful empty state messages when lists have no data, using the display serif font for the headline and the muted foreground token for the supporting copy.

#### Scenario: No customers
- **WHEN** internal user views customer list with no customers
- **THEN** system displays an empty state with a serif "No customers yet" headline and an "Add Customer" primary button styled with `--color-accent`

#### Scenario: No contracts for customer
- **WHEN** user views customer detail with no contracts
- **THEN** system displays an empty state with a serif "No contracts" headline and supporting copy in `--color-fg-muted`

#### Scenario: No time entries
- **WHEN** user views time reports with no entries matching filters
- **THEN** system displays an empty state with a serif "No time entries found" headline and supporting copy in `--color-fg-muted`

#### Scenario: No priorities
- **WHEN** user views priorities list with no priorities
- **THEN** system displays an empty state with a serif "No priorities" headline and an action button styled with `--color-accent`

#### Scenario: No requests
- **WHEN** user views requests list with no requests
- **THEN** system displays an empty state with a serif "No requests" headline and an action button styled with `--color-accent`

### Requirement: Error boundaries for page failures
The system SHALL display user-friendly error messages when page rendering fails, using the dark-theme surface tokens and a destructive accent that meets WCAG AA contrast against `--color-bg`.

#### Scenario: Page render error
- **WHEN** a page component throws an error during render
- **THEN** system displays an error boundary with a "Something went wrong" message and a retry button on a `--color-surface` panel

#### Scenario: Data fetch error
- **WHEN** a data fetch fails with network error
- **THEN** system displays an error message with option to retry, styled with the dark-theme surface tokens
