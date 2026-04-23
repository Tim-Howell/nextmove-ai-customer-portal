import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGrid } from "@/components/ui/card-grid";
import { CustomerCard } from "@/components/customers/customer-card";
import type { CustomerWithContacts } from "@/types/database";
import { getShowDemoData } from "@/app/actions/settings";
import { ShowArchivedToggle } from "@/components/ui/show-archived-toggle";

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    showArchived?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

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

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers found"
        description={search ? "Try adjusting your search or filters" : "Get started by adding your first customer"}
        action={!search ? { label: "Add Customer", href: "/customers/new" } : undefined}
      />
    );
  }

  return (
    <>
      <CardGrid>
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            status={customer.status}
            logoUrl={customer.logo_url}
            website={customer.website}
          />
        ))}
      </CardGrid>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
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
