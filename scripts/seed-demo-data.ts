/**
 * Demo Data Seeding Script
 * 
 * This script creates demo data for testing and demonstration purposes.
 * All demo records have is_demo = true for easy identification and cleanup.
 * 
 * Run with: npx tsx scripts/seed-demo-data.ts
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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Demo customer data
const demoCustomers = [
  { name: "Acme Corporation", status: "active", archived: false },
  { name: "TechStart Solutions", status: "active", archived: false },
  { name: "Global Dynamics", status: "active", archived: false },
  { name: "Innovate Labs", status: "active", archived: false },
  { name: "Summit Enterprises", status: "active", archived: false },
  { name: "Nexus Industries", status: "active", archived: false },
  { name: "Horizon Tech", status: "active", archived: false },
  { name: "Apex Consulting", status: "active", archived: false },
  { name: "Legacy Systems Inc", status: "inactive", archived: true }, // Archived
  { name: "Old World Corp", status: "inactive", archived: true }, // Archived
];

// Demo contacts per customer (will be distributed)
// Only the 3rd contact (Mike Williams) on first 5 customers gets portal access
// is_active: whether contact is still employed/relevant
// portal_access_enabled: whether contact can access the portal
const contactTemplates = [
  { full_name: "John Smith", title: "CEO", email: "john@", is_active: true, portal_access_enabled: false },
  { full_name: "Sarah Johnson", title: "CTO", email: "sarah@", is_active: true, portal_access_enabled: false },
  { full_name: "Mike Williams", title: "Project Manager", email: "mike@", is_active: true, portal_access_enabled: true },
  { full_name: "Emily Davis", title: "Developer", email: "emily@", is_active: false, portal_access_enabled: false }, // Inactive
  { full_name: "Chris Brown", title: "Designer", email: "chris@", is_active: true, portal_access_enabled: false },
];

// Time entry categories and descriptions
const timeCategories = ["Development", "Design", "Consulting", "Support", "Training"];
const timeDescriptions = [
  "Feature implementation",
  "Bug fixes and maintenance",
  "Code review and refactoring",
  "UI/UX improvements",
  "Database optimization",
  "API integration",
  "Documentation updates",
  "Client meeting",
  "Technical consultation",
  "System architecture review",
];

// Priority titles
const priorityTitles = [
  "Implement user authentication",
  "Redesign dashboard",
  "Optimize database queries",
  "Add reporting features",
  "Mobile app integration",
  "Security audit",
  "Performance improvements",
  "API documentation",
  "User onboarding flow",
  "Payment integration",
  "Email notifications",
  "Search functionality",
  "Data export feature",
  "Admin panel updates",
  "Customer feedback system",
];

// Request titles
const requestTitles = [
  "Need help with login issues",
  "Feature request: Dark mode",
  "Bug report: Page not loading",
  "Question about billing",
  "Request for training session",
  "Integration assistance needed",
  "Performance concerns",
  "Security question",
  "Account upgrade request",
  "Data migration help",
  "API access request",
  "Custom report needed",
  "User permission changes",
  "System downtime inquiry",
  "Feature clarification",
];

async function getReferenceValues() {
  const { data: contractStatuses } = await supabase
    .from("reference_values")
    .select("id, value")
    .eq("type", "contract_status");

  const { data: priorityStatuses } = await supabase
    .from("reference_values")
    .select("id, value")
    .eq("type", "priority_status");

  const { data: priorityLevels } = await supabase
    .from("reference_values")
    .select("id, value")
    .eq("type", "priority_level");

  const { data: requestStatuses } = await supabase
    .from("reference_values")
    .select("id, value")
    .eq("type", "request_status");

  const { data: timeCategories } = await supabase
    .from("reference_values")
    .select("id, value")
    .eq("type", "time_category");

  const { data: contractTypes } = await supabase
    .from("contract_types")
    .select("id, value");

  return {
    contractStatuses: contractStatuses || [],
    priorityStatuses: priorityStatuses || [],
    priorityLevels: priorityLevels || [],
    requestStatuses: requestStatuses || [],
    timeCategories: timeCategories || [],
    contractTypes: contractTypes || [],
  };
}

async function cleanupDemoData() {
  console.log("Cleaning up existing demo data...");
  
  // Get demo customer IDs first
  const { data: demoCustomers } = await supabase
    .from("customers")
    .select("id")
    .eq("is_demo", true);
  
  const demoCustomerIds = demoCustomers?.map((c) => c.id) || [];
  
  if (demoCustomerIds.length > 0) {
    // Delete in order of dependencies using customer_id
    await supabase.from("time_entries").delete().in("customer_id", demoCustomerIds);
    await supabase.from("requests").delete().in("customer_id", demoCustomerIds);
    await supabase.from("priorities").delete().in("customer_id", demoCustomerIds);
    await supabase.from("contracts").delete().in("customer_id", demoCustomerIds);
    await supabase.from("customer_contacts").delete().eq("is_demo", true);
    await supabase.from("customers").delete().eq("is_demo", true);
  }
  
  console.log("Cleanup complete.");
}

async function seedCustomers() {
  console.log("Seeding customers...");
  
  const customersToInsert = demoCustomers.map((c) => ({
    name: c.name,
    status: c.status,
    is_demo: true,
    archived_at: c.archived ? new Date().toISOString() : null,
  }));

  const { data, error } = await supabase
    .from("customers")
    .insert(customersToInsert)
    .select();

  if (error) {
    console.error("Error seeding customers:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo customers.`);
  return data;
}

async function seedContacts(customers: any[]) {
  console.log("Seeding customer contacts...");
  
  const contacts: any[] = [];
  
  // Distribute contacts across customers
  // First 5 customers get 3 contacts each, with only the 3rd (Mike Williams) having portal access
  // Remaining customers get 2 contacts each, none with portal access
  customers.forEach((customer, customerIndex) => {
    // Each customer gets 2-3 contacts
    const numContacts = customerIndex < 5 ? 3 : 2;
    const isFirst5Customers = customerIndex < 5;
    
    for (let i = 0; i < numContacts; i++) {
      const template = contactTemplates[i % contactTemplates.length]!;
      const domain = customer.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "") + ".com";
      
      // Only enable portal access for Mike Williams (index 2) on first 5 non-archived customers
      const enablePortalAccess = isFirst5Customers && i === 2 && !customer.archived_at;
      
      // Use template's is_active, but archived customers have all contacts inactive
      const contactIsActive = customer.archived_at ? false : template.is_active;
      
      contacts.push({
        customer_id: customer.id,
        full_name: template.full_name,
        title: template.title,
        email: template.email + domain,
        portal_access_enabled: enablePortalAccess,
        is_active: contactIsActive,
        is_demo: true,
      });
    }
  });

  const { data, error } = await supabase
    .from("customer_contacts")
    .insert(contacts)
    .select();

  if (error) {
    console.error("Error seeding contacts:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo contacts.`);
  return data;
}

async function seedContracts(customers: any[], refs: any) {
  console.log("Seeding contracts...");
  
  const activeStatus = refs.contractStatuses.find((s: any) => s.value === "active");
  const draftStatus = refs.contractStatuses.find((s: any) => s.value === "draft");
  const expiredStatus = refs.contractStatuses.find((s: any) => s.value === "expired");
  
  // Contract types: hours_bucket, hours_subscription, fixed_cost, service_subscription, on_demand
  const hoursSubscriptionType = refs.contractTypes.find((t: any) => t.value === "hours_subscription");
  const hoursBucketType = refs.contractTypes.find((t: any) => t.value === "hours_bucket");
  const onDemandType = refs.contractTypes.find((t: any) => t.value === "on_demand");

  const contracts: any[] = [];
  const activeCustomers = customers.filter((c) => !c.archived_at);

  // Get Acme and TechStart for special handling
  const acme = activeCustomers.find((c) => c.name === "Acme Corporation");
  const techStart = activeCustomers.find((c) => c.name === "TechStart Solutions");

  activeCustomers.forEach((customer, index) => {
    // Special handling for Acme - Monthly Retainer WITH rollover
    if (customer.id === acme?.id) {
      contracts.push({
        customer_id: customer.id,
        name: `${customer.name} - Monthly Retainer`,
        contract_type_id: hoursSubscriptionType?.id,
        status_id: activeStatus?.id,
        hours_per_period: 10,
        billing_day: 1,
        rollover_enabled: true,
        max_rollover_hours: 20,
        start_date: new Date(2024, 0, 1).toISOString().split("T")[0],
      });
    }
    // Special handling for TechStart - Monthly Retainer WITHOUT rollover
    else if (customer.id === techStart?.id) {
      contracts.push({
        customer_id: customer.id,
        name: `${customer.name} - Monthly Retainer`,
        contract_type_id: hoursSubscriptionType?.id,
        status_id: activeStatus?.id,
        hours_per_period: 10,
        billing_day: 1,
        rollover_enabled: false,
        start_date: new Date(2024, 0, 1).toISOString().split("T")[0],
      });
    }
    // Other customers - standard retainer
    else {
      contracts.push({
        customer_id: customer.id,
        name: `${customer.name} - Monthly Retainer`,
        contract_type_id: hoursSubscriptionType?.id,
        status_id: activeStatus?.id,
        total_hours: 40,
        start_date: new Date(2024, 0, 1).toISOString().split("T")[0],
      });
    }

    // Some customers have additional contracts - hours bucket (project)
    if (index < 4) {
      contracts.push({
        customer_id: customer.id,
        name: `${customer.name} - Special Project`,
        contract_type_id: hoursBucketType?.id,
        status_id: index === 0 ? activeStatus?.id : draftStatus?.id,
        total_hours: 100,
        start_date: new Date(2024, 3, 1).toISOString().split("T")[0],
        end_date: new Date(2024, 8, 30).toISOString().split("T")[0],
      });
    }

    // First two customers get an on-demand contract
    if (index < 2) {
      contracts.push({
        customer_id: customer.id,
        name: `${customer.name} - Ad-hoc Support`,
        contract_type_id: onDemandType?.id,
        status_id: activeStatus?.id,
        start_date: new Date(2024, 0, 1).toISOString().split("T")[0],
      });
    }
  });

  const { data, error } = await supabase
    .from("contracts")
    .insert(contracts)
    .select();

  if (error) {
    console.error("Error seeding contracts:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo contracts.`);
  return data;
}

async function seedTimeEntries(customers: any[], contracts: any[], refs: any) {
  console.log("Seeding time entries...");
  
  // Get a staff member to assign time entries to
  const { data: staffMembers } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "staff"])
    .limit(1);
  
  const staffId = staffMembers?.[0]?.id;
  if (!staffId) {
    console.log("No staff members found - skipping time entries");
    return [];
  }
  
  const timeEntries: any[] = [];
  const categories = refs.timeCategories;
  
  // Get Acme and TechStart customers
  const acme = customers.find((c) => c.name === "Acme Corporation");
  const techStart = customers.find((c) => c.name === "TechStart Solutions");
  
  // Helper to create time entries for a customer
  const createEntriesForCustomer = (customer: any, count: number) => {
    const customerContracts = contracts.filter((c) => c.customer_id === customer.id);
    if (customerContracts.length === 0) return;
    
    for (let i = 0; i < count; i++) {
      const contract = customerContracts[i % customerContracts.length];
      const category = categories[i % categories.length];
      const description = timeDescriptions[i % timeDescriptions.length];
      
      // Random date in the last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - daysAgo);
      
      timeEntries.push({
        customer_id: customer.id,
        contract_id: contract.id,
        staff_id: staffId,
        entry_date: entryDate.toISOString().split("T")[0],
        hours: (Math.floor(Math.random() * 16) + 1) / 4, // 0.25 to 4 hours
        category_id: category?.id,
        description,
        is_billable: Math.random() > 0.1, // 90% billable
      });
    }
  };

  // Acme: 40 entries
  if (acme) createEntriesForCustomer(acme, 40);
  
  // TechStart: 30 entries
  if (techStart) createEntriesForCustomer(techStart, 30);
  
  // Others: 30 entries spread across remaining customers
  const otherCustomers = customers.filter(
    (c) => c.name !== "Acme Corporation" && c.name !== "TechStart Solutions" && !c.archived_at
  );
  otherCustomers.forEach((customer, index) => {
    createEntriesForCustomer(customer, 5); // ~5 each for 6 customers = 30
  });

  const { data, error } = await supabase
    .from("time_entries")
    .insert(timeEntries)
    .select();

  if (error) {
    console.error("Error seeding time entries:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo time entries.`);
  return data;
}

async function seedPriorities(customers: any[], refs: any) {
  console.log("Seeding priorities...");
  
  const priorities: any[] = [];
  const statuses = refs.priorityStatuses;
  const levels = refs.priorityLevels;
  
  const acme = customers.find((c) => c.name === "Acme Corporation");
  const techStart = customers.find((c) => c.name === "TechStart Solutions");
  
  const createPrioritiesForCustomer = (customer: any, count: number) => {
    for (let i = 0; i < count; i++) {
      const status = statuses[i % statuses.length];
      const level = levels[i % levels.length];
      const title = priorityTitles[i % priorityTitles.length];
      
      // Random due date in next 60 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60));
      
      priorities.push({
        customer_id: customer.id,
        title: `${title} - ${customer.name.split(" ")[0]}`,
        description: `Priority item for ${customer.name}`,
        status_id: status?.id,
        priority_level_id: level?.id,
        due_date: dueDate.toISOString().split("T")[0],
      });
    }
  };

  // Acme: 25 priorities
  if (acme) createPrioritiesForCustomer(acme, 25);
  
  // TechStart: 22 priorities
  if (techStart) createPrioritiesForCustomer(techStart, 22);
  
  // Others: spread across remaining customers
  const otherCustomers = customers.filter(
    (c) => c.name !== "Acme Corporation" && c.name !== "TechStart Solutions" && !c.archived_at
  );
  otherCustomers.forEach((customer) => {
    createPrioritiesForCustomer(customer, 3);
  });

  const { data, error } = await supabase
    .from("priorities")
    .insert(priorities)
    .select();

  if (error) {
    console.error("Error seeding priorities:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo priorities.`);
  return data;
}

async function seedRequests(customers: any[], refs: any) {
  console.log("Seeding requests...");
  
  const requests: any[] = [];
  const statuses = refs.requestStatuses;
  
  const acme = customers.find((c) => c.name === "Acme Corporation");
  const techStart = customers.find((c) => c.name === "TechStart Solutions");
  
  const createRequestsForCustomer = (customer: any, count: number) => {
    for (let i = 0; i < count; i++) {
      const status = statuses[i % statuses.length];
      const title = requestTitles[i % requestTitles.length];
      
      requests.push({
        customer_id: customer.id,
        title: `${title}`,
        description: `Request details for ${customer.name}. This is a demo request for testing purposes.`,
        status_id: status?.id,
      });
    }
  };

  // Acme: 25 requests
  if (acme) createRequestsForCustomer(acme, 25);
  
  // TechStart: 22 requests
  if (techStart) createRequestsForCustomer(techStart, 22);
  
  // Others: spread across remaining customers
  const otherCustomers = customers.filter(
    (c) => c.name !== "Acme Corporation" && c.name !== "TechStart Solutions" && !c.archived_at
  );
  otherCustomers.forEach((customer) => {
    createRequestsForCustomer(customer, 5);
  });

  const { data, error } = await supabase
    .from("requests")
    .insert(requests)
    .select();

  if (error) {
    console.error("Error seeding requests:", error);
    throw error;
  }

  console.log(`Created ${data.length} demo requests.`);
  return data;
}

async function main() {
  console.log("Starting demo data seeding...\n");
  
  try {
    // Get reference values first
    const refs = await getReferenceValues();
    
    // Clean up existing demo data
    await cleanupDemoData();
    
    // Seed in order of dependencies
    const customers = await seedCustomers();
    const contacts = await seedContacts(customers);
    const contracts = await seedContracts(customers, refs);
    const timeEntries = await seedTimeEntries(customers, contracts, refs);
    const priorities = await seedPriorities(customers, refs);
    const requests = await seedRequests(customers, refs);
    
    console.log("\n=== Demo Data Summary ===");
    console.log(`Customers: ${customers.length} (${customers.filter((c: any) => c.status === "archived").length} archived)`);
    console.log(`Contacts: ${contacts.length}`);
    console.log(`Contracts: ${contracts.length}`);
    console.log(`Time Entries: ${timeEntries.length}`);
    console.log(`Priorities: ${priorities.length}`);
    console.log(`Requests: ${requests.length}`);
    console.log("\nDemo data seeding complete!");
    
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
