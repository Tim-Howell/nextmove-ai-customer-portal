"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, History, User } from "lucide-react";
import type { AuditLogWithUser, AuditAction } from "@/types/database";
import { getAuditLogForRecord } from "@/app/actions/audit";

interface RecordHistoryProps {
  tableName: string;
  recordId: string;
  title?: string;
}

const ACTION_COLORS: Record<AuditAction, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  archive: "bg-amber-100 text-amber-700",
  restore: "bg-purple-100 text-purple-700",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function HistoryEntry({ log }: { log: AuditLogWithUser }) {
  const [showDetails, setShowDetails] = useState(false);
  const changedFields = log.changed_fields || [];

  return (
    <div className="border-l-2 border-muted pl-4 pb-4 last:pb-0">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                ACTION_COLORS[log.action]
              }`}
            >
              {log.action}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatTimeAgo(new Date(log.created_at))}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{log.user?.full_name || log.user_email || "System"}</span>
          </div>
          {changedFields.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Changed: {changedFields.join(", ")}
            </p>
          )}
        </div>
        {(log.old_values || log.new_values) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {showDetails && (log.old_values || log.new_values) && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          {log.old_values && (
            <div>
              <p className="font-medium mb-1">Before</p>
              <pre className="bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(filterDisplayFields(log.old_values), null, 2)}
              </pre>
            </div>
          )}
          {log.new_values && (
            <div>
              <p className="font-medium mb-1">After</p>
              <pre className="bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(filterDisplayFields(log.new_values), null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function filterDisplayFields(
  values: Record<string, unknown>
): Record<string, unknown> {
  const excludeFields = [
    "id",
    "created_at",
    "updated_at",
    "created_by",
    "updated_by",
  ];
  const filtered: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(values)) {
    if (!excludeFields.includes(key) && value !== null) {
      filtered[key] = value;
    }
  }

  return filtered;
}

export function RecordHistory({
  tableName,
  recordId,
  title = "History",
}: RecordHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !loaded) {
      setLoading(true);
      getAuditLogForRecord(tableName, recordId)
        .then((result) => {
          if (result.data) {
            setLogs(result.data);
          }
          setLoaded(true);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, loaded, tableName, recordId]);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            {title}
            {logs.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {logs.length}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history available</p>
          ) : (
            <div className="space-y-0">
              {logs.map((log) => (
                <HistoryEntry key={log.id} log={log} />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
