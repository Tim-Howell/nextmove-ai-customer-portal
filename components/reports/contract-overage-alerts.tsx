"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export interface ContractOverageInfo {
  id: string;
  name: string;
  customer_name: string;
  contract_type_label: string;
  hours_used: number;
  hours_limit: number;
  hours_over: number;
  is_subscription: boolean;
}

interface ContractOverageAlertsProps {
  overages: ContractOverageInfo[];
}

export function ContractOverageAlerts({ overages }: ContractOverageAlertsProps) {
  if (overages.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          Contracts Over Limit ({overages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {overages.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100"
            >
              <div>
                <Link
                  href={`/contracts/${contract.id}`}
                  className="font-medium text-amber-900 hover:underline"
                >
                  {contract.name}
                </Link>
                <p className="text-sm text-amber-700">{contract.customer_name}</p>
              </div>
              <div className="text-right">
                <Badge variant="destructive">
                  {contract.hours_over.toFixed(1)} hrs over
                </Badge>
                <p className="text-xs text-amber-600 mt-1">
                  {contract.hours_used.toFixed(1)} / {contract.hours_limit.toFixed(1)} hrs
                  {contract.is_subscription && " this period"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
