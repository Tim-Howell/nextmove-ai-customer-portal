"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getSystemSetting(key: string): Promise<unknown> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error("Error fetching setting:", error);
    return null;
  }

  return data?.value;
}

export async function setSystemSetting(key: string, value: unknown) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("system_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Error updating setting:", error);
    return { error: "Failed to update setting" };
  }

  revalidatePath("/settings");
  revalidatePath("/customers");
  return { success: true };
}

export async function getShowDemoData(): Promise<boolean> {
  const value = await getSystemSetting("show_demo_data");
  return value === true;
}

export async function setShowDemoData(show: boolean) {
  return setSystemSetting("show_demo_data", show);
}
