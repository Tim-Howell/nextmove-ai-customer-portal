import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, User, Check, X, Users, Globe, Receipt, Phone, FileText, Flag, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteCustomerButton } from "@/components/customers/delete-customer-button";
import { ArchiveCustomerButton } from "@/components/customers/archive-customer-button";
import { DeleteContactButton } from "@/components/customers/delete-contact-button";
import { ContactInvitationStatus } from "@/components/customers/contact-invitation-status";
import { InternalNotesSection } from "@/components/internal-notes";
import { CustomerSummaryCards } from "@/components/customers/customer-summary-cards";
import type { CustomerWithContacts, CustomerContact } from "@/types/database";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getCustomer(id: string): Promise<CustomerWithContacts | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      primary_contact:profiles!customers_primary_contact_id_fkey(id, full_name, email),
      secondary_contact:profiles!customers_secondary_contact_id_fkey(id, full_name, email),
      billing_contact_primary:customer_contacts!customers_billing_contact_primary_id_fkey(id, full_name, email),
      billing_contact_secondary:customer_contacts!customers_billing_contact_secondary_id_fkey(id, full_name, email),
      poc_primary:customer_contacts!customers_poc_primary_id_fkey(id, full_name, email),
      poc_secondary:customer_contacts!customers_poc_secondary_id_fkey(id, full_name, email)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  return data as CustomerWithContacts;
}

async function getCustomerContacts(customerId: string): Promise<CustomerContact[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customer_contacts")
    .select("*")
    .eq("customer_id", customerId)
    .order("full_name");

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  return data as CustomerContact[];
}

async function getActiveContracts(customerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select(`
      id,
      name,
      status:reference_values!contracts_status_id_fkey(value, label),
      contract_type:contract_types(label)
    `)
    .eq("customer_id", customerId)
    .is("archived_at", null)
    .order("name");

  if (error) {
    console.error("Error fetching contracts:", error);
    return [];
  }

  return data;
}

async function getActivePriorities(customerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("priorities")
    .select(`
      id,
      title,
      icon,
      status:reference_values!priorities_status_id_fkey(value, label),
      priority_level:reference_values!priorities_priority_level_id_fkey(value, label)
    `)
    .eq("customer_id", customerId)
    .eq("is_read_only", false)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching priorities:", error);
    return [];
  }

  return data;
}

async function getActiveRequests(customerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select(`
      id,
      title,
      status:reference_values!requests_status_id_fkey(value, label)
    `)
    .eq("customer_id", customerId)
    .eq("is_read_only", false)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }

  return data;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const [customer, contacts, contracts, priorities, requests, profile] = await Promise.all([
    getCustomer(id),
    getCustomerContacts(id),
    getActiveContracts(id),
    getActivePriorities(id),
    getActiveRequests(id),
    getProfile(),
  ]);

  if (!customer) {
    notFound();
  }

  const isAdmin = profile?.role === "admin";
  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">{customer.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                customer.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {customer.status}
            </span>
            {customer.website && (
              <a
                href={customer.website.startsWith("http") ? customer.website : `https://${customer.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                {customer.website}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/customers/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <ArchiveCustomerButton
            customerId={id}
            customerName={customer.name}
            isArchived={customer.status === "archived"}
          />
          {isAdmin && <DeleteCustomerButton customerId={id} customerName={customer.name} />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              NextMove AI Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Primary Contact
              </p>
              <p className="text-sm">
                {customer.primary_contact?.full_name ||
                  customer.primary_contact?.email ||
                  "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Secondary Contact
              </p>
              <p className="text-sm">
                {customer.secondary_contact?.full_name ||
                  customer.secondary_contact?.email ||
                  "Not assigned"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {customer.notes || "No description"}
            </p>
          </CardContent>
        </Card>

        {(customer.poc_primary || customer.poc_secondary) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Points of Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.poc_primary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Primary
                  </p>
                  <p className="text-sm">
                    {customer.poc_primary.full_name}
                    {customer.poc_primary.email && (
                      <span className="text-muted-foreground ml-2">
                        ({customer.poc_primary.email})
                      </span>
                    )}
                  </p>
                </div>
              )}
              {customer.poc_secondary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Secondary
                  </p>
                  <p className="text-sm">
                    {customer.poc_secondary.full_name}
                    {customer.poc_secondary.email && (
                      <span className="text-muted-foreground ml-2">
                        ({customer.poc_secondary.email})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(customer.billing_contact_primary || customer.billing_contact_secondary) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Billing Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.billing_contact_primary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Primary
                  </p>
                  <p className="text-sm">
                    {customer.billing_contact_primary.full_name}
                    {customer.billing_contact_primary.email && (
                      <span className="text-muted-foreground ml-2">
                        ({customer.billing_contact_primary.email})
                      </span>
                    )}
                  </p>
                </div>
              )}
              {customer.billing_contact_secondary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Secondary
                  </p>
                  <p className="text-sm">
                    {customer.billing_contact_secondary.full_name}
                    {customer.billing_contact_secondary.email && (
                      <span className="text-muted-foreground ml-2">
                        ({customer.billing_contact_secondary.email})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isInternal && <CustomerSummaryCards customerId={id} />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Contacts</CardTitle>
          <Link href={`/customers/${id}/contacts/new`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No contacts yet"
              description="Add a contact to enable portal access for this customer"
              action={{ label: "Add Contact", href: `/customers/${id}/contacts/new` }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.full_name}
                    </TableCell>
                    <TableCell>{contact.title || "—"}</TableCell>
                    <TableCell>{contact.email || "—"}</TableCell>
                    <TableCell>{contact.phone || "—"}</TableCell>
                    <TableCell>
                      {contact.is_active ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <ContactInvitationStatus
                        contactId={contact.id}
                        email={contact.email}
                        portalAccessEnabled={contact.portal_access_enabled}
                        hasUserId={!!contact.user_id}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/customers/${id}/contacts/${contact.id}/edit`}
                        >
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <DeleteContactButton
                          customerId={id}
                          contactId={contact.id}
                          contactName={contact.full_name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contracts
          </CardTitle>
          <Link href={`/contracts/new?customerId=${id}`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Contract
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No contracts yet"
              description="Add a contract to track hours and billing"
              action={{ label: "Add Contract", href: `/contracts/new?customerId=${id}` }}
            />
          ) : (
            <div className="space-y-2">
              {contracts.map((contract) => {
                const status = Array.isArray(contract.status) ? contract.status[0] : contract.status;
                const contractType = Array.isArray(contract.contract_type) ? contract.contract_type[0] : contract.contract_type;
                return (
                  <Link
                    key={contract.id}
                    href={`/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{contract.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contractType?.label || "Unknown type"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        status?.value === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status?.label || "Unknown"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Recent Priorities
          </CardTitle>
          <Link href={`/priorities/new?customerId=${id}`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Priority
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {priorities.length === 0 ? (
            <EmptyState
              icon={Flag}
              title="No priorities yet"
              description="Add a priority to track important work items"
              action={{ label: "Add Priority", href: `/priorities/new?customerId=${id}` }}
            />
          ) : (
            <div className="space-y-2">
              {priorities.map((priority) => {
                const status = Array.isArray(priority.status) ? priority.status[0] : priority.status;
                const level = Array.isArray(priority.priority_level) ? priority.priority_level[0] : priority.priority_level;
                return (
                  <Link
                    key={priority.id}
                    href={`/priorities/${priority.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{priority.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          level?.value === "high"
                            ? "bg-red-100 text-red-700"
                            : level?.value === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {level?.label || "Normal"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {status?.label || "Unknown"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Requests
          </CardTitle>
          <Link href={`/requests/new?customerId=${id}`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Request
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No requests yet"
              description="Add a request to track customer asks"
              action={{ label: "Add Request", href: `/requests/new?customerId=${id}` }}
            />
          ) : (
            <div className="space-y-2">
              {requests.map((request) => {
                const status = Array.isArray(request.status) ? request.status[0] : request.status;
                return (
                  <Link
                    key={request.id}
                    href={`/requests/${request.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <p className="font-medium">{request.title}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        status?.value === "completed"
                          ? "bg-green-100 text-green-700"
                          : status?.value === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status?.label || "Unknown"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {isInternal && (
        <InternalNotesSection entityType="customer" entityId={id} />
      )}

    </div>
  );
}
