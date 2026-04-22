# Phase 17: Contract Types Enhancement

## Summary
Implement comprehensive contract type handling to support different billing models: Hours Bucket, Hours Subscription, Fixed Cost, and Service Subscription. Each type has unique properties for hour tracking, refresh cycles, rollover rules, and overage handling.

## Contract Type Definitions

### 1. Hours Bucket
- **Description**: Fixed pool of hours to be used within a timeframe
- **Properties**:
  - `total_hours`: Total hours in the bucket
  - `start_date` / `end_date`: Bucket validity period
  - Hours are deducted as time is logged
  - Cannot go negative (warning when exceeded)
  - No refresh - once depleted, bucket is exhausted
- **Display**: "X of Y hours used" with progress bar
- **Overage**: Warning in reports, not blocked at entry

### 2. Hours Subscription
- **Description**: Recurring hours that refresh on a cycle (monthly)
- **Properties**:
  - `hours_per_period`: Hours allocated per refresh cycle
  - `refresh_cycle`: monthly (future: weekly, quarterly)
  - `refresh_day`: Day of month when hours refresh (1-28)
  - `rollover_enabled`: Whether unused hours carry forward
  - `rollover_expiration_days`: Days until rollover hours expire (null = end of contract)
  - `max_rollover_hours`: Cap on accumulated rollover (optional)
- **Rollover Logic**:
  - Rollover hours are used FIRST in subsequent periods
  - Expired rollover hours are tracked but not usable
  - Rollover expiration calculated from when hours were earned
- **Display**: "X of Y hours used this period (+ Z rollover available)"

### 3. Fixed Cost
- **Description**: Fixed price contract, hours tracked for visibility only
- **Properties**:
  - `fixed_cost`: Contract value (for reference, not billing)
  - Hours logged for internal tracking
  - No hour limits or warnings
- **Display**: "X hours logged" (no limit shown)

### 4. Service Subscription
- **Description**: Ongoing service at fixed cost, hours for tracking
- **Properties**:
  - Similar to Fixed Cost
  - Typically ongoing with no end date
  - Hours logged for visibility
- **Display**: "X hours logged this period"

### 5. On-Demand / Ad-Hoc (existing default)
- **Description**: No contract parameters, billed as used
- **Properties**: None specific
- **Display**: "X hours logged"

## Database Schema Changes

### contracts table additions:
```sql
-- Billing model
billing_model ENUM('hours_bucket', 'hours_subscription', 'fixed_cost', 'service_subscription', 'on_demand')

-- Hours Subscription specific
hours_per_period INTEGER
refresh_cycle TEXT DEFAULT 'monthly'
refresh_day INTEGER DEFAULT 1
rollover_enabled BOOLEAN DEFAULT false
rollover_expiration_days INTEGER
max_rollover_hours INTEGER

-- Fixed Cost specific
fixed_cost DECIMAL(10,2)

-- Tracking
is_default BOOLEAN DEFAULT false
```

### New table: contract_period_hours
```sql
-- Tracks hours per billing period for subscriptions
contract_id UUID
period_start DATE
period_end DATE
allocated_hours DECIMAL
rollover_hours_in DECIMAL
hours_used DECIMAL
rollover_hours_out DECIMAL
rollover_expires_at DATE
```

## Calculation Logic

### Hours Bucket
```
hours_remaining = total_hours - SUM(time_entries.hours WHERE contract_id = X)
is_exceeded = hours_remaining < 0
```

### Hours Subscription
```
current_period = calculate_period(refresh_day, today)
period_hours_used = SUM(time_entries.hours WHERE contract_id = X AND entry_date IN current_period)
available_rollover = SUM(unexpired rollover from previous periods)
total_available = hours_per_period + available_rollover
hours_remaining = total_available - period_hours_used
```

### Rollover Expiration
```
IF rollover_expiration_days IS NOT NULL:
  expires_at = period_end + rollover_expiration_days
ELSE IF contract.end_date IS NOT NULL:
  expires_at = contract.end_date
ELSE:
  expires_at = NULL (never expires)
```

## UI Considerations

### Contract Form
- Show/hide fields based on billing_model selection
- Validate required fields per model
- Preview calculation example

### Contract Detail Page
- Show period-specific stats for subscriptions
- Show rollover breakdown if applicable
- Historical period view for subscriptions

### Time Entry
- Show hours remaining context when selecting contract
- Warning if logging would exceed bucket/period

### Reports
- Filter by billing model
- Show overage warnings
- Period-over-period comparison for subscriptions
