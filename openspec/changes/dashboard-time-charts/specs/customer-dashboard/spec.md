## MODIFIED Requirements

### Requirement: Customer dashboard view
The system SHALL display a customer-specific dashboard for `customer_user` role, structured with time charts and contract burndown cards above existing summary tiles.

#### Scenario: Customer sees welcome
- **WHEN** customer user views dashboard
- **THEN** system displays welcome message with their customer name above the chart filter bar

#### Scenario: Customer sees hours-over-time chart
- **WHEN** customer user views dashboard
- **THEN** system displays the hours-over-time stacked bar chart at the top of the page, defaulting to a daily view of the trailing 30 days

#### Scenario: Customer sees burndown cards for hours contracts
- **WHEN** customer user views dashboard and has at least one contract with `tracks_hours = true AND has_hour_limit = true`
- **THEN** system displays one burndown card per qualifying contract, in a row below the chart

#### Scenario: Customer sees contracts summary
- **WHEN** customer user views dashboard
- **THEN** below the charts and burndowns, system displays count of active contracts as part of the summary tile area

#### Scenario: Customer sees time summary
- **WHEN** customer user views dashboard
- **THEN** below the charts, system displays recent time entries for their customer

#### Scenario: Customer sees priorities
- **WHEN** customer user views dashboard
- **THEN** below the charts, system displays count of open priorities
