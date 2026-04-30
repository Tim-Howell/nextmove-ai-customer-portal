"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hosts allowlisted in next.config.ts → can use next/image.
// Anything else falls back to a plain <img> so arbitrary user-provided
// URLs never crash the page.
const NEXT_IMAGE_HOSTS = ["cgzuyvnhhbqwppvsfzrd.supabase.co"];

function canUseNextImage(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return NEXT_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

interface CustomerCardProps {
  id: string;
  name: string;
  status: string;
  logoUrl?: string | null;
  website?: string | null;
}

export function CustomerCard({ id, name, status, logoUrl, website }: CustomerCardProps) {
  return (
    <Link href={`/customers/${id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-background shadow-sm group-hover:ring-primary/20 transition-all">
              {logoUrl ? (
                canUseNextImage(logoUrl) ? (
                  <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )
              ) : (
                <Building2 className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {name}
              </h3>
              
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className={
                  status === "active"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }
              >
                {status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
