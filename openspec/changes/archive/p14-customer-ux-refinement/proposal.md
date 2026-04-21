# Proposal: Phase 14 - Customer UX Refinement

## Why
Customer users currently see internal-focused UI elements that don't make sense for them:
- Customer dropdown filters (they only have one customer)
- Staff columns in time logs
- Internal-oriented page descriptions
- Filters and options meant for internal users

This creates a confusing experience and potentially exposes information they shouldn't see.

## What

### 1. Time Logs Page
- Remove customer dropdown filter for customer_user
- Remove Staff column from table
- Update page description to customer-friendly text
- Auto-filter to their customer (already done via RLS, but UI should reflect this)

### 2. Reports Page
- Remove customer filter for customer_user (already implemented)
- Verify summary and table display correctly
- Update page description

### 3. Contracts Page
- Remove any internal-only columns or filters
- Ensure customer sees only their contracts

### 4. Priorities Page
- Verify customer can only see their priorities
- Remove any internal-only UI elements

### 5. Requests Page
- Verify internal_notes are hidden (already implemented)
- Ensure customer-friendly view

### 6. General
- Review all pages for customer-appropriate content
- Add customer-friendly empty states
- Ensure consistent messaging

## Out of Scope
- New features for customers
- Redesigning the overall layout
- Customer-specific branding
