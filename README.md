# NextMove AI Customer Portal

A secure web application for NextMove AI staff and customer staff to manage customer information, contracts, time logs, priorities, requests, and reporting.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tim-Howell/nextmove-ai-customer-portal.git
   cd nextmove-ai-customer-portal
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Supabase credentials to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

5. Set up Supabase Storage buckets (see [Storage Buckets](#storage-buckets) below)

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Project Structure

```
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── features/        # Domain-specific modules
├── lib/             # Shared utilities and clients
│   └── supabase/    # Supabase client helpers
├── types/           # TypeScript type definitions
├── supabase/        # Database migrations and config
└── public/          # Static assets
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy

Preview deployments are automatically created for pull requests.

## Storage Buckets

This application requires two Supabase Storage buckets:

### `portal-assets` (Public)
Used for publicly accessible branding assets:
- Organization logo
- Customer logos
- Priority images

**Setup:**
1. Create bucket named `portal-assets` in Supabase Storage
2. Set bucket to **Public**
3. Run the following SQL to add policies:
   ```sql
   -- Allow authenticated users to upload
   create policy "Allow authenticated uploads to portal-assets"
   on storage.objects for insert
   to authenticated
   with check (bucket_id = 'portal-assets');

   -- Allow public read access
   create policy "Allow public read access to portal-assets"
   on storage.objects for select
   to public
   using (bucket_id = 'portal-assets');
   ```

### `portal-documents` (Private)
Used for secure documents with access control:
- Contract PDFs
- Request attachments

**Setup:**
1. Create bucket named `portal-documents` in Supabase Storage
2. Keep bucket **Private**
3. RLS policies control access based on user role and customer association
