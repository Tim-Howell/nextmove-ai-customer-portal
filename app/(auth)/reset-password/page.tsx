"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { resetPassword } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

interface Branding {
  organization_name: string;
  logo_url: string | null;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [branding, setBranding] = useState<Branding>({ organization_name: "NextMove AI", logo_url: null });

  useEffect(() => {
    async function fetchBranding() {
      try {
        const res = await fetch("/api/branding");
        if (res.ok) {
          const data = await res.json();
          setBranding(data);
        }
      } catch (e) {
        // Use defaults
      }
    }
    fetchBranding();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If there's a session, the reset link was valid
      setIsValidLink(!!session);
    };

    checkSession();
  }, []);

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  if (isValidLink === null) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Verifying reset link...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isValidLink) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          {branding.logo_url && (
            <div className="flex justify-center mb-4">
              <img src={branding.logo_url} alt={branding.organization_name} className="h-16 w-16 object-contain" />
            </div>
          )}
          <div className="text-2xl font-bold text-primary">{branding.organization_name}</div>
          <CardTitle className="text-2xl">Invalid or expired link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired. Please request a
            new one.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/forgot-password" className="w-full">
            <Button className="w-full">Request new link</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          {branding.logo_url && (
            <div className="flex justify-center mb-4">
              <img src={branding.logo_url} alt={branding.organization_name} className="h-16 w-16 object-contain" />
            </div>
          )}
          <div className="text-2xl font-bold text-primary">{branding.organization_name}</div>
          <CardTitle className="text-2xl">Password reset successful</CardTitle>
          <CardDescription>
            Your password has been updated. Redirecting to sign in...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        {branding.logo_url && (
          <div className="flex justify-center mb-4">
            <img src={branding.logo_url} alt={branding.organization_name} className="h-16 w-16 object-contain" />
          </div>
        )}
        <div className="text-2xl font-bold text-primary">{branding.organization_name}</div>
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
