"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  user: {
    email: string;
    full_name: string | null;
  };
  customerName?: string | null;
  onMenuClick?: () => void;
}

export function Header({ user, customerName, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {customerName && (
          <span className="text-sm font-medium text-muted-foreground">
            {customerName}
          </span>
        )}

        <div className="flex-1" />

        <UserMenu 
          userName={user.full_name || ""} 
          userEmail={user.email} 
        />
      </div>
    </header>
  );
}
