# Supabase

Database migrations, seeds, and configuration.

## Structure

- `migrations/` - SQL migration files
- `seed.sql` - Seed data for development
- `config.toml` - Supabase CLI configuration

## Commands

```bash
# Link to remote project
supabase link --project-ref <project-id>

# Generate types from database
supabase gen types typescript --linked > types/database.ts

# Run migrations locally
supabase db reset
```
