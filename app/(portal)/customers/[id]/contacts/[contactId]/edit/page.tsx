import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/customers/contact-form";
import type { CustomerContact } from "@/types/database";

interface EditContactPageProps {
  params: Promise<{ id: string; contactId: string }>;
}

async function getContact(contactId: string): Promise<CustomerContact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customer_contacts")
    .select("*")
    .eq("id", contactId)
    .single();

  if (error) {
    console.error("Error fetching contact:", error);
    return null;
  }

  return data;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id, contactId } = await params;
  const contact = await getContact(contactId);

  if (!contact) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm customerId={id} contact={contact} />
    </div>
  );
}
