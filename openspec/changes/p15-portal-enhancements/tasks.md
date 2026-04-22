## 1. Navigation & UI Cleanup

- [x] 1.1 Remove Time Logs from customer sidebar navigation
- [x] 1.2 Rename "Reports" to "Time Reports" in sidebar
- [x] 1.3 Update any breadcrumbs/links referencing "Reports"

## 2. Enhanced Reporting

- [x] 2.1 Convert category filter to multi-select
- [x] 2.2 Add contract filter (multi-select)
- [x] 2.3 Add billable filter (Yes/No dropdown)
- [x] 2.4 Add staff representative filter (multi-select)
- [x] 2.5 Update report query to handle new filters

## 3. Time Entry Improvements

- [x] 3.1 Create migration for default "On-Demand / Off Contract" contract per customer
- [x] 3.2 Add seed script to create default contracts for existing customers
- [x] 3.3 Update contract creation to auto-create default contract
- [x] 3.4 Make contract required in time entry form validation
- [x] 3.5 Add "entered_for" field to time_entries table (staff_id reference)
- [x] 3.6 Update time entry form to allow staff selection (staff only)
- [x] 3.7 Update time entry display to show who entered vs who performed

## 4. Internal Notes

- [x] 4.1 Add internal_notes column to customers table
- [x] 4.2 Add internal_notes column to priorities table
- [x] 4.3 Add internal_notes column to time_entries table
- [x] 4.4 Update customer form with internal notes field
- [x] 4.5 Update priority form with internal notes field
- [x] 4.6 Update time entry form with internal notes field
- [x] 4.7 Hide internal notes from customer users (RLS/UI)

## 5. User & Profile Management

- [x] 5.1 Add first_name, last_name, title columns to profiles
- [x] 5.2 Update profile form to include new fields
- [x] 5.3 Create user management page in settings (admin/staff)
- [x] 5.4 List all users with edit capability
- [x] 5.5 Allow editing customer user profiles
- [x] 5.6 Update full_name to derive from first_name + last_name

## 6. Portal Branding

- [x] 6.1 Create portal_settings table (org name, website, logo_url, description)
- [x] 6.2 Create portal settings page (admin only)
- [x] 6.3 Upload logo to Supabase storage
- [x] 6.4 Display portal branding in header/footer as appropriate

## 7. Visual Enhancements (Images)

- [x] 7.1 Add logo_url column to customers table
- [x] 7.2 Add image_url column to priorities table
- [x] 7.3 Create image upload component (square crop)
- [x] 7.4 Update customer form with logo upload
- [x] 7.5 Update priority form with image upload
- [x] 7.6 Display images in list views and detail pages

## 8. Customer Dashboard Redesign

- [x] 8.1 Design new customer dashboard layout
- [x] 8.2 Create customer info card (logo, company details)
- [x] 8.3 Create NextMove AI contacts section
- [x] 8.4 Create active priorities section
- [x] 8.5 Create active contracts section
- [x] 8.6 Keep summary stats (hours, requests count, etc.)
- [x] 8.7 Remove individual time logs list from customer view
- [x] 8.8 Update dashboard to use new design dashboard component

## 9. Final Verification

- [ ] 9.1 Test all features as admin
- [ ] 9.2 Test all features as staff
- [ ] 9.3 Test all features as customer_user
- [ ] 9.4 Verify internal notes hidden from customers
- [ ] 9.5 Update project.md with Phase 15 completion
- [ ] 9.6 Commit all changes
