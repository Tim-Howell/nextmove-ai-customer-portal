## 1. Database Setup - Priorities

- [x] 1.1 Create `priorities` table migration with customer_id, title, description, status_id, priority_level_id, due_date, created_by, updated_by, timestamps
- [x] 1.2 Create indexes on priorities (customer_id, status_id, priority_level_id)
- [x] 1.3 Create RLS policies for priorities (internal full access, customer read + optional insert)
- [x] 1.4 Run migrations and verify

## 2. Database Setup - Requests

- [x] 2.1 Create `requests` table migration with customer_id, submitted_by, title, description, status_id, internal_notes, timestamps
- [x] 2.2 Create indexes on requests (customer_id, status_id, submitted_by)
- [x] 2.3 Create RLS policies for requests (internal full access, customer read + insert for their customer)
- [x] 2.4 Run migrations and verify

## 3. Types and Validation - Priorities

- [x] 3.1 Create TypeScript types for Priority, PriorityWithRelations
- [x] 3.2 Create Zod schema for priority validation
- [x] 3.3 Add priority status and level constants

## 4. Types and Validation - Requests

- [x] 4.1 Create TypeScript types for Request, RequestWithRelations
- [x] 4.2 Create Zod schema for request validation
- [x] 4.3 Add request status constants

## 5. Server Actions - Priorities

- [x] 5.1 Create getPriorities action with filters (customer, status, priority level)
- [x] 5.2 Create getPriority action for single priority
- [x] 5.3 Create createPriority action with validation
- [x] 5.4 Create updatePriority action
- [x] 5.5 Create deletePriority action
- [x] 5.6 Create getOpenPrioritiesCount action for dashboard

## 6. Server Actions - Requests

- [x] 6.1 Create getRequests action with filters (customer, status)
- [x] 6.2 Create getRequest action for single request (exclude internal_notes for customers)
- [x] 6.3 Create createRequest action with validation
- [x] 6.4 Create updateRequest action (internal only)
- [x] 6.5 Create deleteRequest action (internal only)
- [x] 6.6 Create getOpenRequestsCount action for dashboard

## 7. Priority UI - List and Detail

- [x] 7.1 Create `/priorities` page with priority list
- [x] 7.2 Add customer, status, and priority level filter dropdowns
- [x] 7.3 Create `/priorities/[id]` detail page
- [x] 7.4 Display priority info with status badge and priority level indicator
- [x] 7.5 Show edit/delete buttons for internal users only

## 8. Priority UI - Forms

- [x] 8.1 Create PriorityForm component with all fields
- [x] 8.2 Add status dropdown from reference_values
- [x] 8.3 Add priority level dropdown from reference_values
- [x] 8.4 Add optional due date picker
- [x] 8.5 Create `/priorities/new` page
- [x] 8.6 Create `/priorities/[id]/edit` page
- [x] 8.7 Add delete priority button for internal users

## 9. Request UI - List and Detail

- [x] 9.1 Create `/requests` page with request list
- [x] 9.2 Add customer and status filter dropdowns (customer filter for internal only)
- [x] 9.3 Create `/requests/[id]` detail page
- [x] 9.4 Display request info with status badge
- [x] 9.5 Show internal notes section for internal users only
- [x] 9.6 Show edit/delete buttons for internal users only

## 10. Request UI - Forms

- [x] 10.1 Create RequestForm component (customer version: title, description only)
- [x] 10.2 Create internal RequestForm with status and internal notes fields
- [x] 10.3 Create `/requests/new` page for customer submission
- [x] 10.4 Create `/requests/[id]/edit` page for internal users
- [x] 10.5 Add delete request button for internal users

## 11. Customer Views

- [x] 11.1 Update `/priorities` to show customer's priorities only for customer_user
- [x] 11.2 Hide create/edit/delete actions on priorities for customer_user (or allow create if enabled)
- [x] 11.3 Update `/requests` to show customer's requests only for customer_user
- [x] 11.4 Allow customer_user to access `/requests/new` for submission
- [x] 11.5 Hide edit/delete actions on requests for customer_user

## 12. Dashboard Updates

- [x] 12.1 Update customer dashboard with open priorities count widget
- [x] 12.2 Update customer dashboard with open requests count widget
- [x] 12.3 Add links from dashboard widgets to list pages
- [x] 12.4 Update internal dashboard with aggregate priority and request counts

## 13. Final Verification

- [x] 13.1 Test priority CRUD operations
- [x] 13.2 Test request CRUD operations
- [x] 13.3 Test customer read-only access to priorities
- [x] 13.4 Test customer request submission
- [x] 13.5 Test internal notes visibility (hidden from customers)
- [x] 13.6 Test filters on list pages
- [x] 13.7 Test dashboard widgets
- [x] 13.8 Update project.md Phase 7 and 8 tasks as complete
- [x] 13.9 Commit all changes
