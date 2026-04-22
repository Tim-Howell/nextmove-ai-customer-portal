# Phase 17: Contract Types Enhancement - Tasks

## 1. Database Schema

- [ ] 1.1 Add `billing_model` enum column to contracts (hours_bucket, hours_subscription, fixed_cost, service_subscription, on_demand)
- [ ] 1.2 Add `hours_per_period` integer column to contracts
- [ ] 1.3 Add `refresh_cycle` text column to contracts (default 'monthly')
- [ ] 1.4 Add `refresh_day` integer column to contracts (1-28, default 1)
- [ ] 1.5 Add `rollover_enabled` boolean column to contracts (default false)
- [ ] 1.6 Add `rollover_expiration_days` integer column to contracts (nullable)
- [ ] 1.7 Add `max_rollover_hours` integer column to contracts (nullable)
- [ ] 1.8 Add `fixed_cost` decimal column to contracts (nullable)
- [ ] 1.9 Create `contract_period_hours` table for subscription tracking
- [ ] 1.10 Create migration with all schema changes
- [ ] 1.11 Migrate existing contracts to appropriate billing_model based on contract_type

## 2. Update Reference Values

- [ ] 2.1 Review existing contract_type reference values
- [ ] 2.2 Map contract_type to billing_model (hours_subscription → hours_subscription, etc.)
- [ ] 2.3 Decide: keep contract_type for display label OR replace with billing_model
- [ ] 2.4 Update seed data if needed

## 3. Contract Form Updates

- [ ] 3.1 Add billing_model selector to contract form
- [ ] 3.2 Implement conditional field display based on billing_model
- [ ] 3.3 Show hours_per_period, refresh_day for hours_subscription
- [ ] 3.4 Show rollover fields when hours_subscription selected
- [ ] 3.5 Show total_hours, start_date, end_date for hours_bucket
- [ ] 3.6 Show fixed_cost for fixed_cost contracts
- [ ] 3.7 Validate required fields per billing_model
- [ ] 3.8 Update contract validation schema (Zod)
- [ ] 3.9 Update createContract action for new fields
- [ ] 3.10 Update updateContract action for new fields

## 4. Hours Bucket Logic

- [ ] 4.1 Create `calculateBucketHours` function
- [ ] 4.2 Calculate total hours used from time_entries
- [ ] 4.3 Calculate hours remaining (total_hours - used)
- [ ] 4.4 Detect overage condition (remaining < 0)
- [ ] 4.5 Display overage warning in reports (not blocking)
- [ ] 4.6 Update contract detail page with bucket stats

## 5. Hours Subscription Logic

- [ ] 5.1 Create `calculateCurrentPeriod` function (based on refresh_day)
- [ ] 5.2 Create `calculatePeriodHours` function
- [ ] 5.3 Calculate hours used in current period
- [ ] 5.4 Create `calculateRolloverHours` function
- [ ] 5.5 Track rollover hours from previous periods
- [ ] 5.6 Apply rollover expiration logic
- [ ] 5.7 Use rollover hours FIRST before period allocation
- [ ] 5.8 Create `generatePeriodRecord` function for period tracking
- [ ] 5.9 Auto-generate period records on period boundary (or on-demand)
- [ ] 5.10 Handle max_rollover_hours cap

## 6. Period Tracking

- [ ] 6.1 Create function to initialize period record
- [ ] 6.2 Create function to close period and calculate rollover out
- [ ] 6.3 Create scheduled job or trigger for period transitions (or calculate on-demand)
- [ ] 6.4 Store period history in contract_period_hours
- [ ] 6.5 Display period history on contract detail page

## 7. Fixed Cost & Service Subscription

- [ ] 7.1 Implement simple hour tracking (no limits)
- [ ] 7.2 Display "X hours logged" without limit context
- [ ] 7.3 Show fixed_cost on contract detail if set
- [ ] 7.4 No overage warnings for these types

## 8. On-Demand / Ad-Hoc

- [ ] 8.1 Ensure existing default contracts work as on_demand
- [ ] 8.2 Simple hour tracking with no parameters
- [ ] 8.3 No limits, no warnings

## 9. Contract Detail Page Updates

- [ ] 9.1 Show billing model badge
- [ ] 9.2 Display type-specific stats section
- [ ] 9.3 Hours Bucket: progress bar, hours used/remaining, overage warning
- [ ] 9.4 Hours Subscription: current period stats, rollover breakdown
- [ ] 9.5 Fixed Cost: hours logged, contract value
- [ ] 9.6 Service Subscription: hours logged this period
- [ ] 9.7 Add period history table for subscriptions
- [ ] 9.8 Show rollover expiration dates if applicable

## 10. Time Entry Integration

- [ ] 10.1 Show contract hours context when selecting contract
- [ ] 10.2 Display "X hours remaining" for bucket/subscription
- [ ] 10.3 Warning indicator if entry would cause overage
- [ ] 10.4 Do NOT block entry on overage (just warn)
- [ ] 10.5 Update hours calculations after time entry save

## 11. Reports Integration

- [ ] 11.1 Add billing_model filter to reports
- [ ] 11.2 Show overage indicators in report results
- [ ] 11.3 Add period breakdown view for subscriptions
- [ ] 11.4 Show rollover usage in reports
- [ ] 11.5 Period-over-period comparison for subscriptions

## 12. Dashboard Updates

- [ ] 12.1 Update contract stats on dashboard
- [ ] 12.2 Show contracts approaching limit
- [ ] 12.3 Show contracts with rollover expiring soon
- [ ] 12.4 Highlight overages

## 13. TypeScript Types

- [ ] 13.1 Update Contract interface with new fields
- [ ] 13.2 Create BillingModel type
- [ ] 13.3 Create ContractPeriodHours interface
- [ ] 13.4 Update ContractWithRelations with calculated fields
- [ ] 13.5 Create helper types for period calculations

## 14. Testing & Validation

- [ ] 14.1 Test hours bucket calculation and overage
- [ ] 14.2 Test subscription period calculation
- [ ] 14.3 Test rollover accumulation
- [ ] 14.4 Test rollover expiration
- [ ] 14.5 Test rollover used first
- [ ] 14.6 Test max_rollover_hours cap
- [ ] 14.7 Test period boundary transitions
- [ ] 14.8 Test contract form conditional fields
- [ ] 14.9 Test time entry warnings
- [ ] 14.10 Test report filtering by billing model
- [ ] 14.11 Verify existing contracts migrated correctly
