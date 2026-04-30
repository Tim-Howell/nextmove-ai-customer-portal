/**
 * Seed "Demo Customer" — single-customer demo script
 *
 * Creates ONE rich demo customer ("Demo Customer") with:
 *   - 7 contracts (5 active across all contract types, 1 archived, 1 expired)
 *   - 7 contacts (2 inactive, 2 portal-enabled, 1 primary POC only, 2 billing)
 *   - 10+ priorities (5 active + 5 across other states) with icons
 *   - 10 requests (various states) with internal notes; 2 open ones have 5+ notes
 *   - 100 time entries from 2026-01-01 through today (~80% billable)
 *   - 20+ internal notes spread across customer / priorities / requests
 *   - Placeholder logo on customer, Lucide icon names on priorities
 *
 * All records created with is_demo = true where supported.
 * Re-runnable: deletes the existing "Demo Customer" (if is_demo=true) and its
 * dependent data + portal auth users before re-seeding.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-customer.ts
 *
 * NOTE FOR FUTURE TASK:
 *   User wants contract statuses reduced to 3: Active, Expired (past end_date),
 *   Archived (manually archived/closed). Currently the system has 5:
 *   draft, active, expired, closed, archived. Not changed in this script.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CUSTOMER_NAME = "Demo Customer";
const LOGO_URL = "https://via.placeholder.com/200x200.png?text=Demo";
const TODAY = new Date();
const SEED_START = new Date("2026-01-01T00:00:00Z");

// ---------- Utility ----------
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)] as T;
const dateISO = (d: Date): string => d.toISOString().split("T")[0]!;

function randomDateBetween(start: Date, end: Date): Date {
  const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(t);
}

// ---------- Lookups ----------
async function getRefs() {
  const [{ data: refs }, { data: types }, { data: staff }] = await Promise.all([
    supabase.from("reference_values").select("id, type, value, is_default"),
    supabase.from("contract_types").select("id, value"),
    supabase
      .from("profiles")
      .select("id, email, role")
      .in("role", ["admin", "staff"]),
  ]);

  if (!refs || !types || !staff || staff.length === 0) {
    throw new Error(
      "Missing reference data. Ensure reference_values, contract_types, and at least one admin/staff user exist."
    );
  }

  const byType = (t: string) => refs.filter((r) => r.type === t);
  const refByValue = (t: string, v: string) =>
    refs.find((r) => r.type === t && r.value === v)!;

  return {
    contractStatus: {
      active: refByValue("contract_status", "active")!,
      expired: refByValue("contract_status", "expired")!,
      archived: refByValue("contract_status", "archived")!,
    },
    contractType: {
      hours_bucket: types.find((t) => t.value === "hours_bucket")!,
      hours_subscription: types.find((t) => t.value === "hours_subscription")!,
      fixed_cost: types.find((t) => t.value === "fixed_cost")!,
      service_subscription: types.find(
        (t) => t.value === "service_subscription"
      )!,
      on_demand: types.find((t) => t.value === "on_demand")!,
    },
    timeCategories: byType("time_category"),
    priorityStatuses: byType("priority_status"),
    priorityLevels: byType("priority_level"),
    requestStatuses: byType("request_status"),
    staffId: staff[0]!.id as string,
  };
}

// ---------- Cleanup existing Demo Customer ----------
async function cleanupExisting() {
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("name", CUSTOMER_NAME)
    .eq("is_demo", true);

  const ids = (existing ?? []).map((c) => c.id as string);
  if (ids.length === 0) return;

  console.log(`Cleaning up ${ids.length} existing "${CUSTOMER_NAME}" record(s)...`);

  // Delete auth users linked to this customer's contacts
  const { data: portalContacts } = await supabase
    .from("customer_contacts")
    .select("user_id")
    .in("customer_id", ids)
    .not("user_id", "is", null);

  for (const c of portalContacts ?? []) {
    if (c.user_id) {
      await supabase.auth.admin.deleteUser(c.user_id as string);
    }
  }

  // Polymorphic internal_notes (no FK cascade)
  for (const cid of ids) {
    // priorities for customer
    const { data: prs } = await supabase
      .from("priorities")
      .select("id")
      .eq("customer_id", cid);
    const { data: rqs } = await supabase
      .from("requests")
      .select("id")
      .eq("customer_id", cid);

    const priIds = (prs ?? []).map((p) => p.id as string);
    const reqIds = (rqs ?? []).map((r) => r.id as string);

    await supabase
      .from("internal_notes")
      .delete()
      .eq("entity_type", "customer")
      .eq("entity_id", cid);
    if (priIds.length)
      await supabase
        .from("internal_notes")
        .delete()
        .eq("entity_type", "priority")
        .in("entity_id", priIds);
    if (reqIds.length)
      await supabase
        .from("internal_notes")
        .delete()
        .eq("entity_type", "request")
        .in("entity_id", reqIds);
  }

  // Rest cascades via customers.id FK
  await supabase.from("customers").delete().in("id", ids);
  console.log("Cleanup complete.\n");
}

// ---------- Customer ----------
async function createCustomer() {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: CUSTOMER_NAME,
      status: "active",
      is_demo: true,
      logo_url: LOGO_URL,
      website: "https://demo-customer.example.com",
      notes: "Primary demo customer used for manual testing and screenshots.",
    })
    .select()
    .single();
  if (error) throw error;
  console.log(`Created customer: ${data.name} (${data.id})`);
  return data;
}

// ---------- Contacts ----------
interface ContactSpec {
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  is_active: boolean;
  portal_access_enabled: boolean;
  role: "primary_poc" | "billing_primary" | "billing_secondary" | "none";
}

const CONTACT_SPECS: ContactSpec[] = [
  // 1. Primary POC, portal-enabled, active
  {
    full_name: "Alice Morgan",
    first_name: "Alice",
    last_name: "Morgan",
    title: "Director of Operations",
    email: "alice.morgan@demo-customer.example.com",
    phone: "555-0101",
    is_active: true,
    portal_access_enabled: true,
    role: "primary_poc",
  },
  // 2. Billing primary, portal-enabled, active
  {
    full_name: "Ben Carter",
    first_name: "Ben",
    last_name: "Carter",
    title: "Finance Manager",
    email: "ben.carter@demo-customer.example.com",
    phone: "555-0102",
    is_active: true,
    portal_access_enabled: true,
    role: "billing_primary",
  },
  // 3. Billing secondary, active
  {
    full_name: "Carla Nguyen",
    first_name: "Carla",
    last_name: "Nguyen",
    title: "Accounts Payable Specialist",
    email: "carla.nguyen@demo-customer.example.com",
    phone: "555-0103",
    is_active: true,
    portal_access_enabled: false,
    role: "billing_secondary",
  },
  // 4. Active, no role
  {
    full_name: "David Patel",
    first_name: "David",
    last_name: "Patel",
    title: "IT Manager",
    email: "david.patel@demo-customer.example.com",
    phone: "555-0104",
    is_active: true,
    portal_access_enabled: false,
    role: "none",
  },
  // 5. Active, no role
  {
    full_name: "Elena Rossi",
    first_name: "Elena",
    last_name: "Rossi",
    title: "Marketing Lead",
    email: "elena.rossi@demo-customer.example.com",
    phone: "555-0105",
    is_active: true,
    portal_access_enabled: false,
    role: "none",
  },
  // 6. Inactive
  {
    full_name: "Frank Hughes",
    first_name: "Frank",
    last_name: "Hughes",
    title: "Former CTO",
    email: "frank.hughes@demo-customer.example.com",
    phone: "555-0106",
    is_active: false,
    portal_access_enabled: false,
    role: "none",
  },
  // 7. Inactive
  {
    full_name: "Grace Kim",
    first_name: "Grace",
    last_name: "Kim",
    title: "Former Project Coordinator",
    email: "grace.kim@demo-customer.example.com",
    phone: "555-0107",
    is_active: false,
    portal_access_enabled: false,
    role: "none",
  },
];

async function createContacts(customerId: string) {
  const rows: any[] = [];

  for (const spec of CONTACT_SPECS) {
    let userId: string | null = null;

    if (spec.portal_access_enabled && spec.is_active) {
      // Create auth user. Random password — user will reset via admin "Set Password".
      const randomPwd =
        "Seed!" + Math.random().toString(36).slice(2, 10) + "A1";
      const { data: created, error } = await supabase.auth.admin.createUser({
        email: spec.email,
        password: randomPwd,
        email_confirm: true,
        user_metadata: { full_name: spec.full_name },
      });
      if (error) {
        console.warn(
          `  auth user skipped for ${spec.email}: ${error.message}`
        );
      } else if (created.user) {
        userId = created.user.id;
        // Set role + customer_id on profile
        await supabase
          .from("profiles")
          .update({
            role: "customer_user",
            customer_id: customerId,
            full_name: spec.full_name,
          })
          .eq("id", userId);
      }
    }

    rows.push({
      customer_id: customerId,
      user_id: userId,
      full_name: spec.full_name,
      first_name: spec.first_name,
      last_name: spec.last_name,
      title: spec.title,
      email: spec.email,
      phone: spec.phone,
      is_active: spec.is_active,
      portal_access_enabled: spec.portal_access_enabled,
      is_demo: true,
    });
  }

  const { data, error } = await supabase
    .from("customer_contacts")
    .insert(rows)
    .select();
  if (error) throw error;

  // Assign customer role FKs (primary POC only — no secondary POC per request)
  const byName = (n: string) => data.find((c) => c.full_name === n)!;
  await supabase
    .from("customers")
    .update({
      poc_primary_id: byName("Alice Morgan").id,
      poc_secondary_id: null,
      billing_contact_primary_id: byName("Ben Carter").id,
      billing_contact_secondary_id: byName("Carla Nguyen").id,
    })
    .eq("id", customerId);

  console.log(
    `Created ${data.length} contacts (2 portal-enabled, 2 inactive, 1 primary POC, 2 billing).`
  );
  return data;
}

// ---------- Contracts ----------
async function createContracts(customerId: string, staffId: string, refs: any) {
  const { contractStatus: cs, contractType: ct } = refs;

  const rows = [
    // 1. Hours Bucket 100 hours — Active
    {
      customer_id: customerId,
      name: "100 Hour Bucket",
      contract_type_id: ct.hours_bucket.id,
      status_id: cs.active.id,
      total_hours: 100,
      start_date: "2026-01-01",
      description: "Prepaid pool of 100 hours for general engineering work.",
      created_by: staffId,
    },
    // 2. Hours Subscription — 15 hrs/month — Active
    {
      customer_id: customerId,
      name: "Monthly Retainer",
      contract_type_id: ct.hours_subscription.id,
      status_id: cs.active.id,
      hours_per_period: 15,
      billing_day: 1,
      rollover_enabled: true,
      max_rollover_hours: 15,
      rollover_expiration_days: 60,
      start_date: "2026-01-01",
      description: "15 hours per month of ongoing support, rollover up to 15h.",
      created_by: staffId,
    },
    // 3. Fixed Cost — Digital Enablement Basic — Active
    {
      customer_id: customerId,
      name: "Digital Enablement Basic",
      contract_type_id: ct.fixed_cost.id,
      status_id: cs.active.id,
      fixed_cost: 7500,
      start_date: "2026-01-15",
      end_date: "2026-07-15",
      description: "Fixed-price digital enablement onboarding package.",
      created_by: staffId,
    },
    // 4. Service Subscription — Website Hosting — Active
    {
      customer_id: customerId,
      name: "Website Hosting Service",
      contract_type_id: ct.service_subscription.id,
      status_id: cs.active.id,
      fixed_cost: 150,
      billing_day: 1,
      start_date: "2026-01-01",
      description: "Ongoing website hosting and monitoring at $150/month.",
      created_by: staffId,
    },
    // 5. On-Demand (the default contract auto-created with every customer) — Active
    // Matches naming/fields used by createCustomer in app/actions/customers.ts
    {
      customer_id: customerId,
      name: "On-Demand Services - No Contract",
      contract_type_id: ct.on_demand.id,
      status_id: cs.active.id,
      is_default: true,
      created_by: staffId,
    },
    // 6. Fixed Cost Archived — Digital Enablement Advanced
    {
      customer_id: customerId,
      name: "Digital Enablement Advanced",
      contract_type_id: ct.fixed_cost.id,
      status_id: cs.archived.id,
      fixed_cost: 25000,
      start_date: "2025-09-01",
      end_date: "2026-01-31",
      archived_at: new Date("2026-02-01").toISOString(),
      description:
        "Completed advanced enablement engagement. Archived February 2026.",
      created_by: staffId,
    },
    // 7. Hours Bucket — Expired
    {
      customer_id: customerId,
      name: "Legacy Project Hours",
      contract_type_id: ct.hours_bucket.id,
      status_id: cs.expired.id,
      total_hours: 25,
      start_date: "2025-06-01",
      end_date: "2025-12-31",
      description: "Expired hours bucket from the 2025 legacy project.",
      created_by: staffId,
    },
  ];

  const { data, error } = await supabase
    .from("contracts")
    .insert(rows)
    .select();
  if (error) throw error;
  console.log(`Created ${data.length} contracts.`);
  return data;
}

// ---------- Time Entries ----------
const TIME_DESCRIPTIONS = [
  "Feature implementation",
  "Bug investigation and fix",
  "Code review",
  "Client call / check-in",
  "Technical design session",
  "Database query optimization",
  "Deployment and release",
  "Documentation update",
  "UX improvements",
  "Monitoring and incident response",
  "Refactoring legacy module",
  "Integration with third-party API",
];

async function createTimeEntries(
  customerId: string,
  contracts: any[],
  refs: any
) {
  // Assign to contracts that are sensible recipients of time (active + tracks_hours).
  // Exclude the archived + expired + the website hosting one (mostly operational, but ok to include occasionally).
  const byName = (n: string) => contracts.find((c) => c.name === n)!;
  const preferred = [
    byName("100 Hour Bucket"),
    byName("Monthly Retainer"),
    byName("On-Demand Services - No Contract"),
    byName("Digital Enablement Basic"),
    byName("Website Hosting Service"),
  ];

  const rows: any[] = [];
  const end = TODAY < new Date() ? TODAY : new Date();
  const count = 100;
  const billableCount = Math.round(count * 0.8);

  for (let i = 0; i < count; i++) {
    const contract = preferred[i % preferred.length]; // round-robin for good spread
    const category = pick<any>(refs.timeCategories);
    const entryDate = randomDateBetween(SEED_START, end);
    const hours = ([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4] as const)[rand(0, 8)]!;
    rows.push({
      customer_id: customerId,
      contract_id: contract.id,
      staff_id: refs.staffId,
      entered_by: refs.staffId,
      entry_date: dateISO(entryDate),
      hours,
      category_id: category.id,
      description: pick(TIME_DESCRIPTIONS),
      is_billable: i < billableCount,
    });
  }

  // Shuffle so billable flag isn't ordered
  rows.sort(() => Math.random() - 0.5);

  const { data, error } = await supabase
    .from("time_entries")
    .insert(rows)
    .select("id");
  if (error) throw error;
  console.log(
    `Created ${data.length} time entries (${billableCount} billable, ${count - billableCount} non-billable).`
  );
}

// ---------- Priorities ----------
const PRIORITY_TEMPLATES: Array<{ title: string; icon: string; desc: string }> = [
  { title: "Launch new customer onboarding flow", icon: "rocket", desc: "Ship the redesigned onboarding wizard and track activation rate." },
  { title: "Harden security review findings", icon: "shield", desc: "Address the items flagged in the Q1 security review." },
  { title: "Fix recurring report generation bug", icon: "bug", desc: "Weekly report fails intermittently — root cause and fix." },
  { title: "Refresh marketing homepage", icon: "sparkles", desc: "New hero, copy, and conversion-focused layout." },
  { title: "Hit Q2 activation target", icon: "target", desc: "30% of signups active within 7 days." },
  { title: "Speed up dashboard load time", icon: "zap", desc: "P95 dashboard load < 1.5s." },
  { title: "Quarterly business review prep", icon: "chart-bar", desc: "Metrics, wins, and roadmap deck for QBR." },
  { title: "Migrate off legacy auth provider", icon: "users", desc: "Move remaining users to new identity provider." },
  { title: "Automate monthly billing reconciliation", icon: "cog", desc: "Replace manual spreadsheet process." },
  { title: "Production observability upgrade", icon: "wrench", desc: "Add structured logging and better alerting." },
];

async function createPriorities(customerId: string, staffId: string, refs: any) {
  const statusBy = (v: string) =>
    refs.priorityStatuses.find((s: any) => s.value === v)!;
  const levelBy = (v: string) =>
    refs.priorityLevels.find((l: any) => l.value === v)!;

  // 5 active + 5 mix (2 backlog, 1 next_up, 1 complete, 1 on_hold)
  const plan: Array<{ status: string; level: string }> = [
    { status: "active", level: "high" },
    { status: "active", level: "high" },
    { status: "active", level: "medium" },
    { status: "active", level: "medium" },
    { status: "active", level: "low" },
    { status: "backlog", level: "medium" },
    { status: "backlog", level: "low" },
    { status: "next_up", level: "high" },
    { status: "complete", level: "medium" },
    { status: "on_hold", level: "low" },
  ];

  const rows = plan.map((p, i) => {
    const tpl = PRIORITY_TEMPLATES[i]!;
    // Due date: active/next_up => upcoming; backlog => further out; complete => past; on_hold => TBD null
    let due: string | null = null;
    const daysOffset =
      p.status === "active"
        ? rand(3, 30)
        : p.status === "next_up"
          ? rand(7, 21)
          : p.status === "backlog"
            ? rand(30, 90)
            : p.status === "complete"
              ? -rand(7, 60)
              : 0;
    if (p.status !== "on_hold") {
      const d = new Date();
      d.setDate(d.getDate() + daysOffset);
      due = dateISO(d);
    }
    return {
      customer_id: customerId,
      title: tpl.title,
      description: tpl.desc,
      icon: tpl.icon,
      status_id: statusBy(p.status).id,
      priority_level_id: levelBy(p.level).id,
      due_date: due,
      created_by: staffId,
      updated_by: staffId,
    };
  });

  const { data, error } = await supabase
    .from("priorities")
    .insert(rows)
    .select();
  if (error) throw error;
  console.log(
    `Created ${data.length} priorities (5 active + 5 mix across other states).`
  );
  return data;
}

// ---------- Requests ----------
const REQUEST_TEMPLATES = [
  { title: "Add SSO via Okta", desc: "Please enable SSO for our staff via Okta SAML." },
  { title: "Increase monthly report frequency", desc: "We want reports biweekly instead of monthly." },
  { title: "Investigate billing discrepancy — March", desc: "March invoice appears to double-count one line item." },
  { title: "Add new user — Raj Patel", desc: "Please provision portal access for Raj Patel." },
  { title: "Export time entries to CSV", desc: "Need a CSV export for our finance team each month." },
  { title: "Update company address on invoices", desc: "New HQ address; please update on next invoice." },
  { title: "Provision staging environment", desc: "We want a staging env for our QA team." },
  { title: "Request demo of new reporting feature", desc: "Interested in the new reporting module — can we see a walkthrough?" },
  { title: "Increase hours allocation for April", desc: "We expect a heavier April; bump to 25 hours." },
  { title: "Archive former user — Frank Hughes", desc: "Frank has left the company; please disable access." },
];

async function createRequests(customerId: string, staffId: string, refs: any) {
  const statusBy = (v: string) =>
    refs.requestStatuses.find((s: any) => s.value === v)!;

  // Statuses: new, in_review, in_progress, closed
  const plan = [
    "new",
    "new",
    "in_review",
    "in_review",
    "in_progress",
    "in_progress",
    "in_progress",
    "closed",
    "closed",
    "closed",
  ];

  const rows = plan.map((st, i) => ({
    customer_id: customerId,
    submitted_by: staffId,
    title: REQUEST_TEMPLATES[i]!.title,
    description: REQUEST_TEMPLATES[i]!.desc,
    status_id: statusBy(st).id,
  }));

  const { data, error } = await supabase
    .from("requests")
    .insert(rows)
    .select();
  if (error) throw error;
  console.log(`Created ${data.length} requests across 4 states.`);
  return data;
}

// ---------- Internal Notes ----------
const CUSTOMER_NOTES = [
  "Main POC Alice prefers Slack over email for urgent items.",
  "Quarterly QBR scheduled for the first Friday of each quarter.",
  "Invoices must reference PO number on each line item.",
  "Finance team requires W-9 on file before first payment — done.",
  "Prefers async updates over standing meetings.",
];

const PRIORITY_NOTES = [
  "Blocked on customer providing production credentials.",
  "Scope creep risk — flagged to account manager.",
  "Engineering estimate: 3 sprints.",
  "Depends on resolution of billing reconciliation priority.",
  "Customer aligned on acceptance criteria as of last review.",
  "Need to confirm timeline with Alice before committing externally.",
  "Reprioritized up after last steering committee.",
  "Considered deferring to Q3 if capacity doesn't open up.",
  "Related SRE work needs to complete first.",
  "Draft proposal shared — awaiting feedback.",
  "Carla requested cost estimate for inclusion in budget.",
  "Spiked technical approach; writeup in engineering wiki.",
  "On hold pending legal review of third-party terms.",
  "Final acceptance signed off by Alice on call.",
  "Deferred scope items tracked separately in backlog.",
];

const REQUEST_NOTES_DETAILED = [
  "Called Alice — she confirmed priority for this week.",
  "Waiting on info from customer's IT team; emailed at 10am.",
  "Scoped at ~4 hours of work, pending approval.",
  "Approved by account manager; assigned to engineering.",
  "Customer indicated budget available; proceeding.",
  "Follow-up meeting scheduled for Thursday.",
  "Engineering confirmed feasibility; no blockers.",
  "Drafted response email; pending internal review.",
  "Customer replied — clarifications received.",
  "Closed per customer confirmation of resolution.",
];

async function createInternalNotes(
  customerId: string,
  priorities: any[],
  requests: any[],
  staffId: string
) {
  const notes: any[] = [];

  // Customer notes (5)
  for (const text of CUSTOMER_NOTES) {
    notes.push({
      entity_type: "customer",
      entity_id: customerId,
      note_text: text,
      created_by: staffId,
    });
  }

  // Priority notes: spread 15 across priorities
  for (let i = 0; i < PRIORITY_NOTES.length; i++) {
    const priority = priorities[i % priorities.length];
    notes.push({
      entity_type: "priority",
      entity_id: priority.id,
      note_text: PRIORITY_NOTES[i],
      created_by: staffId,
    });
  }

  // Request notes:
  //   - 2 open requests (first two non-closed) get 5+ notes each (=10+)
  //   - Remaining open requests get 1-3 notes
  //   - Closed requests get 1-2 notes
  const openRequests = requests.filter((r) => {
    // "open" = not closed. Easiest heuristic: first 7 in plan.
    return true; // handled by index below
  });

  // Plan from createRequests: indices 0-6 are non-closed (new/in_review/in_progress), 7-9 closed.
  for (let idx = 0; idx < requests.length; idx++) {
    const req = requests[idx];
    let n: number;
    if (idx === 0 || idx === 2) {
      n = rand(5, 7); // two open requests with 5+ notes
    } else if (idx <= 6) {
      n = rand(1, 3);
    } else {
      n = rand(0, 2);
    }
    for (let k = 0; k < n; k++) {
      notes.push({
        entity_type: "request",
        entity_id: req.id,
        note_text: pick(REQUEST_NOTES_DETAILED),
        created_by: staffId,
      });
    }
  }

  const { data, error } = await supabase
    .from("internal_notes")
    .insert(notes)
    .select("id");
  if (error) throw error;

  const customerCount = notes.filter((n) => n.entity_type === "customer").length;
  const priorityCount = notes.filter((n) => n.entity_type === "priority").length;
  const requestCount = notes.filter((n) => n.entity_type === "request").length;

  console.log(
    `Created ${data.length} internal notes (customer: ${customerCount}, priorities: ${priorityCount}, requests: ${requestCount}).`
  );
}

// ---------- Main ----------
async function main() {
  console.log(`\nSeeding "${CUSTOMER_NAME}"...\n`);
  try {
    const refs = await getRefs();
    await cleanupExisting();

    const customer = await createCustomer();
    await createContacts(customer.id);
    const contracts = await createContracts(customer.id, refs.staffId, refs);
    await createTimeEntries(customer.id, contracts, refs);
    const priorities = await createPriorities(customer.id, refs.staffId, refs);
    const requests = await createRequests(customer.id, refs.staffId, refs);
    await createInternalNotes(customer.id, priorities, requests, refs.staffId);

    console.log("\nSeed complete.\n");
    console.log("Portal-enabled accounts (set password via admin UI to log in):");
    console.log("  - alice.morgan@demo-customer.example.com (Primary POC)");
    console.log("  - ben.carter@demo-customer.example.com  (Billing Primary)");
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  }
}

main();
