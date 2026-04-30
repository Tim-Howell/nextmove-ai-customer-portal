"use client";

import Link from "next/link";
import { Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

interface PriorityCardProps {
  id: string;
  title: string;
  icon?: string | null;
  status: string;
  statusLabel: string;
  priorityLevel: string;
  priorityLevelLabel: string;
  customerName?: string;
}

export function PriorityCard({
  id,
  title,
  icon,
  status,
  statusLabel,
  priorityLevel,
  priorityLevelLabel,
  customerName,
}: PriorityCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-rose-100 text-rose-700 hover:bg-rose-100";
      case "medium":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "low":
        return "bg-sky-100 text-sky-700 hover:bg-sky-100";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted";
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "in_progress":
        return "bg-sky-100 text-sky-700 hover:bg-sky-100";
      case "on_hold":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted";
    }
  };

  return (
    <Link href={`/priorities/${id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {icon ? (
                  <DynamicIcon name={icon} className="h-6 w-6 text-primary" />
                ) : (
                  <Flag className="h-6 w-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {title}
                </h3>
                {customerName && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {customerName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={getLevelColor(priorityLevel)}>
                {priorityLevelLabel}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(status)}>
                {statusLabel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
