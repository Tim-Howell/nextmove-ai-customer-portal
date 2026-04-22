# Admin Testing Script

Manual testing checklist for admin users. Complete each section and mark items as passed (✓) or failed (✗).

**Test Environment:** ___________________  
**Tester:** ___________________  
**Date:** ___________________  
**Admin Account Used:** ___________________

---

## 1. Authentication

### 1.1 Magic Link Login
- [ ] Navigate to login page
- [ ] Enter admin email address
- [ ] Click "Send Magic Link"
- [ ] Verify "Check your email" confirmation appears
- [ ] Open email and click magic link
- [ ] Verify redirect to dashboard
- [ ] Verify correct user name displayed in header

### 1.2 Password Login
- [ ] Navigate to login page
- [ ] Click "Sign in with password"
- [ ] Enter valid credentials
- [ ] Verify redirect to dashboard
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

---

## 2. Dashboard

### 2.1 Admin Dashboard Display
- [ ] Dashboard loads without errors
- [ ] Stats cards display (Customers, Contracts, Hours This Month, Open Requests)
- [ ] Recent activity section shows data
- [ ] Quick actions are visible and functional

### 2.2 Dashboard Navigation
- [ ] Click on stats cards navigates to correct pages
- [ ] Recent items are clickable and navigate correctly

---

## 3. Customer Management

### 3.1 Customer List
- [ ] Navigate to Customers page
- [ ] Customer list displays correctly
- [ ] Search by customer name works
- [ ] Status filter (Active/Inactive) works
- [ ] Pagination works (if >20 customers)
- [ ] "Show Archived" toggle works

### 3.2 Create Customer
- [ ] Click "New Customer" button
- [ ] Fill in required fields (Name, Status)
- [ ] Add optional fields (Notes, Internal Notes)
- [ ] Upload logo (if applicable)
- [ ] Save customer
- [ ] Verify success toast appears
- [ ] Verify redirect to customer detail page
- [ ] Verify customer appears in list

### 3.3 Edit Customer
- [ ] Navigate to customer detail page
- [ ] Click "Edit" button
- [ ] Modify customer fields
- [ ] Save changes
- [ ] Verify success toast appears
- [ ] Verify changes are reflected

### 3.4 Customer Detail Page
- [ ] Customer info displays correctly
- [ ] Contacts section shows customer contacts
- [ ] Contracts section shows customer contracts
- [ ] Priorities section shows customer priorities
- [ ] Requests section shows customer requests

### 3.5 Archive Customer
- [ ] Click "Archive" on customer
- [ ] Confirm archive action
- [ ] Verify customer moves to archived
- [ ] Verify associated contracts are archived
- [ ] Verify customer contacts are disabled
- [ ] Verify priorities/requests are marked read-only

---

## 4. Customer Contacts

### 4.1 Contact List
- [ ] View contacts on customer detail page
- [ ] Contact information displays correctly

### 4.2 Create Contact
- [ ] Click "Add Contact" on customer page
- [ ] Fill in contact details (Name, Email, Title, Phone)
- [ ] Set portal access enabled/disabled
- [ ] Save contact
- [ ] Verify contact appears in list

### 4.3 Edit Contact
- [ ] Click edit on existing contact
- [ ] Modify contact fields
- [ ] Toggle portal access
- [ ] Save changes
- [ ] Verify changes are reflected

### 4.4 Portal Access
- [ ] Enable portal access for a contact
- [ ] Verify contact can login (test separately)
- [ ] Disable portal access
- [ ] Verify contact cannot login

---

## 5. Contract Management

### 5.1 Contract List
- [ ] Navigate to Contracts page
- [ ] Contract list displays correctly
- [ ] Filter by customer works
- [ ] Filter by status works
- [ ] Filter by contract type works
- [ ] "Show Archived" toggle works

### 5.2 Create Contract - Hours Bucket
- [ ] Click "New Contract"
- [ ] Select customer
- [ ] Select "Hours Bucket" type
- [ ] Enter name, total hours, dates
- [ ] Save contract
- [ ] Verify contract appears in list

### 5.3 Create Contract - Hours Subscription
- [ ] Click "New Contract"
- [ ] Select customer
- [ ] Select "Hours Subscription" type
- [ ] Enter hours per period, billing day
- [ ] Configure rollover settings
- [ ] Save contract
- [ ] Verify contract appears in list

### 5.4 Create Contract - Fixed Cost
- [ ] Click "New Contract"
- [ ] Select "Fixed Cost" type
- [ ] Enter fixed cost amount
- [ ] Save contract

### 5.5 Create Contract - On Demand
- [ ] Click "New Contract"
- [ ] Select "On Demand" type
- [ ] Save contract (no hours required)

### 5.6 Edit Contract
- [ ] Navigate to contract detail
- [ ] Click "Edit"
- [ ] Modify contract fields
- [ ] Save changes
- [ ] Verify changes reflected

### 5.7 Contract Detail Page
- [ ] Contract info displays correctly
- [ ] Hours usage displays (for hour-based contracts)
- [ ] Time entries section shows entries
- [ ] Status badge displays correctly

---

## 6. Time Logging

### 6.1 Time Log List
- [ ] Navigate to Time Logs page
- [ ] Time entries display correctly
- [ ] Filter by customer works
- [ ] Filter by contract works
- [ ] Filter by date range works
- [ ] Filter by staff member works

### 6.2 Create Time Entry
- [ ] Click "New Time Entry"
- [ ] Select customer
- [ ] Select contract
- [ ] Select priority (optional)
- [ ] Enter hours and description
- [ ] Select date
- [ ] Save entry
- [ ] Verify entry appears in list

### 6.3 Edit Time Entry
- [ ] Click edit on existing entry
- [ ] Modify fields
- [ ] Save changes
- [ ] Verify changes reflected

### 6.4 Delete Time Entry
- [ ] Click delete on entry
- [ ] Confirm deletion
- [ ] Verify entry removed from list

---

## 7. Priorities

### 7.1 Priority List
- [ ] Navigate to Priorities page
- [ ] Priorities display correctly
- [ ] Filter by customer works
- [ ] Filter by status works
- [ ] Filter by level works

### 7.2 Create Priority
- [ ] Click "New Priority"
- [ ] Select customer
- [ ] Enter title and description
- [ ] Select level (High/Medium/Low)
- [ ] Select status
- [ ] Save priority
- [ ] Verify priority appears in list

### 7.3 Edit Priority
- [ ] Click edit on priority
- [ ] Modify fields
- [ ] Save changes
- [ ] Verify changes reflected

### 7.4 Priority Detail Page
- [ ] Priority info displays correctly
- [ ] Related time entries show (if any)

---

## 8. Requests

### 8.1 Request List
- [ ] Navigate to Requests page
- [ ] Requests display correctly
- [ ] Filter by customer works
- [ ] Filter by status works
- [ ] Filter by category works

### 8.2 Create Request
- [ ] Click "New Request"
- [ ] Select customer
- [ ] Enter title and description
- [ ] Select category
- [ ] Select status
- [ ] Assign to staff member (optional)
- [ ] Save request
- [ ] Verify request appears in list

### 8.3 Edit Request
- [ ] Click edit on request
- [ ] Modify fields
- [ ] Change status
- [ ] Save changes
- [ ] Verify changes reflected

### 8.4 Request Detail Page
- [ ] Request info displays correctly
- [ ] Status history shows (if applicable)

---

## 9. Reports

### 9.1 Time Reports
- [ ] Navigate to Time Reports page
- [ ] Default report loads
- [ ] Filter by date range works
- [ ] Filter by customer works
- [ ] Filter by contract works
- [ ] Filter by staff member works
- [ ] Hours totals calculate correctly
- [ ] Export to CSV works (if available)

---

## 10. Settings

### 10.1 General Settings
- [ ] Navigate to Settings > General
- [ ] View system settings
- [ ] Toggle demo data visibility
- [ ] Save changes

### 10.2 Reference Data
- [ ] Navigate to Settings > Reference Data
- [ ] View reference values (statuses, categories, levels)
- [ ] Add new reference value
- [ ] Edit existing reference value
- [ ] Deactivate reference value

### 10.3 Staff Users
- [ ] Navigate to Settings > Staff Users
- [ ] View list of admin/staff users
- [ ] All staff users display correctly
- [ ] Click "Invite User"
- [ ] Fill in invitation form
- [ ] Send invitation (verify email received)
- [ ] Change user role (admin ↔ staff)
- [ ] Toggle user active status

### 10.4 Customer Users
- [ ] Navigate to Settings > Customer Users
- [ ] View list of customer portal users
- [ ] Customer association displays correctly

### 10.5 Portal Branding
- [ ] Navigate to Settings > Portal Branding
- [ ] View current branding settings
- [ ] Update organization name
- [ ] Upload logo
- [ ] Save changes
- [ ] Verify branding appears in portal

### 10.6 Audit Log
- [ ] Navigate to Settings > Audit Log
- [ ] Audit entries display
- [ ] Filter by table works
- [ ] Filter by action works
- [ ] Filter by user works
- [ ] Filter by date range works
- [ ] View audit entry details

---

## 11. Error Handling

### 11.1 Error States
- [ ] Navigate to non-existent page (404)
- [ ] Verify 404 page displays
- [ ] Test with invalid customer ID in URL
- [ ] Verify error boundary catches errors
- [ ] "Try again" button works on error pages

### 11.2 Loading States
- [ ] Verify loading skeletons appear during data fetch
- [ ] No flash of unstyled content

### 11.3 Empty States
- [ ] View page with no data (e.g., new customer with no contracts)
- [ ] Verify empty state message displays
- [ ] "Create" action in empty state works

---

## 12. Responsive Design

### 12.1 Desktop (1920px+)
- [ ] Layout displays correctly
- [ ] Sidebar fully visible
- [ ] Tables display all columns

### 12.2 Laptop (1024px-1919px)
- [ ] Layout adjusts appropriately
- [ ] No horizontal scrolling
- [ ] Tables remain usable

### 12.3 Tablet (768px-1023px)
- [ ] Sidebar collapses or becomes hamburger menu
- [ ] Content remains readable
- [ ] Forms are usable

### 12.4 Mobile (< 768px)
- [ ] Navigation accessible via menu
- [ ] Content stacks vertically
- [ ] Buttons are tap-friendly
- [ ] Forms are usable

---

## Test Summary

| Section | Passed | Failed | Notes |
|---------|--------|--------|-------|
| Authentication | | | |
| Dashboard | | | |
| Customers | | | |
| Contacts | | | |
| Contracts | | | |
| Time Logs | | | |
| Priorities | | | |
| Requests | | | |
| Reports | | | |
| Settings | | | |
| Error Handling | | | |
| Responsive | | | |

**Overall Result:** ☐ PASS ☐ FAIL

**Critical Issues Found:**
1. 
2. 
3. 

**Minor Issues Found:**
1. 
2. 
3. 

**Tester Signature:** ___________________ **Date:** ___________
