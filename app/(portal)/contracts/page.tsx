import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getContracts } from "@/app/actions/contracts";
import { getReferenceValues } from "@/app/actions/reference";
import { getProfile } from "@/lib/supabase/profile";
import type { ContractWithRelations, ReferenceValue, Customer } from "@/types/database";
import { isHourBasedContract } from "@/lib/validations/contract";
import { ContractsFilter } from "@/components/contracts/contracts-filter";
import { ArchiveContractButton } from "@/components/contracts/archive-contract-button";

interface ContractsPageProps {
  searchParams: Promise<{
    customerId?: string;
    statusId?: string;
  }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("status", "active")
    .order("name");
  return (data || []) as Customer[];
}

function getStatusBadgeVariant(statusValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (statusValue) {
    case "active":
      return "default";
    case "draft":
      return "secondary";
    case "expired":
    case "closed":
      return "outline";
    default:
      return "secondary";
  }
}

function ContractListContent({
  contracts,
  isInternal,
}: {
  contracts: ContractWithRelations[];
  isInternal: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contract Name</TableHead>
          {isInternal && <TableHead>Customer</TableHead>}
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Hours</TableHead>
          {isInternal && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isInternal ? 6 : 4} className="text-center text-muted-foreground">
              No contracts found
            </TableCell>
          </TableRow>
        ) : (
          contracts.map((contract) => {
            const isHourBased = contract.contract_type?.value
              ? isHourBasedContract(contract.contract_type.value)
              : false;
            return (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/contracts/${contract.id}`}
                    className="hover:underline"
                  >
                    {contract.name}
                  </Link>
                </TableCell>
                {isInternal && (
                  <TableCell>
                    <Link
                      href={`/customers/${contract.customer?.id}`}
                      className="hover:underline text-muted-foreground"
                    >
                      {contract.customer?.name || "—"}
                    </Link>
                  </TableCell>
                )}
                <TableCell>{contract.contract_type?.label || "—"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(contract.status?.value || "")}>
                    {contract.status?.label || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isHourBased && contract.total_hours ? (
                    <span>
                      {contract.hours_used?.toFixed(1) || 0} / {contract.total_hours}
                      {contract.hours_remaining != null && contract.hours_remaining < 0 && (
                        <span className="text-destructive ml-1">(over)</span>
                      )}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                {isInternal && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/contracts/${contract.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <ArchiveContractButton
                        contractId={contract.id}
                        contractName={contract.name}
                        isArchived={contract.status?.value === "archived"}
                        variant="icon"
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const params = await searchParams;
  const customerId = params.customerId;
  const statusId = params.statusId;

  const [{ data: contracts }, statuses, customers, profile] = await Promise.all([
    getContracts({ customerId, statusId }),
    getReferenceValues("contract_status"),
    getCustomers(),
    getProfile(),
  ]);

  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contracts</h1>
          <p className="text-muted-foreground">
            {isInternal
              ? "Manage customer contracts and agreements"
              : "View your contracts and agreements"}
          </p>
        </div>
        {isInternal && (
          <Link href="/contracts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Contract
            </Button>
          </Link>
        )}
      </div>

      <ContractsFilter
        customers={customers}
        statuses={statuses}
        currentCustomerId={customerId}
        currentStatusId={statusId}
        isInternal={isInternal}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <ContractListContent contracts={contracts} isInternal={isInternal} />
      </Suspense>
    </div>
  );
}
