"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { updateUser } from "@/app/actions/users";
import { updatePassword } from "@/app/actions/auth";
import type { Profile } from "@/lib/supabase/profile";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  title: z.string().optional(),
  customer_id: z.string().uuid().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
  customers: { id: string; name: string; status: string }[];
}

export function ProfileForm({ profile, customers }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      title: profile.title || "",
      customer_id: profile.customer_id || null,
    },
  });

  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateUser(profile.id, data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
              Profile updated successfully! Redirecting...
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Email: {profile.email}
          </div>

          {profile.role === "customer_user" && customers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="customer_id">Organization</Label>
              <Select
                value={watch("customer_id") || ""}
                onValueChange={(value) => setValue("customer_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              disabled={isLoading}
              placeholder="Job title or position"
            />
          </div>

          <div className="pt-4 border-t">
            {!showPasswordForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Change Password</p>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-green-600">Password updated successfully!</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError(null);
                      setPasswordSuccess(false);
                    }}
                    disabled={isPasswordLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPasswordLoading || !newPassword || !confirmPassword}
                    onClick={async () => {
                      setPasswordError(null);
                      setPasswordSuccess(false);
                      
                      if (newPassword.length < 6) {
                        setPasswordError("Password must be at least 6 characters");
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        setPasswordError("Passwords do not match");
                        return;
                      }
                      
                      setIsPasswordLoading(true);
                      const result = await updatePassword(newPassword);
                      setIsPasswordLoading(false);
                      
                      if (result.error) {
                        setPasswordError(result.error);
                      } else {
                        setPasswordSuccess(true);
                        setNewPassword("");
                        setConfirmPassword("");
                        setTimeout(() => {
                          setShowPasswordForm(false);
                          setPasswordSuccess(false);
                        }, 2000);
                      }
                    }}
                  >
                    {isPasswordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground pt-2">
            <span className="font-medium">Role:</span>{" "}
            {profile.role === "admin" ? "Administrator" : 
             profile.role === "staff" ? "Staff" : "Customer User"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
