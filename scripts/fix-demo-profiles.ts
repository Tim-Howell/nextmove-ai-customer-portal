/**
 * Fix Demo Profiles Script
 * 
 * This script directly inserts/updates demo user profiles
 * bypassing the audit trigger issue.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Fixing demo profiles...");

  // Get demo customers
  const { data: acmeCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("name", "Acme Corporation")
    .eq("is_demo", true)
    .single();

  const { data: techStartCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("name", "TechStart Solutions")
    .eq("is_demo", true)
    .single();

  if (!acmeCustomer || !techStartCustomer) {
    console.error("Demo customers not found. Run seed-demo-data.ts first.");
    process.exit(1);
  }

  // Get auth users
  const { data: users } = await supabase.auth.admin.listUsers();
  const acmeUser = users?.users?.find((u) => u.email === "demo-acme1@example.com");
  const techStartUser = users?.users?.find((u) => u.email === "demo-techstart@example.com");

  if (!acmeUser || !techStartUser) {
    console.error("Demo auth users not found. Run create-demo-accounts.ts first.");
    process.exit(1);
  }

  // Check if profiles exist
  const { data: existingProfiles } = await supabase
    .from("profiles")
    .select("id")
    .in("id", [acmeUser.id, techStartUser.id]);

  const existingIds = existingProfiles?.map((p) => p.id) || [];

  // Insert profiles that don't exist
  const profilesToInsert = [];
  
  if (!existingIds.includes(acmeUser.id)) {
    profilesToInsert.push({
      id: acmeUser.id,
      email: "demo-acme1@example.com",
      full_name: "Demo User (Acme)",
      role: "customer_user",
      customer_id: acmeCustomer.id,
    });
  }

  if (!existingIds.includes(techStartUser.id)) {
    profilesToInsert.push({
      id: techStartUser.id,
      email: "demo-techstart@example.com",
      full_name: "Demo User (TechStart)",
      role: "customer_user",
      customer_id: techStartCustomer.id,
    });
  }

  if (profilesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert(profilesToInsert);

    if (insertError) {
      console.error("Error inserting profiles:", insertError);
    } else {
      console.log(`Inserted ${profilesToInsert.length} new profiles`);
    }
  }

  // Update existing profiles (this may fail due to trigger, but let's try)
  for (const profile of existingProfiles || []) {
    const isAcme = profile.id === acmeUser.id;
    const customerId = isAcme ? acmeCustomer.id : techStartCustomer.id;
    const email = isAcme ? "demo-acme1@example.com" : "demo-techstart@example.com";
    const fullName = isAcme ? "Demo User (Acme)" : "Demo User (TechStart)";

    // Try update - may fail due to trigger
    const { error } = await supabase
      .from("profiles")
      .update({
        email,
        full_name: fullName,
        role: "customer_user",
        customer_id: customerId,
      })
      .eq("id", profile.id);

    if (error) {
      console.log(`Could not update profile ${profile.id} (trigger issue): ${error.message}`);
    } else {
      console.log(`Updated profile ${profile.id}`);
    }
  }

  // Create customer contacts for demo users
  const contacts = [
    {
      customer_id: acmeCustomer.id,
      full_name: "Demo User (Acme)",
      email: "demo-acme1@example.com",
      user_id: acmeUser.id,
      portal_access_enabled: true,
      is_active: true,
      is_demo: true,
    },
    {
      customer_id: techStartCustomer.id,
      full_name: "Demo User (TechStart)",
      email: "demo-techstart@example.com",
      user_id: techStartUser.id,
      portal_access_enabled: true,
      is_active: true,
      is_demo: true,
    },
  ];

  for (const contact of contacts) {
    // Check if contact exists
    const { data: existing } = await supabase
      .from("customer_contacts")
      .select("id")
      .eq("email", contact.email)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("customer_contacts")
        .update({
          user_id: contact.user_id,
          portal_access_enabled: true,
          is_active: true,
        })
        .eq("id", existing.id);

      if (error) {
        console.error(`Error updating contact ${contact.email}:`, error);
      } else {
        console.log(`Updated contact: ${contact.email}`);
      }
    } else {
      const { error } = await supabase.from("customer_contacts").insert(contact);

      if (error) {
        console.error(`Error creating contact ${contact.email}:`, error);
      } else {
        console.log(`Created contact: ${contact.email}`);
      }
    }
  }

  console.log("\nDemo profiles setup complete!");
  console.log("\nDemo Credentials:");
  console.log("- demo-acme1@example.com / DemoPass123!");
  console.log("- demo-techstart@example.com / DemoPass123!");
}

main();
