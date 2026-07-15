# Backlog: Private Customer Images (portal-assets hardening, phase 2)

> Status: **Deferred** — captured for future reference, not actively scheduled.
> Captured: 2026-07-14, during the July 2026 security review.

## Background

The `portal-assets` bucket is public by design (the org logo must render on
the unauthenticated login page), but it also holds **customer logos** and
**priority images** — content that should really be customer-scoped.

The July 2026 hardening pass already closed the worst gaps:
- Bucket writes are internal (admin/staff) only
  (`20260715090000_tighten_rls_and_storage.sql`)
- Anonymous/authenticated file *listing* is blocked, so filenames cannot be
  enumerated (`20260715092000_portal_assets_block_listing.sql`)

**Remaining accepted risk:** any file in the bucket is still downloadable by
anyone who has (or leaks) its URL — no auth, no expiry, no revocation.
Priority images are the highest-risk content since they're uploaded via the
rich-text editor and could contain screenshots with sensitive data.

## Goal

Move customer-scoped images out of the public bucket so they require an
authenticated, customer-scoped session to view. Only true org-level branding
assets (login-page logo) remain public.

## Approach (recommended: authenticated image proxy)

Serve private images through a Next.js route handler instead of signed URLs,
because priority-image URLs are embedded in stored rich-text content and
signed URLs expire (would require constant rewriting).

### 1. Storage layout
- Keep `portal-assets` (public): org logo / branding assets only.
- Move to `portal-documents` (private), or a new private `customer-images`
  bucket:
  - Customer logos → e.g. `customers/{customerId}/logo/{file}`
  - Priority images → e.g. `customers/{customerId}/priorities/{file}`
- Add storage RLS SELECT policies scoping reads by the `customers/{id}/...`
  path prefix (same pattern as `portal-documents: scoped read`).

### 2. Image proxy route
- New route: `app/api/images/[...path]/route.ts`
  - Checks session, resolves the caller's role/customer.
  - Internal users: any path. Customer users: only their own
    `customers/{their-customer-id}/...` paths.
  - Streams the object from the private bucket (service or user client) with
    correct `Content-Type` and long-lived private `Cache-Control`.

### 3. Upload path changes
- `app/api/upload/route.ts`: route uploads by asset type — org branding to
  `portal-assets`, customer logos and priority images to the private bucket
  under the customer's path prefix; return `/api/images/...` URLs instead of
  public storage URLs.
- Customer logo upload in the customer form takes the same path.

### 4. Data migration
- Copy existing customer logos + priority images from `portal-assets` to the
  private bucket (script or SQL over `storage.objects` + storage API; SQL
  DELETE on storage tables is blocked, so removal of the old public copies
  is a manual/dashboard or storage-API step).
- Rewrite stored references:
  - `customers.logo_url` → `/api/images/...`
  - Image URLs embedded in priority descriptions (rich text) → string
    replace of the public URL prefix with `/api/images/...`
- Verify, then delete the old public copies.

### 5. Rendering
- Components already render plain `<img>`/URLs, so no changes should be
  needed beyond the URLs themselves pointing at the proxy. Confirm the
  login page never needs a customer image (it must not — it only shows the
  org logo, which stays public).

## Acceptance criteria

- [ ] Unauthenticated request for a customer logo / priority image URL → 401/404
- [ ] Customer A cannot fetch Customer B's images via the proxy
- [ ] Internal users can view all images
- [ ] Existing priorities render their embedded images correctly post-migration
- [ ] Customer logos render on customer detail/dashboard post-migration
- [ ] Login page org logo still renders without a session
- [ ] `portal-assets` contains only org branding assets

## Estimate

Roughly a day: proxy route + upload routing are straightforward; the data
migration and embedded-URL rewrite are where care is needed.

## Related

- `openspec/project.md` §13 Future Enhancements (security review entry)
- `supabase/migrations/20260715090000_tighten_rls_and_storage.sql`
- `supabase/migrations/20260715092000_portal_assets_block_listing.sql`
