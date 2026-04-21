import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Flag, Calendar } from "lucide-react";
import { getPriority } from "@/app/actions/priorities";
import { DeletePriorityButton } from "@/components/priorities/delete-priority-button";
import { createClient } from "@/lib/supabase/server";

interface PriorityDetailPageProps {
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

function getPriorityLevelBadgeVariant(levelValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (levelValue) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "outline";
  }
}

function getStatusBadgeVariant(statusValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (statusValue) {
    case "active":
      return "default";
    case "next_up":
      return "secondary";
    case "complete":
      return "outline";
    case "on_hold":
      return "destructive";
    default:
      return "secondary";
  }
}

export default async function PriorityDetailPage({ params }: PriorityDetailPageProps) {
  const { id } = await params;
  const [{ data: priority }, userRole] = await Promise.all([
    getPriority(id),
    getCurrentUserRole(),
  ]);

  if (!priority) {
    notFound();
  }

  const isInternal = userRole === "admin" || userRole === "staff";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/priorities">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">{priority.title}</h1>
            <p className="text-muted-foreground">
              <Link href={`/customers/${priority.customer?.id}`} className="hover:underline">
                {priority.customer?.name}
              </Link>
            </p>
          </div>
        </div>
        {isInternal && (
          <div className="flex gap-2">
            <Link href={`/priorities/${id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <DeletePriorityButton priorityId={id} priorityTitle={priority.title} />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Priority Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusBadgeVariant(priority.status?.value || "")}>
                  {priority.status?.label || "—"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority Level</p>
                <Badge variant={getPriorityLevelBadgeVariant(priority.priority_level?.value || "")}>
                  {priority.priority_level?.label || "—"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {priority.due_date
                    ? new Date(priority.due_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{priority.creator?.full_name || "—"}</p>
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
                  {new Date(priority.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(priority.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {priority.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{priority.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
