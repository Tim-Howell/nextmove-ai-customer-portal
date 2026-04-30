# ux-states Specification

## Purpose
Defines required UX states across pages: loading skeletons, empty states, and error states.

## Requirements

### Requirement: Loading states for list pages
The system SHALL display skeleton loading states while data is being fetched on list pages, styled to the Apple-style soft-light theme using the configured surface tokens.

#### Scenario: Customer list loading
- **WHEN** user navigates to /customers and data is loading
- **THEN** system displays a table skeleton with placeholder rows whose background uses `--brand-surface` and whose shimmer/pulse uses `--brand-surface-2`

#### Scenario: Contract list loading
- **WHEN** user navigates to /contracts and data is loading
- **THEN** system displays a table skeleton with placeholder rows styled with the light-theme surface tokens

#### Scenario: Time entries loading
- **WHEN** user navigates to time reports and data is loading
- **THEN** system displays a table skeleton with placeholder rows styled with the light-theme surface tokens

### Requirement: Loading states for dashboard
The system SHALL display skeleton loading states for dashboard widgets, styled to the Apple-style soft-light theme.

#### Scenario: Dashboard cards loading
- **WHEN** user navigates to dashboard and stats are loading
- **THEN** system displays card skeletons for each stat widget using `--brand-surface` with subtle pulse animation

#### Scenario: Recent activity loading
- **WHEN** dashboard recent activity is loading
- **THEN** system displays a list skeleton for activity items using the light-theme surface tokens

### Requirement: Error boundaries for page failures
The system SHALL display user-friendly error messages when page rendering fails, using the light-theme surface tokens and a destructive accent that meets WCAG AA contrast against `--brand-bg`.

#### Scenario: Page render error
- **WHEN** a page component throws an error during render
- **THEN** system displays an error boundary with a "Something went wrong" message and a retry button on a `--brand-surface` panel

#### Scenario: Data fetch error
- **WHEN** a data fetch fails with network error
- **THEN** system displays an error message with option to retry, styled with the light-theme surface tokens

### Requirement: Empty states for list pages
The system SHALL display helpful empty state messages when lists have no data, using the display serif font for the headline and the muted foreground token for the supporting copy.

#### Scenario: No customers
- **WHEN** internal user views customer list with no customers
- **THEN** system displays an empty state with a serif "No customers yet" headline and an "Add Customer" primary button styled with the configured accent color

#### Scenario: No contracts for customer
- **WHEN** user views customer detail with no contracts
- **THEN** system displays an empty state with a serif "No contracts" headline and supporting copy in `--brand-fg-muted`

#### Scenario: No time entries
- **WHEN** user views time reports with no entries matching filters
- **THEN** system displays an empty state with a serif "No time entries found" headline and supporting copy in `--brand-fg-muted`

#### Scenario: No priorities
- **WHEN** user views priorities list with no priorities
- **THEN** system displays an empty state with a serif "No priorities" headline and an action button styled with the configured accent color

#### Scenario: No requests
- **WHEN** user views requests list with no requests
- **THEN** system displays an empty state with a serif "No requests" headline and an action button styled with the configured accent color

### Requirement: Success notifications for CRUD operations
The system SHALL display toast notifications when CRUD operations succeed.

#### Scenario: Create success
- **WHEN** user successfully creates a record (customer, contract, time entry, etc.)
- **THEN** system displays success toast with "[Type] created successfully"

#### Scenario: Update success
- **WHEN** user successfully updates a record
- **THEN** system displays success toast with "[Type] updated successfully"

#### Scenario: Delete success
- **WHEN** user successfully deletes a record
- **THEN** system displays success toast with "[Type] deleted successfully"

#### Scenario: Archive success
- **WHEN** user successfully archives a record
- **THEN** system displays success toast with "[Type] archived successfully"

### Requirement: Error notifications for failed operations
The system SHALL display toast notifications when operations fail.

#### Scenario: Operation fails
- **WHEN** a CRUD operation fails
- **THEN** system displays error toast with descriptive error message

#### Scenario: Validation error
- **WHEN** form submission fails validation
- **THEN** system displays inline validation errors (not toast)

### Requirement: Accessible loading indicators
The system SHALL ensure loading states are accessible to screen readers.

#### Scenario: Loading announced
- **WHEN** page enters loading state
- **THEN** system sets aria-busy="true" on loading region

#### Scenario: Loading complete announced
- **WHEN** loading completes
- **THEN** system removes aria-busy and content is focusable

### Requirement: Responsive empty states
The system SHALL display empty states appropriately on all screen sizes.

#### Scenario: Mobile empty state
- **WHEN** user views empty list on mobile device
- **THEN** empty state displays centered with appropriate padding

#### Scenario: Desktop empty state
- **WHEN** user views empty list on desktop
- **THEN** empty state displays centered within the content area
