import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const staffMembers = [
  {
    email: "cynthia@nextmoveaiservices.com",
    first_name: "Cynthia",
    last_name: "Howell",
    title: "President",
    role: "admin",
  },
  {
    email: "dustin@nextmoveaiservices.com",
    first_name: "Dustin",
    last_name: "Haisler",
    title: "VP of AI Solutions",
    role: "admin",
  },
  {
    email: "tim@nextmoveaiservices.com",
    first_name: "Tim",
    last_name: "Howell",
    title: "VP of Consulting Services",
    role: "admin",
  },
];

async function createStaffAccounts() {
  console.log("Creating staff accounts...\n");

  for (const staff of staffMembers) {
    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", staff.email)
      .single();

    if (existingProfile) {
      console.log(`✓ ${staff.email} already exists, updating profile...`);
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: staff.first_name,
          last_name: staff.last_name,
          full_name: `${staff.first_name} ${staff.last_name}`,
          title: staff.title,
          role: staff.role,
          is_active: true,
        })
        .eq("id", existingProfile.id);

      if (updateError) {
        console.error(`  Error updating profile: ${updateError.message}`);
      } else {
        console.log(`  Profile updated successfully`);
      }
      continue;
    }

    // Create auth user (auto-confirmed, no password required for magic link)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: staff.email,
      email_confirm: true, // Auto-confirm so they can use magic link immediately
      user_metadata: {
        first_name: staff.first_name,
        last_name: staff.last_name,
        full_name: `${staff.first_name} ${staff.last_name}`,
        title: staff.title,
        role: staff.role,
      },
    });

    if (authError) {
      console.error(`✗ ${staff.email}: ${authError.message}`);
      continue;
    }

    console.log(`✓ Created auth user: ${staff.email}`);

    // Create/update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        full_name: `${staff.first_name} ${staff.last_name}`,
        title: staff.title,
        role: staff.role,
        is_active: true,
      });

    if (profileError) {
      console.error(`  Error creating profile: ${profileError.message}`);
    } else {
      console.log(`  Profile created successfully`);
    }
  }

  console.log("\n=== Staff Account Setup Complete ===");
  console.log("\nUsers can now sign in using Magic Link at the login page.");
  console.log("They can also set a password via 'Forgot Password' if preferred.");
}

createStaffAccounts().catch(console.error);
