## 1. Initialize Next.js Project

- [ ] 1.1 Run `pnpm create next-app` with TypeScript, App Router, Tailwind CSS, and ESLint options
- [ ] 1.2 Verify development server starts with `pnpm dev`
- [ ] 1.3 Remove boilerplate content from `app/page.tsx` and `app/globals.css`

## 2. Configure Tailwind CSS with Brand Tokens

- [ ] 2.1 Add Montserrat font via `next/font/google`
- [ ] 2.2 Define CSS variables for brand colors in `globals.css` (Primary Navy, NextMove Green, backgrounds, secondary text)
- [ ] 2.3 Extend Tailwind config to use CSS variables for colors
- [ ] 2.4 Add dark mode color variables for future support

## 3. Install and Configure shadcn/ui

- [ ] 3.1 Run `pnpm dlx shadcn@latest init` with New York style and CSS variables
- [ ] 3.2 Install base components: Button, Card, Input, Label, Dialog, DropdownMenu, Table
- [ ] 3.3 Verify Button component renders with brand styling

## 4. Configure Code Quality Tooling

- [ ] 4.1 Update `tsconfig.json` with strict mode, `noUncheckedIndexedAccess`, and `noImplicitReturns`
- [ ] 4.2 Install and configure Prettier with consistent settings
- [ ] 4.3 Add `format` and `format:check` scripts to `package.json`
- [ ] 4.4 Verify `pnpm lint` and `pnpm format` work correctly

## 5. Create Project Folder Structure

- [ ] 5.1 Create `features/` directory with placeholder README
- [ ] 5.2 Create `lib/` directory with placeholder README
- [ ] 5.3 Create `types/` directory with placeholder README
- [ ] 5.4 Create `supabase/` directory with placeholder README

## 6. Set Up Environment Configuration

- [ ] 6.1 Create `.env.example` with Supabase variable placeholders
- [ ] 6.2 Verify `.env.local` is in `.gitignore`
- [ ] 6.3 Create Supabase client helper in `lib/supabase/client.ts`
- [ ] 6.4 Create Supabase server helper in `lib/supabase/server.ts`
- [ ] 6.5 Install `@supabase/supabase-js` and `@supabase/ssr` packages

## 7. Configure Vercel Deployment

- [ ] 7.1 Create `vercel.json` with build settings
- [ ] 7.2 Create `README.md` with local setup and deployment instructions
- [ ] 7.3 Verify project builds successfully with `pnpm build`

## 8. Final Verification

- [ ] 8.1 Run `pnpm dev` and confirm app loads at localhost:3000
- [ ] 8.2 Run `pnpm build` and confirm no TypeScript errors
- [ ] 8.3 Run `pnpm lint` and confirm no linting errors
- [ ] 8.4 Commit all changes with message "feat: complete Phase 0 project setup"
