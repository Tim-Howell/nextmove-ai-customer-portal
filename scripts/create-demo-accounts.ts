/**
 * Demo Account Creation Script
 * 
 * This script creates demo user accounts for testing.
 * These accounts are linked to demo customers for portal access testing.
 * 
 * Run with: npx tsx scripts/create-demo-accounts.ts
 * 
 * Demo Credentials:
 * - demo-acme1@example.com / DemoPass123!
 * - demo-techstart@example.com / DemoPass123!
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DEMO_PASSWORD = "DemoPass123!";

const demoAccounts = [
  {
    email: "demo-acme1@example.com",
    customerName: "Acme Corporation",
    fullName: "Demo User (Acme)",
  },
  {
    email: "demo-techstart@example.com",
    customerName: "TechStart Solutions",
    fullName: "Demo User (TechStart)",
  },
];

async function getCustomerByName(name: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("id")
    .eq("name", name)
    .eq("is_demo", true)
    .single();

  if (error) {
    console.error(`Error finding customer ${name}:`, error);
    return null;
  }
  return data;
}

async function createDemoAccount(account: typeof demoAccounts[0]) {
  console.log(`\nCreating account: ${account.email}`);

  // Find the customer
  const customer = await getCustomerByName(account.customerName);
  if (!customer) {
    console.error(`Customer not found: ${account.customerName}. Run seed-demo-data.ts first.`);
    return null;
  }

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === account.email);

  let userId: string;

  if (existingUser) {
    console.log(`User already exists: ${account.email}`);
    userId = existingUser.id;
  } else {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: account.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });

    if (authError) {
      console.error(`Error creating auth user:`, authError);
      return null;
    }

    userId = authData.user.id;
    console.log(`Created auth user: ${userId}`);
  }

  // Update or create profile
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: account.email,
      full_name: account.fullName,
      role: "customer_user",
      customer_id: customer.id,
    });

  if (profileError) {
    console.error(`Error updating profile:`, profileError);
    return null;
  }

  // Create or update customer contact
  const { data: existingContact } = await supabase
    .from("customer_contacts")
    .select("id")
    .eq("email", account.email)
    .single();

  if (existingContact) {
    // Update existing contact
    await supabase
      .from("customer_contacts")
      .update({
        user_id: userId,
        portal_access_enabled: true,
        is_active: true,
      })
      .eq("id", existingContact.id);
  } else {
    // Create new contact
    await supabase.from("customer_contacts").insert({
      customer_id: customer.id,
      full_name: account.fullName,
      email: account.email,
      user_id: userId,
      portal_access_enabled: true,
      is_active: true,
      is_demo: true,
    });
  }

  console.log(`Account setup complete: ${account.email}`);
  return { userId, customerId: customer.id };
}

async function main() {
  console.log("Creating demo accounts...");
  console.log("=".repeat(50));

  for (const account of demoAccounts) {
    await createDemoAccount(account);
  }

  console.log("\n" + "=".repeat(50));
  console.log("Demo Account Credentials:");
  console.log("=".repeat(50));
  demoAccounts.forEach((account) => {
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
    console.log(`Customer: ${account.customerName}`);
    console.log("-".repeat(30));
  });
}

main();
