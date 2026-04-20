"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import {
  referenceValueSchema,
  referenceValueTypes,
  referenceTypeLabels,
  type ReferenceValueFormData,
} from "@/lib/validations/reference";
import { createReferenceValue } from "@/app/actions/reference";

export function AddReferenceValueButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReferenceValueFormData>({
    resolver: zodResolver(referenceValueSchema),
    defaultValues: {
      type: "contract_type",
      value: "",
      label: "",
      sort_order: 0,
      is_active: true,
      is_default: false,
      is_demo: false,
    },
  });

  const selectedType = watch("type");
  const isDefault = watch("is_default");
  const isDemo = watch("is_demo");

  async function onSubmit(data: ReferenceValueFormData) {
    setIsLoading(true);
    setError(null);

    const result = await createReferenceValue(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      reset();
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Value
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reference Value</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setValue("type", value as ReferenceValueFormData["type"])
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {referenceValueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {referenceTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              {...register("label")}
              disabled={isLoading}
              placeholder="Display label"
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
              placeholder="internal_value"
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
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Value"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
