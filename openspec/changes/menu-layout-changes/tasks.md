## 1. Sidebar Navigation Restructure

- [ ] 1.1 Create NavCategory component for grouped navigation sections
- [ ] 1.2 Create NavSubItem component for indented sub-items
- [ ] 1.3 Update sidebar-nav.tsx with new grouped structure for staff/admin
- [ ] 1.4 Update sidebar-nav.tsx with new grouped structure for customers
- [ ] 1.5 Add visual separators between navigation groups
- [ ] 1.6 Style sub-items with left indentation

## 2. Quick Action Buttons

- [ ] 2.1 Add "Enter Time" primary button at top of staff/admin sidebar
- [ ] 2.2 Add "Submit Request" primary button at bottom of customer sidebar
- [ ] 2.3 Move "Settings" to bottom of admin sidebar as ghost button
- [ ] 2.4 Style buttons distinctly from navigation links

## 3. User Menu Dropdown

- [ ] 3.1 Create UserMenu component with dropdown using shadcn/ui DropdownMenu
- [ ] 3.2 Display user name/avatar as trigger
- [ ] 3.3 Add "My Profile" menu item linking to /profile
- [ ] 3.4 Add "Log Off" menu item that triggers logout action
- [ ] 3.5 Integrate UserMenu into header component (top-right)

## 4. Profile Page

- [ ] 4.1 Create /profile page for user profile viewing/editing
- [ ] 4.2 Display user's name, email, role
- [ ] 4.3 Allow user to update their display name
- [ ] 4.4 Add change password functionality (link to reset)

## 5. Customer Info Landing Page

- [ ] 5.1 Create /customer-info page
- [ ] 5.2 Create LandingCard component with icon, title, description
- [ ] 5.3 Add page title and description
- [ ] 5.4 Display cards for staff/admin: All Contracts, All Contacts, All Priorities, All Requests
- [ ] 5.5 Display cards for customers: My Contracts, My Priorities, My Requests
- [ ] 5.6 Use icons: FileText (Contracts), Users (Contacts), Flag (Priorities), MessageSquare (Requests)
- [ ] 5.7 Make cards clickable to navigate to respective pages

## 6. Reports Landing Page

- [ ] 6.1 Create /reports landing page (rename or redirect existing time reports)
- [ ] 6.2 Add page title and description
- [ ] 6.3 Display cards for staff/admin: Time Reports, Change Log
- [ ] 6.4 Display cards for customers: Time Report
- [ ] 6.5 Use icons: BarChart3 (Time Reports), History (Change Log)
- [ ] 6.6 Make cards clickable to navigate to respective pages

## 7. Change Log Page

- [ ] 7.1 Create /reports/changes page for audit log viewing
- [ ] 7.2 Display audit_logs table data with filters
- [ ] 7.3 Show entity type, action, user, timestamp
- [ ] 7.4 Add pagination for large datasets
- [ ] 7.5 Restrict access to admin/staff only

## 8. Customer Dashboard Enhancements

- [ ] 8.1 Add "This Month's Time" summary card showing hours logged
- [ ] 8.2 Add "Active Items" section with counts for contracts, priorities, requests
- [ ] 8.3 Add "NextMove AI Contacts" section showing assigned primary/secondary contacts
- [ ] 8.4 Fetch customer's contact assignments from customer record

## 9. Navigation Path Updates

- [ ] 9.1 Ensure /contracts, /contacts, /priorities, /requests work for both roles
- [ ] 9.2 Update any hardcoded navigation paths
- [ ] 9.3 Add active state highlighting for current page and parent category

## 10. Testing

- [ ] 10.1 Test staff/admin navigation structure and all links
- [ ] 10.2 Test customer navigation structure and all links
- [ ] 10.3 Test user menu dropdown functionality
- [ ] 10.4 Test landing pages display correct cards per role
- [ ] 10.5 Test customer dashboard enhancements
- [ ] 10.6 Test mobile navigation behavior
