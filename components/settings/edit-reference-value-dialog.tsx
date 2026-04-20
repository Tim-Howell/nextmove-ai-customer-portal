"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { referenceValueSchema, type ReferenceValueFormData } from "@/lib/validations/reference";
import { updateReferenceValue } from "@/app/actions/reference";
import type { ReferenceValue } from "@/types/database";

interface EditReferenceValueDialogProps {
  value: ReferenceValue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditReferenceValueDialog({
  value,
  open,
  onOpenChange,
}: EditReferenceValueDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReferenceValueFormData>({
    resolver: zodResolver(referenceValueSchema),
    defaultValues: {
      type: value.type,
      value: value.value,
      label: value.label,
      sort_order: value.sort_order,
      is_active: value.is_active,
      is_default: value.is_default,
      is_demo: value.is_demo,
    },
  });

  const isDefault = watch("is_default");
  const isDemo = watch("is_demo");

  async function onSubmit(data: ReferenceValueFormData) {
    setIsLoading(true);
    setError(null);

    const result = await updateReferenceValue(value.id, data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reference Value</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              {...register("label")}
              disabled={isLoading}
            />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (internal)</Label>
            <Input
              id="value"
              {...register("value")}
              disabled={isLoading}
              className="font-mono"
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              {...register("sort_order", { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={isDefault}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setValue("is_default", checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="is_default" className="font-normal">
              Default value for new records
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_demo"
              checked={isDemo}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setValue("is_demo", checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="is_demo" className="font-normal">
              Demo data
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
