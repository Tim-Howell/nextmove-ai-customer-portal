"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Archive } from "lucide-react";

interface ShowArchivedToggleProps {
  showArchived: boolean;
}

export function ShowArchivedToggle({ showArchived }: ShowArchivedToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleToggle(checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (checked) {
      params.set("showArchived", "true");
    } else {
      params.delete("showArchived");
    }
    
    // Reset to page 1 when toggling
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="show-archived"
        checked={showArchived}
        onCheckedChange={handleToggle}
      />
      <Label 
        htmlFor="show-archived" 
        className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
      >
        <Archive className="h-4 w-4" />
        Show Archived
      </Label>
    </div>
  );
}
