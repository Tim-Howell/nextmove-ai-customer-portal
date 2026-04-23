import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function handleCustomerUserSetup(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | undefined,
  metadata: Record<string, unknown>
) {
  if (metadata?.contact_id && metadata?.customer_id && metadata?.role === "customer_user") {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id: userId,
        email: email,
        role: "customer_user",
        customer_id: metadata.customer_id as string,
      });
    }

    await supabase
      .from("customer_contacts")
      .update({ user_id: userId })
      .eq("id", metadata.contact_id as string);

    await supabase
      .from("customer_invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("contact_id", metadata.contact_id as string)
      .is("accepted_at", null);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Code exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error&error_code=${error.code || 'unknown'}&error_description=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
      await handleCustomerUserSetup(
        supabase,
        data.user.id,
        data.user.email,
        data.user.user_metadata
      );
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "magiclink" | "email" | "signup" | "invite" | "recovery",
    });

    if (error) {
      console.error("OTP verification error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error&error_code=${error.code || 'unknown'}&error_description=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
      await handleCustomerUserSetup(
        supabase,
        data.user.id,
        data.user.email,
        data.user.user_metadata
      );
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error&error_description=No+code+or+token+provided`);
}
