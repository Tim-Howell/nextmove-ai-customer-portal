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

      // Check if demo user is trying to access when show_demo_data is off
      if (customer?.is_demo) {
        const { data: settings } = await supabase
          .from("system_settings")
          .select("value")
          .eq("key", "show_demo_data")
          .single();

        // Value is stored as JSONB boolean, not string
        const showDemoData = settings?.value === true;
        if (!showDemoData) {
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
