-- Seed script for initial admin user
-- Note: This script assumes you've already created an admin user via Supabase Auth
-- The profile will be auto-created by the trigger, then we update the role to admin

-- To create the initial admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create a user with email/password
-- 3. Run this script to promote them to admin

-- Example: Update a specific user to admin role
-- Replace 'admin@nextmove-ai.com' with your actual admin email
-- update public.profiles
-- set role = 'admin', full_name = 'Admin User'
-- where email = 'admin@nextmove-ai.com';

-- For development, you can also insert test data here
-- This will be expanded as more tables are added
