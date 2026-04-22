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
import { archiveContract, unarchiveContract } from "@/app/actions/contracts";
import { showSuccess, showError } from "@/lib/toast";

interface ArchiveContractButtonProps {
  contractId: string;
  contractName: string;
  isArchived: boolean;
  variant?: "default" | "icon";
}

export function ArchiveContractButton({ 
  contractId, 
  contractName, 
  isArchived,
  variant = "default" 
}: ArchiveContractButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction() {
    setIsLoading(true);
    setError(null);
    
    const result = isArchived 
      ? await unarchiveContract(contractId)
      : await archiveContract(contractId);
    
    if (result?.error) {
      setError(result.error);
      showError(result.error);
      setIsLoading(false);
    } else {
      showSuccess(isArchived ? "Contract restored successfully" : "Contract archived successfully");
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
          <AlertDialogTitle>{actionText} Contract</AlertDialogTitle>
          <AlertDialogDescription>
            {isArchived 
              ? `Are you sure you want to restore "${contractName}"? It will appear in dropdown lists again.`
              : `Are you sure you want to archive "${contractName}"? It will be hidden from dropdown lists but the data will be preserved.`
            }
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
