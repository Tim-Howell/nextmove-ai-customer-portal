"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePortalSettings, uploadLogo } from "@/app/actions/portal-settings";
import { portalSettingsSchema, type PortalSettings, type PortalSettingsFormData } from "@/lib/validations/portal-settings";
import { Upload, Image as ImageIcon } from "lucide-react";

interface PortalBrandingFormProps {
  settings: PortalSettings | null;
}

export function PortalBrandingForm({ settings }: PortalBrandingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PortalSettingsFormData>({
    resolver: zodResolver(portalSettingsSchema),
    defaultValues: {
      organization_name: settings?.organization_name || "",
      website_url: settings?.website_url || "",
      logo_url: settings?.logo_url || "",
      description: settings?.description || "",
      primary_color: settings?.primary_color || "#3b82f6",
      secondary_color: settings?.secondary_color || "#64748b",
    },
  });

  const primaryColor = watch("primary_color");
  const secondaryColor = watch("secondary_color");

  async function onSubmit(data: PortalSettingsFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Include the current logo URL
    data.logo_url = logoUrl;

    const result = await updatePortalSettings(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const result = await uploadLogo(file);

    if (result.error) {
      setError(result.error);
      setIsUploading(false);
    } else if (result.url) {
      setLogoUrl(result.url);
      setValue("logo_url", result.url);
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal Branding</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md">
              Portal settings updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="organization_name">Organization Name *</Label>
            <Input
              id="organization_name"
              {...register("organization_name")}
              disabled={isLoading}
              placeholder="Enter organization name"
            />
            {errors.organization_name && (
              <p className="text-sm text-destructive">{errors.organization_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              {...register("website_url")}
              disabled={isLoading}
              placeholder="https://example.com"
            />
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={isLoading}
              placeholder="Brief description of your organization"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center space-x-4">
              {logoUrl ? (
                <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="Organization logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 border rounded-md flex items-center justify-center bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Logo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, or GIF (max 2MB)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary_color"
                  {...register("primary_color")}
                  disabled={isLoading}
                  placeholder="#3b82f6"
                  className="w-32"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              {errors.primary_color && (
                <p className="text-sm text-destructive">{errors.primary_color.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary_color"
                  {...register("secondary_color")}
                  disabled={isLoading}
                  placeholder="#64748b"
                  className="w-32"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
              {errors.secondary_color && (
                <p className="text-sm text-destructive">{errors.secondary_color.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
