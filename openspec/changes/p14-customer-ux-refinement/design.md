# Design: Phase 14 - Customer UX Refinement

## Approach
Pass `isCustomer` or `role` prop to components that need conditional rendering based on user role.

## Time Logs Page (`/time-logs`)

### Current (Internal View)
```
Time Logs
Track time spent on customer work

[Customer ▼] [Contract ▼] [Category ▼] [Date From] [Date To]

| Date | Customer | Contract | Staff | Category | Description | Hours |
```

### Customer View
```
Time Logs
View time logged for your account

[Contract ▼] [Category ▼] [Date From] [Date To]

| Date | Contract | Category | Description | Hours |
```

**Changes:**
- `app/(portal)/time-logs/page.tsx`: Pass `isCustomer` to filter component
- `components/time-logs/time-logs-filter.tsx`: Hide customer dropdown when `isCustomer`
- Table: Hide Customer and Staff columns for customer_user

## Reports Page (`/reports`)

Already has `showCustomerFilter={isInternal}` - just verify it works.

**Changes:**
- Update page description for customers

## Contracts Page (`/contracts`)

### Customer View
- Hide any internal-only columns
- Update page description

## Priorities Page (`/priorities`)

### Customer View
- Verify filters are appropriate
- Update page description

## Requests Page (`/requests`)

### Customer View
- Already hides internal_notes
- Verify customer filter is hidden
- Update page description

## Implementation Pattern

```tsx
// In page.tsx
const profile = await getProfile();
const isCustomer = profile?.role === "customer_user";

// Pass to components
<SomeFilter isCustomer={isCustomer} />
<SomeTable isCustomer={isCustomer} />
```

## Files to Modify

1. `app/(portal)/time-logs/page.tsx` - Add role check, pass to components
2. `components/time-logs/time-logs-filter.tsx` - Hide customer dropdown
3. `app/(portal)/contracts/page.tsx` - Update description for customers
4. `app/(portal)/priorities/page.tsx` - Update description, verify filters
5. `app/(portal)/requests/page.tsx` - Update description, verify filters
