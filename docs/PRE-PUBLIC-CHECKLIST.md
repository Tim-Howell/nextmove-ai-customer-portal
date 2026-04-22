# Pre-Public Repository Checklist

Before making this repository public, complete the following cleanup tasks to remove sensitive information and ensure the codebase is ready for public viewing.

## 🔴 Critical - Must Complete

### Sensitive Data Removal
- [ ] Remove real email addresses from `scripts/create-staff-accounts.ts`
  - Replace with generic examples like `admin@example.com`
- [ ] Remove real names from `scripts/create-staff-accounts.ts`
  - Replace with generic names like "Jane Doe", "John Smith"
- [ ] Update demo account passwords in `scripts/create-demo-accounts.ts`
  - Change `DemoPass123!` to a placeholder like `CHANGE_ME_BEFORE_USE`
- [ ] Review `scripts/fix-demo-profiles.ts` for any sensitive data
- [ ] Search entire codebase for `@nextmoveaiservices.com` and remove/replace
- [ ] Search for any hardcoded API keys or secrets (should be none, but verify)

### Git History Review
- [ ] Consider if git history needs to be cleaned (if sensitive data was ever committed)
  - Option: Use `git filter-branch` or BFG Repo-Cleaner
  - Option: Start fresh with a squashed history

### Documentation Updates
- [ ] Update README.md to be generic (remove company-specific references)
- [ ] Add LICENSE file (choose appropriate open source license)
- [ ] Add CONTRIBUTING.md with contribution guidelines
- [ ] Update AGENTS.md to remove internal context

## 🟡 Recommended

### Code Quality
- [ ] Remove any TODO comments with internal context
- [ ] Review comments for any sensitive information
- [ ] Ensure all console.log statements are appropriate for public viewing

### Configuration
- [ ] Verify `.env.example` exists with all required variables (no real values)
- [ ] Ensure `.gitignore` covers all sensitive files
- [ ] Remove any internal documentation from `openspec/` if not intended to be public

### Demo Data
- [ ] Make demo data generic (company names, contact info)
- [ ] Update `scripts/seed-demo-data.ts` with fictional company names

## 🟢 Nice to Have

### Polish
- [ ] Add screenshots to README
- [ ] Create a demo video or GIF
- [ ] Add badges (build status, license, etc.)
- [ ] Set up GitHub repository settings (description, topics, website)

## Commands to Search for Sensitive Data

```bash
# Search for email domains
grep -r "nextmoveaiservices.com" --include="*.ts" --include="*.tsx" --include="*.md"
grep -r "nextmove" --include="*.ts" --include="*.tsx"

# Search for potential passwords
grep -r "Pass" --include="*.ts" --include="*.tsx"
grep -r "password" --include="*.ts" --include="*.tsx"

# Search for potential API keys
grep -r "sk_" --include="*.ts" --include="*.tsx"
grep -r "pk_" --include="*.ts" --include="*.tsx"
```

## After Making Public

- [ ] Enable GitHub security features (Dependabot, secret scanning)
- [ ] Set up branch protection rules
- [ ] Add issue templates
- [ ] Add pull request template

---

**Last Updated:** April 2026
**Status:** Not yet public
