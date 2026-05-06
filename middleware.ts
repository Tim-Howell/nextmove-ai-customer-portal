import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Define auth routes (public when not authenticated)
  const authRoutes = ["/login", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Define public routes that don't require authentication
  const publicRoutes = ["/", ...authRoutes];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth routes
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check if user's customer is archived or contact portal access is disabled
  if (user && !isPublicRoute) {
    // Get user's profile to check role and customer_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, customer_id")
      .eq("id", user.id)
      .single();

    // Only check for customer_user role (staff/admin don't have customer restrictions)
    if (profile?.role === "customer_user" && profile?.customer_id) {
      // Check if customer is archived
      const { data: customer } = await supabase
        .from("customers")
        .select("archived_at, status, is_demo")
        .eq("id", profile.customer_id)
        .single();

      if (customer?.archived_at || customer?.status === "archived") {
        // Customer is archived - redirect to login with error
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "customer_archived");
        return NextResponse.redirect(url);
      }

      // Defensive: if RLS or a stale FK returns no customer row, we'd
      // silently skip the demo block below. Surface that case in logs so
      // we can spot it in Vercel rather than treat it as "not demo".
      if (!customer) {
        console.warn(
          `[middleware] customer fetch returned null for customer_user uid=${user.id} customer_id=${profile.customer_id} — demo block skipped`
        );
      }

      // Check if demo user is trying to access when show_demo_data is off.
      // The is_demo flag is set on the customer row by the seed scripts;
      // if it's somehow false on a customer we still consider "demo" by
      // name, that's a data-drift issue surfaced via logs above.
      if (customer?.is_demo) {
        const { data: settings } = await supabase
          .from("system_settings")
          .select("value")
          .eq("key", "show_demo_data")
          .single();

        // Tolerate every shape the value may have ended up as in JSONB:
        //   - native boolean true/false  (set via setSystemSetting)
        //   - JSONB string "true"/"false" (the original seed used 'false'::jsonb,
        //     which Supabase JS surfaces as a JS string)
        // Anything that is not unambiguously "true" is treated as disabled
        // so demo accounts fail closed.
        const raw = settings?.value;
        const showDemoData = raw === true || raw === "true";

        if (!showDemoData) {
          console.info(
            `[middleware] blocking demo login uid=${user.id} customer=${profile.customer_id} settings.value=${JSON.stringify(raw)}`
          );
          // Demo data is disabled - block demo user login
          await supabase.auth.signOut();
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("error", "demo_disabled");
          return NextResponse.redirect(url);
        }
      }

      // Check if contact has portal access disabled
      const { data: contact } = await supabase
        .from("customer_contacts")
        .select("portal_access_enabled, is_archived")
        .eq("user_id", user.id)
        .single();

      if (contact && (!contact.portal_access_enabled || contact.is_archived)) {
        // Portal access disabled - redirect to login with error
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "access_disabled");
        return NextResponse.redirect(url);
      }

      // Define admin-only routes that customer users cannot access
      const adminOnlyRoutes = [
        "/customers",
        "/settings/users",
        "/settings/general",
        "/settings/reference",
        "/settings/audit",
      ];
      const isAdminOnlyRoute = adminOnlyRoutes.some(
        (route) => pathname.startsWith(route)
      );

      if (isAdminOnlyRoute) {
        // Customer user trying to access admin route - redirect to dashboard with error
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.searchParams.set("error", "access_denied");
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect root to dashboard if authenticated, login if not
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
