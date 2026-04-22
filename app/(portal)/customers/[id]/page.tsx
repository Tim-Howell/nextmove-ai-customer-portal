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
import { Edit, Plus, User, Check, X } from "lucide-react";
import { DeleteCustomerButton } from "@/components/customers/delete-customer-button";
import { ArchiveCustomerButton } from "@/components/customers/archive-customer-button";
import { DeleteContactButton } from "@/components/customers/delete-contact-button";
import { ContactInvitationStatus } from "@/components/customers/contact-invitation-status";
import { RecordHistory } from "@/components/audit/record-history";
import { getInvitationStatus } from "@/app/actions/invitations";
import type { CustomerWithContacts, CustomerContact, InvitationStatus, CustomerInvitation } from "@/types/database";

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
      secondary_contact:profiles!customers_secondary_contact_id_fkey(id, full_name, email)
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

interface ContactWithStatus extends CustomerContact {
  invitation_status: InvitationStatus;
  invitation: CustomerInvitation | null;
}

async function getCustomerContacts(customerId: string): Promise<ContactWithStatus[]> {
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

  const contactsWithStatus = await Promise.all(
    (data as CustomerContact[]).map(async (contact) => {
      const { status, invitation } = await getInvitationStatus(
        contact.id,
        contact.user_id
      );
      return {
        ...contact,
        invitation_status: status,
        invitation,
      };
    })
  );

  return contactsWithStatus;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const [customer, contacts, profile] = await Promise.all([
    getCustomer(id),
    getCustomerContacts(id),
    getProfile(),
  ]);

  if (!customer) {
    notFound();
  }

  const isAdmin = profile?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">{customer.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-2 ${
              customer.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {customer.status}
          </span>
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
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {customer.notes || "No notes"}
            </p>
          </CardContent>
        </Card>
      </div>

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
            <p className="text-sm text-muted-foreground text-center py-8">
              No contacts yet. Add a contact to get started.
            </p>
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
                        status={contact.invitation_status}
                        invitation={contact.invitation}
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

      {isInternal && (
        <RecordHistory
          tableName="customers"
          recordId={id}
          title="Change History"
        />
      )}
    </div>
  );
}
