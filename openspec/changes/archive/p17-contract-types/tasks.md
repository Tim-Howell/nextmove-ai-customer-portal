# Phase 17: Contract Types Enhancement - Tasks

## 1. Database Schema

- [x] 1.1 Create `contract_types` table with behavior flags (replaces billing_model enum)
- [x] 1.2 Add `hours_per_period` numeric column to contracts
- [x] 1.3 Add `billing_day` integer column to contracts (1-28)
- [x] 1.4 Add `rollover_enabled` boolean column to contracts (default false)
- [x] 1.5 Add `rollover_expiration_days` integer column to contracts (nullable)
- [x] 1.6 Add `max_rollover_hours` numeric column to contracts (nullable)
- [x] 1.7 Add `fixed_cost` decimal column to contracts (nullable)
- [ ] 1.8 Create `contract_period_hours` table for subscription tracking (deferred - using on-demand calculation)
- [x] 1.9 Create migration with all schema changes
- [x] 1.10 Migrate existing contracts from reference_values to contract_types table

## 2. Contract Types Table

- [x] 2.1 Create contract_types table with value, label, description
- [x] 2.2 Add behavior flags: tracks_hours, has_hour_limit, is_recurring, supports_rollover
- [x] 2.3 Seed 5 contract types: hours_bucket, hours_subscription, fixed_cost, service_subscription, on_demand
- [x] 2.4 Add RLS policies for read access

## 3. Contract Form Updates

- [x] 3.1 Update contract form to use contract_types table
- [x] 3.2 Implement conditional field display based on contract type
- [x] 3.3 Show hours_per_period, billing_day for hours_subscription
- [x] 3.4 Show rollover fields when hours_subscription selected
- [x] 3.5 Show total_hours for hours_bucket
- [x] 3.6 Show fixed_cost for fixed_cost contracts
- [x] 3.7 Update contract validation schema (Zod) with billing fields
- [x] 3.8 Update createContract action for new fields
- [x] 3.9 Update updateContract action for new fields

## 4. Hours Bucket Logic

- [x] 4.1 Create `calculateBucketHours` function
- [x] 4.2 Calculate total hours used from time_entries
- [x] 4.3 Calculate hours remaining (total_hours - used)
- [x] 4.4 Detect overage condition (remaining < 0)
- [x] 4.5 Display overage warning in reports
- [x] 4.6 Update contract detail page with bucket stats

## 5. Hours Subscription Logic

- [x] 5.1 Create `calculateBillingPeriod` function (based on billing_day)
- [x] 5.2 Create `calculateSubscriptionHours` function
- [x] 5.3 Calculate hours used in current period
- [x] 5.4 Calculate rollover hours from previous periods
- [x] 5.5 Apply rollover expiration logic
- [x] 5.6 Use rollover hours FIRST before period allocation
- [x] 5.7 Handle max_rollover_hours cap
- [ ] 5.8 Display period history on contract detail page (future enhancement)

## 6. Fixed Cost & Service Subscription

- [x] 6.1 Implement simple hour tracking (no limits)
- [x] 6.2 Display "X hours logged" without limit context
- [x] 6.3 Show fixed_cost on contract detail if set
- [x] 6.4 No overage warnings for these types

## 7. On-Demand / Ad-Hoc

- [x] 7.1 Ensure existing default contracts work as on_demand
- [x] 7.2 Simple hour tracking with no parameters
- [x] 7.3 No limits, no warnings

## 8. Contract Detail Page Updates

- [x] 8.1 Create ContractHoursStats component
- [x] 8.2 Display type-specific stats section
- [x] 8.3 Hours Bucket: progress bar, hours used/remaining, overage warning
- [x] 8.4 Hours Subscription: current period stats, rollover breakdown
- [x] 8.5 Fixed Cost: hours logged, contract value
- [x] 8.6 Service Subscription: hours logged
- [x] 8.7 Show rollover settings if applicable

## 9. Time Entry Integration

- [x] 9.1 Create ContractHoursContext component
- [x] 9.2 Show contract hours context when selecting contract
- [x] 9.3 Display hours remaining for bucket/subscription
- [x] 9.4 Warning indicator if entry would cause overage
- [x] 9.5 Do NOT block entry on overage (just warn)

## 10. Reports Integration

- [x] 10.1 Create ContractOverageAlerts component
- [x] 10.2 Show overage indicators in report results
- [x] 10.3 Create getContractsWithOverages action
- [ ] 10.4 Add billing_model filter to reports (future enhancement)
- [ ] 10.5 Period-over-period comparison for subscriptions (future enhancement)

## 11. TypeScript Types

- [x] 11.1 Create ContractType interface
- [x] 11.2 Update Contract interface with billing fields
- [x] 11.3 Update ContractWithRelations with calculated fields
- [x] 11.4 Create ContractForCalculation type
- [x] 11.5 Create HoursCalculationResult type

## 12. Testing & Validation

- [ ] 12.1 Test hours bucket calculation and overage
- [ ] 12.2 Test subscription period calculation
- [ ] 12.3 Test rollover accumulation
- [ ] 12.4 Test rollover expiration
- [ ] 12.5 Test rollover used first
- [ ] 12.6 Test max_rollover_hours cap
- [ ] 12.7 Test contract form conditional fields
- [ ] 12.8 Test time entry warnings
- [ ] 12.9 Verify existing contracts migrated correctly
