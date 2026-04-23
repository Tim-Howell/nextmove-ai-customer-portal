import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RequestForm } from "@/components/requests/request-form";
import { getRequest } from "@/app/actions/requests";
import { getReferenceValues } from "@/app/actions/reference";
import { getShowDemoData } from "@/app/actions/settings";
import type { Customer } from "@/types/database";

interface EditRequestPageProps {
  params: Promise<{ id: string }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();
  
  let query = supabase
    .from("customers")
    .select("id, name, is_demo")
    .eq("status", "active")
    .order("name");
  
  if (!showDemoData) {
    query = query.eq("is_demo", false);
  }
  
  const { data } = await query;
  return (data || []) as Customer[];
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

export default async function EditRequestPage({ params }: EditRequestPageProps) {
  const { id } = await params;
  const userRole = await getCurrentUserRole();
  
  // Only internal users can edit requests
  if (userRole !== "admin" && userRole !== "staff") {
    redirect("/requests");
  }

  const [{ data: request }, customers, statuses] = await Promise.all([
    getRequest(id),
    getCustomers(),
    getReferenceValues("request_status"),
  ]);

  if (!request) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <RequestForm
        request={request}
        customers={customers}
        statuses={statuses}
        isInternal={true}
      />
    </div>
  );
}
