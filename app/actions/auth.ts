"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type {
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/validations/auth";

export async function login(data: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(data: ForgotPasswordFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?type=recovery`,
  });

  if (error) {
    // Don't reveal if email exists or not
    console.error("Password reset error:", error.message);
  }

  // Always return success to prevent email enumeration
  return { success: true };
}

export async function resetPassword(data: ResetPasswordFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return { error: "Failed to reset password. Please try again." };
  }

  return { success: true };
}

export async function sendMagicLink(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.error("Magic link error:", error.message);
    return { error: "Failed to send magic link. Please try again." };
  }

  return { success: true };
}
