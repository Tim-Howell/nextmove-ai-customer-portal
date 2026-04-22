import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import { getAuditLogs, getAuditableTableNames, getAuditUsers } from "@/app/actions/audit";
import { AuditLogTable } from "@/components/audit/audit-log-table";
import { AuditLogFilters } from "@/components/audit/audit-log-filters";
import type { AuditAction } from "@/types/database";

interface AuditLogPageProps {
  searchParams: Promise<{
    tableName?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
}

export default async function AuditLogPage({ searchParams }: AuditLogPageProps) {
  const profile = await getProfile();

  // Admin only
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const [auditResult, tableNames, users] = await Promise.all([
    getAuditLogs({
      tableName: params.tableName,
      action: params.action as AuditAction | undefined,
      userId: params.userId,
      startDate: params.startDate,
      endDate: params.endDate,
      page,
    }),
    getAuditableTableNames(),
    getAuditUsers(),
  ]);

  if (auditResult.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Audit Log</h1>
          <p className="text-muted-foreground">
            Track all changes made in the portal
          </p>
        </div>
        <div className="p-4 text-destructive bg-destructive/10 rounded-md">
          {auditResult.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Audit Log</h1>
        <p className="text-muted-foreground">
          Track all changes made in the portal
        </p>
      </div>

      <AuditLogFilters
        tableNames={tableNames}
        users={users}
        currentFilters={{
          tableName: params.tableName,
          action: params.action,
          userId: params.userId,
          startDate: params.startDate,
          endDate: params.endDate,
        }}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <AuditLogTable
          logs={auditResult.data!.data}
          pagination={{
            page: auditResult.data!.page,
            pageSize: auditResult.data!.pageSize,
            total: auditResult.data!.total,
            totalPages: auditResult.data!.totalPages,
          }}
        />
      </Suspense>
    </div>
  );
}
