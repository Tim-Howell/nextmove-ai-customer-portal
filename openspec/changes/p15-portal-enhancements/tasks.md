## 1. Navigation & UI Cleanup

- [ ] 1.1 Remove Time Logs from customer sidebar navigation
- [ ] 1.2 Rename "Reports" to "Time Reports" in sidebar
- [ ] 1.3 Update any breadcrumbs/links referencing "Reports"

## 2. Enhanced Reporting

- [ ] 2.1 Convert category filter to multi-select
- [ ] 2.2 Add contract filter (multi-select)
- [ ] 2.3 Add billable filter (Yes/No dropdown)
- [ ] 2.4 Add staff representative filter (multi-select)
- [ ] 2.5 Update report query to handle new filters

## 3. Time Entry Improvements

- [ ] 3.1 Create migration for default "On-Demand / Off Contract" contract per customer
- [ ] 3.2 Add seed script to create default contracts for existing customers
- [ ] 3.3 Update contract creation to auto-create default contract
- [ ] 3.4 Make contract required in time entry form validation
- [ ] 3.5 Add "entered_for" field to time_entries table (staff_id reference)
- [ ] 3.6 Update time entry form to allow staff selection (staff only)
- [ ] 3.7 Update time entry display to show who entered vs who performed

## 4. Internal Notes

- [ ] 4.1 Add internal_notes column to customers table
- [ ] 4.2 Add internal_notes column to priorities table
- [ ] 4.3 Add internal_notes column to time_entries table
- [ ] 4.4 Update customer form with internal notes field
- [ ] 4.5 Update priority form with internal notes field
- [ ] 4.6 Update time entry form with internal notes field
- [ ] 4.7 Hide internal notes from customer users (RLS/UI)

## 5. User & Profile Management

- [ ] 5.1 Add first_name, last_name, title columns to profiles
- [ ] 5.2 Update profile form to include new fields
- [ ] 5.3 Create user management page in settings (admin/staff)
- [ ] 5.4 List all users with edit capability
- [ ] 5.5 Allow editing customer user profiles
- [ ] 5.6 Update full_name to derive from first_name + last_name

## 6. Portal Branding

- [ ] 6.1 Create portal_settings table (org name, website, logo_url, description)
- [ ] 6.2 Create portal settings page (admin only)
- [ ] 6.3 Upload logo to Supabase storage
- [ ] 6.4 Display portal branding in header/footer as appropriate

## 7. Visual Enhancements (Images)

- [ ] 7.1 Add logo_url column to customers table
- [ ] 7.2 Add image_url column to priorities table
- [ ] 7.3 Create image upload component (square crop)
- [ ] 7.4 Update customer form with logo upload
- [ ] 7.5 Update priority form with image upload
- [ ] 7.6 Display images in list views and detail pages

## 8. Customer Dashboard Redesign

- [ ] 8.1 Design new customer dashboard layout
- [ ] 8.2 Create customer info card (logo, company details)
- [ ] 8.3 Create NextMove AI contacts section
- [ ] 8.4 Create active priorities section
- [ ] 8.5 Create active contracts section
- [ ] 8.6 Keep summary stats (hours, requests count, etc.)
- [ ] 8.7 Remove individual time logs list from customer view
- [ ] 8.8 Replace current CustomerDashboard component

## 9. Final Verification

- [ ] 9.1 Test all features as admin
- [ ] 9.2 Test all features as staff
- [ ] 9.3 Test all features as customer_user
- [ ] 9.4 Verify internal notes hidden from customers
- [ ] 9.5 Update project.md with Phase 15 completion
- [ ] 9.6 Commit all changes
