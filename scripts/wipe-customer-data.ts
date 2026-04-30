/**
 * Wipe Customer Data Script
 *
 * Deletes ALL customer business data and audit logs, leaving:
 *   - admin/staff users (profiles + auth.users)
 *   - reference_values, contract_types
 *   - portal_settings, system_settings
 *
 * Deleted:
 *   - internal_notes
 *   - time_entries, requests, priorities
 *   - contract_documents, contracts
 *   - customer_contacts (+ their auth users if role = customer_user)
 *   - customers
 *   - audit_logs
 *
 * Usage:
 *   npx tsx scripts/wipe-customer-data.ts           (dry run — shows counts)
 *   npx tsx scripts/wipe-customer-data.ts --confirm (actually deletes)
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const confirmed = process.argv.includes("--confirm");

async function count(table: string): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error(`  [error counting ${table}]`, error.message);
    return -1;
  }
  return count ?? 0;
}

async function deleteAll(table: string) {
  // Supabase requires a filter; use a condition that matches all rows.
  const { error } = await supabase
    .from(table)
    .delete()
    .not("id", "is", null);
  if (error) {
    throw new Error(`Failed to delete from ${table}: ${error.message}`);
  }
}

async function main() {
  console.log(`\n${confirmed ? "WIPING" : "DRY RUN - counting"} customer data`);
  console.log("=".repeat(50));

  const tables = [
    "internal_notes",
    "time_entries",
    "requests",
    "priorities",
    "contract_documents",
    "contracts",
    "customer_contacts",
    "customers",
    "audit_logs",
  ];

  console.log("\nCurrent row counts:");
  for (const t of tables) {
    const c = await count(t);
    console.log(`  ${t.padEnd(22)} ${c}`);
  }

  // Collect customer_user auth user ids BEFORE deleting contacts.
  const { data: customerContacts, error: ccErr } = await supabase
    .from("customer_contacts")
    .select("user_id")
    .not("user_id", "is", null);

  if (ccErr) {
    console.error("Failed to load customer_contacts:", ccErr.message);
    process.exit(1);
  }

  // Cross-check: only delete auth users whose profile role is customer_user
  const candidateUserIds = (customerContacts ?? [])
    .map((c) => c.user_id as string)
    .filter(Boolean);

  let userIdsToDelete: string[] = [];
  if (candidateUserIds.length > 0) {
    const { data: profilesToDelete, error: pErr } = await supabase
      .from("profiles")
      .select("id, role")
      .in("id", candidateUserIds)
      .eq("role", "customer_user");
    if (pErr) {
      console.error("Failed to check profile roles:", pErr.message);
      process.exit(1);
    }
    userIdsToDelete = (profilesToDelete ?? []).map((p) => p.id as string);
  }

  console.log(`\nCustomer auth users to delete: ${userIdsToDelete.length}`);

  if (!confirmed) {
    console.log("\nDry run complete. Re-run with --confirm to actually delete.");
    return;
  }

  console.log("\nDeleting...");

  // Order matters: delete children before parents.
  // internal_notes references priorities/requests/customers by entity_id (no FK — soft).
  // Most others cascade from customers, but deleting explicitly is safer and clearer.
  for (const t of tables) {
    process.stdout.write(`  ${t.padEnd(22)} `);
    await deleteAll(t);
    console.log("done");
  }

  // Delete auth users (customer_user role) — profiles.id cascades via profiles->auth.users FK
  // Deleting the auth user removes the profile via ON DELETE CASCADE on profiles.id.
  if (userIdsToDelete.length > 0) {
    console.log(`\nDeleting ${userIdsToDelete.length} customer auth users...`);
    let ok = 0;
    let fail = 0;
    for (const uid of userIdsToDelete) {
      const { error } = await supabase.auth.admin.deleteUser(uid);
      if (error) {
        fail++;
        console.error(`  [${uid}] ${error.message}`);
      } else {
        ok++;
      }
    }
    console.log(`  deleted: ${ok}, failed: ${fail}`);
  }

  // Also clean up any orphaned customer_user profiles not linked to contacts
  const { data: orphanProfiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "customer_user");
  if (orphanProfiles && orphanProfiles.length > 0) {
    console.log(`\nDeleting ${orphanProfiles.length} orphaned customer_user profiles...`);
    for (const p of orphanProfiles) {
      await supabase.auth.admin.deleteUser(p.id as string);
    }
  }

  console.log("\nWipe complete.");
  console.log("\nPost-wipe row counts:");
  for (const t of tables) {
    const c = await count(t);
    console.log(`  ${t.padEnd(22)} ${c}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
