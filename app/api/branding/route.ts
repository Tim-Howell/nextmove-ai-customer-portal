import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portal_settings")
    .select("organization_name, logo_url")
    .single();

  if (error) {
    // Return defaults if no settings found
    return NextResponse.json({
      organization_name: "NextMove AI",
      logo_url: null,
    });
  }

  return NextResponse.json({
    organization_name: data.organization_name || "NextMove AI",
    logo_url: data.logo_url,
  });
}
