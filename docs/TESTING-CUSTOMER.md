# Customer Portal Testing Script

Manual testing checklist for customer portal users. Complete each section and mark items as passed (✓) or failed (✗).

**Test Environment:** ___________________  
**Tester:** ___________________  
**Date:** ___________________  
**Customer Account Used:** ___________________  
**Customer Organization:** ___________________

---

## 1. Authentication

### 1.1 Magic Link Login
- [ ] Navigate to login page
- [ ] Enter customer email address
- [ ] Click "Send Magic Link"
- [ ] Verify "Check your email" confirmation appears
- [ ] Open email and click magic link
- [ ] Verify redirect to customer dashboard
- [ ] Verify correct user name displayed in header
- [ ] Verify customer organization name displayed

### 1.2 Password Login
- [ ] Navigate to login page
- [ ] Click "Sign in with password"
- [ ] Enter valid credentials
- [ ] Verify redirect to customer dashboard
- [ ] Test invalid password shows error message

### 1.3 Password Reset
- [ ] Click "Forgot password?" on login page
- [ ] Enter email address
- [ ] Verify reset email received
- [ ] Click reset link and set new password
- [ ] Verify can login with new password

### 1.4 Logout
- [ ] Click user menu in header
- [ ] Click "Sign out"
- [ ] Verify redirect to login page
- [ ] Verify cannot access protected pages

### 1.5 Access Control - Disabled Portal Access
- [ ] (Admin) Disable portal access for a customer contact
- [ ] Attempt to login as that contact
- [ ] Verify login is blocked with appropriate message

### 1.6 Access Control - Archived Customer
- [ ] (Admin) Archive a customer organization
- [ ] Attempt to login as a contact from that customer
- [ ] Verify login is blocked with "organization archived" message

---

## 2. Customer Dashboard

### 2.1 Dashboard Display
- [ ] Dashboard loads without errors
- [ ] Welcome message displays with customer name
- [ ] Organization name displays correctly
- [ ] Stats cards show relevant data:
  - [ ] Active Contracts count
  - [ ] Hours Used (this period)
  - [ ] Open Requests count
  - [ ] Active Priorities count

### 2.2 Active Contracts Section
- [ ] Active contracts list displays
- [ ] Contract names are visible
- [ ] Contract types are shown
- [ ] Clicking a contract navigates to contract detail

### 2.3 Recent Activity
- [ ] Recent time entries display (if any)
- [ ] Recent requests display (if any)

### 2.4 Quick Actions
- [ ] "New Request" button visible and works
- [ ] "View Reports" button visible and works

---

## 3. Contracts (Customer View)

### 3.1 Contract List
- [ ] Navigate to Contracts page
- [ ] Only contracts for THIS customer display
- [ ] Cannot see other customers' contracts
- [ ] Contract status badges display correctly
- [ ] Contract type labels display correctly

### 3.2 Contract Detail - Hours Bucket
- [ ] Click on an Hours Bucket contract
- [ ] Contract name and details display
- [ ] Total hours allocated shows
- [ ] Hours used shows
- [ ] Hours remaining shows
- [ ] Progress bar displays usage percentage
- [ ] Time entries for this contract display

### 3.3 Contract Detail - Hours Subscription
- [ ] Click on an Hours Subscription contract
- [ ] Hours per period displays
- [ ] Current period usage shows
- [ ] Rollover hours display (if applicable)
- [ ] Billing day information shows

### 3.4 Contract Detail - Fixed Cost
- [ ] Click on a Fixed Cost contract
- [ ] Contract details display
- [ ] No hours tracking shown

### 3.5 Contract Detail - On Demand
- [ ] Click on an On Demand contract
- [ ] Contract details display
- [ ] Time entries display with hours

### 3.6 Read-Only Verification
- [ ] Verify NO edit buttons on contracts
- [ ] Verify NO delete buttons on contracts
- [ ] Verify cannot modify contract data

---

## 4. Priorities (Customer View)

### 4.1 Priority List
- [ ] Navigate to Priorities page
- [ ] Only priorities for THIS customer display
- [ ] Cannot see other customers' priorities
- [ ] Priority level badges display (High/Medium/Low)
- [ ] Priority status displays

### 4.2 Priority Detail
- [ ] Click on a priority
- [ ] Priority title and description display
- [ ] Level and status display
- [ ] Related time entries show (if any)

### 4.3 Read-Only Verification (Normal)
- [ ] For active priorities, verify view-only access
- [ ] No edit capability for customer users

### 4.4 Read-Only Verification (Archived Customer)
- [ ] For priorities from archived customer
- [ ] Verify read-only badge displays
- [ ] Verify no actions available

---

## 5. Requests

### 5.1 Request List
- [ ] Navigate to Requests page
- [ ] Only requests for THIS customer display
- [ ] Cannot see other customers' requests
- [ ] Request status badges display
- [ ] Request category displays

### 5.2 Create Request
- [ ] Click "New Request" button
- [ ] Request form displays
- [ ] Customer is pre-selected (cannot change)
- [ ] Enter request title
- [ ] Enter request description
- [ ] Select category
- [ ] Submit request
- [ ] Verify success message
- [ ] Verify request appears in list with "New" status

### 5.3 View Request Detail
- [ ] Click on a request
- [ ] Request title and description display
- [ ] Status displays
- [ ] Category displays
- [ ] Created date displays
- [ ] Assigned staff member displays (if assigned)

### 5.4 Edit Own Request (if allowed)
- [ ] Click edit on a request you created
- [ ] Modify title or description
- [ ] Save changes
- [ ] Verify changes reflected

### 5.5 Request Status Updates
- [ ] View a request that staff has updated
- [ ] Verify status change is visible
- [ ] Verify any staff notes are visible

---

## 6. Time Reports

### 6.1 Report Access
- [ ] Navigate to Time Reports page
- [ ] Report page loads

### 6.2 Report Data
- [ ] Only time entries for THIS customer display
- [ ] Cannot see other customers' time data
- [ ] Date range filter works
- [ ] Contract filter works (shows only customer's contracts)

### 6.3 Report Display
- [ ] Time entries list displays
- [ ] Entry date displays
- [ ] Hours displays
- [ ] Description displays
- [ ] Contract name displays
- [ ] Staff member name displays
- [ ] Priority displays (if linked)

### 6.4 Report Totals
- [ ] Total hours for period calculates correctly
- [ ] Hours by contract breakdown shows (if available)

---

## 7. Navigation & UI

### 7.1 Sidebar Navigation
- [ ] Dashboard link works
- [ ] Contracts link works
- [ ] Priorities link works
- [ ] Requests link works
- [ ] Time Reports link works
- [ ] Current page is highlighted

### 7.2 Restricted Navigation
- [ ] NO access to Customers page
- [ ] NO access to Time Logs (admin entry)
- [ ] NO access to Settings
- [ ] NO access to Staff Users
- [ ] NO access to Audit Log
- [ ] Attempting direct URL access redirects appropriately

### 7.3 Header
- [ ] Organization logo displays (if configured)
- [ ] Organization name displays
- [ ] User name displays
- [ ] User menu works
- [ ] Sign out works

### 7.4 Branding
- [ ] Custom organization name displays (if configured)
- [ ] Custom logo displays (if configured)

---

## 8. Data Isolation

### 8.1 Customer Data Boundary
- [ ] Can only see own customer's contracts
- [ ] Can only see own customer's priorities
- [ ] Can only see own customer's requests
- [ ] Can only see own customer's time entries
- [ ] Cannot access other customer IDs via URL manipulation

### 8.2 URL Manipulation Tests
- [ ] Try accessing `/customers` - should be blocked
- [ ] Try accessing `/customers/[other-customer-id]` - should be blocked
- [ ] Try accessing `/contracts/[other-customer-contract-id]` - should be blocked
- [ ] Try accessing `/time-logs` - should be blocked
- [ ] Try accessing `/settings` - should be blocked

---

## 9. Error Handling

### 9.1 Error States
- [ ] Navigate to non-existent page (404)
- [ ] Verify 404 page displays
- [ ] Test with invalid contract ID in URL
- [ ] Verify appropriate error message

### 9.2 Loading States
- [ ] Verify loading indicators appear during data fetch
- [ ] No flash of unstyled content

### 9.3 Empty States
- [ ] View page with no data (e.g., no requests yet)
- [ ] Verify empty state message displays
- [ ] "Create Request" action in empty state works

---

## 10. Responsive Design

### 10.1 Desktop (1920px+)
- [ ] Layout displays correctly
- [ ] Sidebar fully visible
- [ ] Content readable

### 10.2 Laptop (1024px-1919px)
- [ ] Layout adjusts appropriately
- [ ] No horizontal scrolling

### 10.3 Tablet (768px-1023px)
- [ ] Sidebar collapses appropriately
- [ ] Content remains readable
- [ ] Request form is usable

### 10.4 Mobile (< 768px)
- [ ] Navigation accessible via menu
- [ ] Content stacks vertically
- [ ] Buttons are tap-friendly
- [ ] Request form is usable
- [ ] Reports are viewable

---

## 11. Demo Account Testing

### 11.1 Demo Account Access
- [ ] Login with demo account (demo-acme1@example.com)
- [ ] Verify demo data displays
- [ ] Verify demo customer organization shows

### 11.2 Demo Data Visibility Toggle
- [ ] (Admin) Disable "Show Demo Data" in settings
- [ ] Attempt to login with demo account
- [ ] Verify login is blocked with appropriate message
- [ ] (Admin) Re-enable "Show Demo Data"
- [ ] Verify demo account can login again

---

## Test Summary

| Section | Passed | Failed | Notes |
|---------|--------|--------|-------|
| Authentication | | | |
| Dashboard | | | |
| Contracts | | | |
| Priorities | | | |
| Requests | | | |
| Time Reports | | | |
| Navigation | | | |
| Data Isolation | | | |
| Error Handling | | | |
| Responsive | | | |
| Demo Accounts | | | |

**Overall Result:** ☐ PASS ☐ FAIL

**Critical Issues Found:**
1. 
2. 
3. 

**Minor Issues Found:**
1. 
2. 
3. 

**Security Concerns:**
1. 
2. 

**Tester Signature:** ___________________ **Date:** ___________

---

## Test Accounts

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Demo Customer (Acme) | demo-acme1@example.com | (use magic link) | Demo account |
| Demo Customer (TechStart) | demo-techstart@example.com | (use magic link) | Demo account |
| Real Customer | (your test account) | (use magic link) | |

---

## Quick Reference: What Customers Should NOT See

- ❌ Other customers' data
- ❌ Admin dashboard
- ❌ Customer management
- ❌ Time log entry (admin)
- ❌ Settings pages
- ❌ Staff user management
- ❌ Audit logs
- ❌ Reference data management
- ❌ Edit/delete contracts
- ❌ Edit/delete priorities (view only)
