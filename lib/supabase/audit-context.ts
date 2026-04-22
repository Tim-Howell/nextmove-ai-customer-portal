"use server";

import { createClient } from "./server";

export async function createAuditedClient() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Set session variables for audit trigger using raw SQL
    // These are local to the current transaction/session
    try {
      await supabase.from("audit_logs").select("id").limit(0); // Ensure connection
      
      // Use a custom RPC function to set the context
      const { error } = await supabase.rpc("set_audit_context", {
        p_user_id: user.id,
        p_user_email: user.email || "",
        p_user_role: profile?.role || ""
      });
      
      if (error) {
        // Silently fail - audit will work but without user context
        console.warn("Could not set audit context:", error.message);
      }
    } catch {
      // If RPC doesn't exist, the trigger will still work but without user context
    }
  }
  
  return supabase;
}
