# Pre-Public Repository Checklist

Before making this repository public, complete the following cleanup tasks to remove sensitive information and ensure the codebase is ready for public viewing.

## Recommended Approach: Fresh Repository

The cleanest way to go public is to create a new repository with a fresh history:

1. Complete all cleanup tasks below in this private repo
2. Create a new public repository with the desired name (e.g., `customer-portal`, `client-portal-nextjs`)
3. Clone this repo locally, remove `.git` folder
4. Initialize fresh git, commit all files as initial commit
5. Push to new public repository

```bash
# After cleanup is complete:
cd /path/to/cleaned-project
rm -rf .git
git init
git add -A
git commit -m "Initial commit - Customer Portal built with Next.js 15 and Supabase"
git remote add origin https://github.com/YOUR_ORG/new-repo-name.git
git push -u origin main
```

This approach:
- ✅ Removes all git history (no risk of leaked secrets)
- ✅ Allows renaming the repository
- ✅ Clean single-commit starting point
- ✅ Keeps private repo intact for reference

---

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

### Git History
- [ ] Using fresh repository approach (recommended) - no action needed
- [ ] Or if keeping history: Use BFG Repo-Cleaner to remove sensitive commits

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
