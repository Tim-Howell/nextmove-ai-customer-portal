import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getShowDemoData } from "@/app/actions/settings";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  is_active: boolean;
  portal_access_enabled: boolean;
  customer: {
    id: string;
    name: string;
    is_demo: boolean;
  } | null;
}

async function getContacts(): Promise<Contact[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  let query = supabase
    .from("customer_contacts")
    .select(`
      id,
      full_name,
      email,
      phone,
      title,
      is_active,
      portal_access_enabled,
      customer:customers!customer_contacts_customer_id_fkey(id, name, is_demo)
    `)
    .order("full_name");

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  let contacts = (data || []) as Contact[];
  
  // Filter demo data if toggle is off
  if (!showDemoData) {
    contacts = contacts.filter(c => !c.customer?.is_demo);
  }

  return contacts;
}

export default async function ContactsPage() {
  const profile = await getProfile();
  
  // Only staff and admins can access this page
  if (profile?.role !== "admin" && profile?.role !== "staff") {
    redirect("/dashboard");
  }

  const contacts = await getContacts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">All Contacts</h1>
        <p className="text-muted-foreground">
          View all customer contacts across all customers
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-0">
                <EmptyState
                  icon={Users}
                  title="No contacts found"
                  description="No customer contacts have been created yet"
                />
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/customers/${contact.customer?.id}/contacts/${contact.id}/edit`}
                    className="hover:underline"
                  >
                    {contact.full_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/customers/${contact.customer?.id}`}
                    className="hover:underline text-muted-foreground"
                  >
                    {contact.customer?.name || "—"}
                  </Link>
                </TableCell>
                <TableCell>{contact.title || "—"}</TableCell>
                <TableCell>
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell>{contact.phone || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {contact.portal_access_enabled && (
                      <Badge variant="default" className="text-xs">
                        Portal
                      </Badge>
                    )}
                    {!contact.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
