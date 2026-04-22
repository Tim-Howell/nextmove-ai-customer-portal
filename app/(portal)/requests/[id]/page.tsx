import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, MessageSquare, Calendar, Lock } from "lucide-react";
import { getRequest } from "@/app/actions/requests";
import { DeleteRequestButton } from "@/components/requests/delete-request-button";
import { RecordHistory } from "@/components/audit/record-history";
import { createClient } from "@/lib/supabase/server";

interface RequestDetailPageProps {
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
    case "new":
      return "default";
    case "in_review":
      return "secondary";
    case "in_progress":
      return "default";
    case "closed":
      return "outline";
    default:
      return "secondary";
  }
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params;
  const [{ data: request }, userRole] = await Promise.all([
    getRequest(id),
    getCurrentUserRole(),
  ]);

  if (!request) {
    notFound();
  }

  const isInternal = userRole === "admin" || userRole === "staff";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">{request.title}</h1>
            <p className="text-muted-foreground">
              <Link href={`/customers/${request.customer?.id}`} className="hover:underline">
                {request.customer?.name}
              </Link>
            </p>
          </div>
        </div>
        {isInternal && (
          <div className="flex gap-2">
            <Link href={`/requests/${id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <DeleteRequestButton requestId={id} requestTitle={request.title} />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusBadgeVariant(request.status?.value || "")}>
                  {request.status?.label || "—"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted By</p>
                <p className="font-medium">{request.submitter?.full_name || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(request.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {request.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{request.description}</p>
          </CardContent>
        </Card>
      )}

      {isInternal && request.internal_notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Internal Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{request.internal_notes}</p>
          </CardContent>
        </Card>
      )}

      {isInternal && (
        <RecordHistory
          tableName="requests"
          recordId={id}
          title="Change History"
        />
      )}
    </div>
  );
}
