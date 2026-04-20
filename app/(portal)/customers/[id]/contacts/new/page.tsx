import { ContactForm } from "@/components/customers/contact-form";

interface NewContactPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewContactPage({ params }: NewContactPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm customerId={id} />
    </div>
  );
}
