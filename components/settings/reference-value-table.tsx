"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { updateReferenceValue, deleteReferenceValue } from "@/app/actions/reference";
import { EditReferenceValueDialog } from "./edit-reference-value-dialog";
import type { ReferenceValue, ReferenceValueType } from "@/types/database";

interface ReferenceValueTableProps {
  values: ReferenceValue[];
  type: ReferenceValueType;
}

export function ReferenceValueTable({ values, type }: ReferenceValueTableProps) {
  const [editingValue, setEditingValue] = useState<ReferenceValue | null>(null);

  async function handleToggleActive(id: string, currentActive: boolean) {
    await updateReferenceValue(id, { is_active: !currentActive });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this value?")) {
      await deleteReferenceValue(id);
    }
  }

  if (values.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No values defined yet
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((value) => (
            <TableRow key={value.id}>
              <TableCell className="font-medium">
                {value.label}
                {value.is_demo && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Demo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="font-mono text-sm">{value.value}</TableCell>
              <TableCell>{value.sort_order}</TableCell>
              <TableCell>
                {value.is_default && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </TableCell>
              <TableCell>
                <Switch
                  checked={value.is_active}
                  onCheckedChange={() =>
                    handleToggleActive(value.id, value.is_active)
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingValue(value)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(value.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingValue && (
        <EditReferenceValueDialog
          value={editingValue}
          open={!!editingValue}
          onOpenChange={(open: boolean) => !open && setEditingValue(null)}
        />
      )}
    </>
  );
}
