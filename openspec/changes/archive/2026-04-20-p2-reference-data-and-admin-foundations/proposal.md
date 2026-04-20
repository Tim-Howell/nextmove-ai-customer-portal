## Why

The portal needs reference data (dropdown values, categories) and admin tools before building out contracts, time logging, and other features. Internal users also need the ability to manage staff accounts and assign roles. Magic Links will improve the login experience.

## What Changes

- Create reference tables for contract types, contract statuses, time categories, priority statuses, priority levels, and request statuses
- Seed default values for all reference tables
- Build admin UI for managing reference data (CRUD for dropdown values)
- Build internal user management screens (list, invite, edit roles)
- Implement role assignment flows for admin users
- Add `is_demo` flag to relevant tables for demo data visibility toggle
- Build admin settings page with demo data toggle
- Implement Magic Links as default login with email/password fallback option

## Capabilities

### New Capabilities
- `reference-data`: CRUD operations for system reference values (contract types, statuses, categories)
- `user-management`: Admin screens for managing internal users and role assignments
- `admin-settings`: System settings including demo data visibility toggle
- `magic-link-auth`: Magic Link login flow as primary authentication method

### Modified Capabilities
- `auth-flow`: Add Magic Link as default login option with email/password fallback

## Impact

- **Database**: New reference tables, `is_demo` column on customers/contacts/future tables
- **Navigation**: Add "Settings" and "Users" sections to admin sidebar
- **Routes**: New `/settings`, `/settings/reference-data`, `/settings/users` routes
- **Auth**: Login page updated to prioritize Magic Links
