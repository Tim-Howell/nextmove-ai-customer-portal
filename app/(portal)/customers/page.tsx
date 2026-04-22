import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Image as ImageIcon, Archive } from "lucide-react";
import type { CustomerWithContacts } from "@/types/database";
import { getShowDemoData } from "@/app/actions/settings";
import { ArchiveCustomerButton } from "@/components/customers/archive-customer-button";
import { ShowArchivedToggle } from "@/components/ui/show-archived-toggle";

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    showArchived?: string;
  }>;
}

const ITEMS_PER_PAGE = 10;

async function getCustomers(
  search?: string,
  status?: string,
  page: number = 1,
  showDemoData: boolean = false,
  showArchived: boolean = false
): Promise<{ customers: CustomerWithContacts[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  } else if (!showArchived) {
    // If not filtering by status and not showing archived, exclude archived
    query = query.is("archived_at", null);
  }

  if (!showDemoData) {
    query = query.eq("is_demo", false);
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching customers:", error);
    return { customers: [], total: 0 };
  }

  return { customers: data as CustomerWithContacts[], total: count || 0 };
}

function CustomerListContent({
  customers,
  total,
  currentPage,
  search,
  status,
}: {
  customers: CustomerWithContacts[];
  total: number;
  currentPage: number;
  search?: string;
  status?: string;
}) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => {
              const isArchived = customer.archived_at !== null || customer.status === "archived";
              return (
              <TableRow key={customer.id} className={isArchived ? "opacity-60" : ""}>
                <TableCell>
                  {customer.logo_url ? (
                    <img
                      src={customer.logo_url}
                      alt={`${customer.name} logo`}
                      className="w-8 h-8 object-contain rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="hover:underline"
                  >
                    {customer.name}
                  </Link>
                  {isArchived && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Archived
                    </Badge>
                  )}
                  {customer.is_demo && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Demo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-700"
                        : customer.status === "archived"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/customers/${customer.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <ArchiveCustomerButton
                      customerId={customer.id}
                      customerName={customer.name}
                      isArchived={customer.status === "archived"}
                      variant="icon"
                    />
                  </div>
                </TableCell>
              </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} customers
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/customers?page=${currentPage - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
              >
                <Button variant="outline" size="sm">
                  Previous
                </Button>
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/customers?page=${currentPage + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
              >
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const search = params.search;
  const status = params.status;
  const page = parseInt(params.page || "1", 10);
  const showArchived = params.showArchived === "true";
  const showDemoData = await getShowDemoData();

  const { customers, total } = await getCustomers(search, status, page, showDemoData, showArchived);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer accounts
          </p>
        </div>
        <Link href="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <form className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search customers..."
              defaultValue={search}
              className="pl-9"
            />
          </div>
        </form>
        <form>
          <input type="hidden" name="search" value={search || ""} />
          <Select name="status" defaultValue={status || "all"}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </form>
        <ShowArchivedToggle showArchived={showArchived} />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CustomerListContent
          customers={customers}
          total={total}
          currentPage={page}
          search={search}
          status={status}
        />
      </Suspense>
    </div>
  );
}
