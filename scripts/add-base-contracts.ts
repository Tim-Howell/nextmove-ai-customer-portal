import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Real customers (not demo)
const REAL_CUSTOMERS = ["made4gov", "Government AI Academy"];

async function addBaseContracts() {
  console.log("Adding base contracts for existing customers...\n");

  // Get the on_demand contract type
  const { data: onDemandType, error: typeError } = await supabase
    .from("contract_types")
    .select("id")
    .eq("value", "on_demand")
    .single();

  if (typeError || !onDemandType) {
    console.error("Error: Could not find on_demand contract type");
    console.error(typeError);
    return;
  }

  // Get the active status
  const { data: activeStatus, error: statusError } = await supabase
    .from("reference_values")
    .select("id")
    .eq("type", "contract_status")
    .eq("value", "active")
    .single();

  if (statusError || !activeStatus) {
    console.error("Error: Could not find active status");
    console.error(statusError);
    return;
  }

  // Get all customers
  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("id, name, is_demo");

  if (customersError || !customers) {
    console.error("Error fetching customers:", customersError);
    return;
  }

  console.log(`Found ${customers.length} customers\n`);

  let created = 0;
  let skipped = 0;

  for (const customer of customers) {
    // Check if customer already has a default/base contract
    const { data: existingContract } = await supabase
      .from("contracts")
      .select("id, name")
      .eq("customer_id", customer.id)
      .eq("is_default", true)
      .single();

    if (existingContract) {
      console.log(`⏭️  ${customer.name}: Already has base contract "${existingContract.name}"`);
      skipped++;
      continue;
    }

    // Determine if this is a real or demo customer
    const isRealCustomer = REAL_CUSTOMERS.some(
      (name) => customer.name.toLowerCase().includes(name.toLowerCase())
    );
    const isDemo = isRealCustomer ? false : customer.is_demo;

    // Create the base contract (without is_demo since contracts table may not have it)
    const { error: insertError } = await supabase.from("contracts").insert({
      customer_id: customer.id,
      name: "On-Demand Services - No Contract",
      contract_type_id: onDemandType.id,
      status_id: activeStatus.id,
      is_default: true,
    });

    if (insertError) {
      console.error(`❌ ${customer.name}: Failed to create base contract`, insertError);
    } else {
      console.log(`✅ ${customer.name}: Created base contract (is_demo: ${isDemo})`);
      created++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Created: ${created}`);
  console.log(`Skipped (already had base contract): ${skipped}`);
  console.log(`Total customers: ${customers.length}`);
}

addBaseContracts().catch(console.error);
