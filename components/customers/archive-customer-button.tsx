"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Archive, ArchiveRestore } from "lucide-react";
import { archiveCustomer, unarchiveCustomer } from "@/app/actions/customers";

interface ArchiveCustomerButtonProps {
  customerId: string;
  customerName: string;
  isArchived: boolean;
  variant?: "default" | "icon";
}

export function ArchiveCustomerButton({ 
  customerId, 
  customerName, 
  isArchived,
  variant = "default" 
}: ArchiveCustomerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction() {
    setIsLoading(true);
    setError(null);
    
    const result = isArchived 
      ? await unarchiveCustomer(customerId)
      : await archiveCustomer(customerId);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.refresh();
    }
  }

  const Icon = isArchived ? ArchiveRestore : Archive;
  const actionText = isArchived ? "Restore" : "Archive";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Button variant="outline">
            <Icon className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionText} Customer</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {isArchived ? (
                <p>Are you sure you want to restore &quot;{customerName}&quot;? They will appear in dropdown lists again.</p>
              ) : (
                <>
                  <p>Are you sure you want to archive &quot;{customerName}&quot;?</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
                    <p className="font-medium mb-1">This will also:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Archive all contracts for this customer</li>
                      <li>Disable portal access for all contacts</li>
                      <li>Mark all priorities as read-only</li>
                      <li>Mark all requests as read-only</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground">Data will be preserved but hidden from dropdown lists.</p>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? `${actionText}ing...` : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
