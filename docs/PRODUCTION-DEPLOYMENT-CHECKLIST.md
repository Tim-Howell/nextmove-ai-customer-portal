# Production Deployment Checklist

## Pre-Deployment

### Supabase Configuration
- [ ] Create production Supabase project (if not already done)
- [ ] Run all migrations on production database
- [ ] Configure RLS policies are enabled on all tables
- [ ] Set up database backups

### Authentication
- [ ] Configure Site URL in Supabase Auth settings
  - Production: `https://portal.nextmoveaiservices.com`
- [ ] Configure Redirect URLs
  - Add: `https://portal.nextmoveaiservices.com/**`
- [ ] Configure custom SMTP (optional but recommended)
  - Go to Authentication > SMTP Settings
  - Enter SMTP credentials (Resend, SendGrid, etc.)
- [ ] Customize email templates
  - Magic Link template
  - Invitation template
  - Password Reset template

### Vercel Configuration
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY` (if using Resend)
- [ ] Configure custom domain
  - Add `portal.nextmoveaiservices.com`
  - Configure DNS records
  - Enable HTTPS

### Data Preparation
- [ ] Disable demo data toggle in production
- [ ] Remove or archive demo customers/contracts
- [ ] Create initial admin user accounts
- [ ] Verify portal branding settings

## Deployment

### Deploy Steps
1. [ ] Push to main branch (triggers Vercel deploy)
2. [ ] Monitor build logs for errors
3. [ ] Verify deployment completes successfully

### Post-Deploy Verification
- [ ] Access production URL
- [ ] Test login with magic link
- [ ] Test login with password
- [ ] Verify dashboard loads
- [ ] Test creating a customer
- [ ] Test creating a contract
- [ ] Test time entry logging
- [ ] Verify email notifications work

## Rollback Plan

If issues are found:
1. Revert to previous deployment in Vercel dashboard
2. Or push a revert commit to main branch

## Monitoring

### Recommended Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure database monitoring in Supabase

## Security Checklist

- [ ] Verify RLS policies are working
- [ ] Confirm service role key is not exposed
- [ ] Check CORS settings in Supabase
- [ ] Review API rate limiting
- [ ] Ensure HTTPS is enforced

## Go-Live

- [ ] Announce to team
- [ ] Create first real customer accounts
- [ ] Monitor for issues in first 24 hours
- [ ] Document any issues found

---

*Last Updated: April 22, 2026*
