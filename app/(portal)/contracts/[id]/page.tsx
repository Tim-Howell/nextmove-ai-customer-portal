import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, FileText, Clock } from "lucide-react";
import { getContract, getContractDocuments } from "@/app/actions/contracts";
import { getTimeEntries } from "@/app/actions/time-entries";
import { isHourBasedContract } from "@/lib/validations/contract";
import { DeleteContractButton } from "@/components/contracts/delete-contract-button";
import { ContractDocuments } from "@/components/contracts/contract-documents";
import { createClient } from "@/lib/supabase/server";

interface ContractDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getCurrentUserRole(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "customer_user";
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  return profile?.role || "customer_user";
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

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { id } = await params;
  const [{ data: contract }, { data: documents }, { data: timeEntries }, userRole] = await Promise.all([
    getContract(id),
    getContractDocuments(id),
    getTimeEntries({ contractId: id }),
    getCurrentUserRole(),
  ]);

  if (!contract) {
    notFound();
  }

  const isInternal = userRole === "admin" || userRole === "staff";
  const isAdmin = userRole === "admin";
  const isHourBased = contract.contract_type?.value
    ? isHourBasedContract(contract.contract_type.value)
    : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">{contract.name}</h1>
            <p className="text-muted-foreground">
              <Link href={`/customers/${contract.customer?.id}`} className="hover:underline">
                {contract.customer?.name}
              </Link>
            </p>
          </div>
        </div>
        {isInternal && (
          <div className="flex gap-2">
            <Link href={`/contracts/${id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            {isAdmin && <DeleteContractButton contractId={id} contractName={contract.name} />}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{contract.contract_type?.label || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusBadgeVariant(contract.status?.value || "")}>
                  {contract.status?.label || "—"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {contract.start_date
                    ? new Date(contract.start_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {contract.end_date
                    ? new Date(contract.end_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
            {contract.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap">{contract.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {isHourBased && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hours Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{contract.total_hours || 0}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{contract.hours_used?.toFixed(1) || 0}</p>
                  <p className="text-sm text-muted-foreground">Used</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${(contract.hours_remaining ?? 0) < 0 ? "text-destructive" : ""}`}>
                    {contract.hours_remaining?.toFixed(1) ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
              {contract.total_hours && (
                <div className="mt-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${(contract.hours_remaining ?? 0) < 0 ? "bg-destructive" : "bg-primary"}`}
                      style={{
                        width: `${Math.min(100, ((contract.hours_used || 0) / contract.total_hours) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <ContractDocuments
        contractId={id}
        documents={documents}
        isInternal={isInternal}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Time Entries</CardTitle>
          {isInternal && (
            <Link href={`/time-logs/new?contractId=${id}&customerId=${contract.customer_id}`}>
              <Button size="sm">Log Time</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No time entries for this contract
                  </TableCell>
                </TableRow>
              ) : (
                timeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.staff?.full_name || "—"}</TableCell>
                    <TableCell>{entry.category?.label || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.description || "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(entry.hours).toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
