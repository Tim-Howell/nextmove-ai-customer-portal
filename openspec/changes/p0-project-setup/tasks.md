## 1. Initialize Next.js Project

- [x] 1.1 Run `pnpm create next-app` with TypeScript, App Router, Tailwind CSS, and ESLint options
- [x] 1.2 Verify development server starts with `pnpm dev`
- [x] 1.3 Remove boilerplate content from `app/page.tsx` and `app/globals.css`

## 2. Configure Tailwind CSS with Brand Tokens

- [x] 2.1 Add Montserrat font via `next/font/google`
- [x] 2.2 Define CSS variables for brand colors in `globals.css` (Primary Navy, NextMove Green, backgrounds, secondary text)
- [x] 2.3 Extend Tailwind config to use CSS variables for colors
- [x] 2.4 Add dark mode color variables for future support

## 3. Install and Configure shadcn/ui

- [x] 3.1 Run `pnpm dlx shadcn@latest init` with New York style and CSS variables
- [x] 3.2 Install base components: Button, Card, Input, Label, Dialog, DropdownMenu, Table
- [x] 3.3 Verify Button component renders with brand styling

## 4. Configure Code Quality Tooling

- [x] 4.1 Update `tsconfig.json` with strict mode, `noUncheckedIndexedAccess`, and `noImplicitReturns`
- [x] 4.2 Install and configure Prettier with consistent settings
- [x] 4.3 Add `format` and `format:check` scripts to `package.json`
- [x] 4.4 Verify `pnpm lint` and `pnpm format` work correctly

## 5. Create Project Folder Structure

- [x] 5.1 Create `features/` directory with placeholder README
- [x] 5.2 Create `lib/` directory with placeholder README
- [x] 5.3 Create `types/` directory with placeholder README
- [x] 5.4 Create `supabase/` directory with placeholder README

## 6. Set Up Environment Configuration

- [x] 6.1 Create `.env.example` with Supabase variable placeholders
- [x] 6.2 Verify `.env.local` is in `.gitignore`
- [x] 6.3 Create Supabase client helper in `lib/supabase/client.ts`
- [x] 6.4 Create Supabase server helper in `lib/supabase/server.ts`
- [x] 6.5 Install `@supabase/supabase-js` and `@supabase/ssr` packages

## 7. Configure Vercel Deployment

- [x] 7.1 Create `vercel.json` with build settings
- [x] 7.2 Create `README.md` with local setup and deployment instructions
- [x] 7.3 Verify project builds successfully with `pnpm build`

## 8. Final Verification

- [x] 8.1 Run `pnpm dev` and confirm app loads at localhost:3000
- [x] 8.2 Run `pnpm build` and confirm no TypeScript errors
- [x] 8.3 Run `pnpm lint` and confirm no linting errors
- [ ] 8.4 Commit all changes with message "feat: complete Phase 0 project setup"
