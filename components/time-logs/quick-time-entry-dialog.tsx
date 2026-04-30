"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  quickTimeEntrySchema,
  type QuickTimeEntryFormData,
} from "@/lib/validations/time-entry";
import {
  createQuickTimeEntry,
  getQuickEntryFormData,
  type QuickEntryFormData,
} from "@/app/actions/time-entries";
import { showError, showSuccess } from "@/lib/toast";

interface QuickTimeEntryDialogProps {
  /** The trigger element (typically the sidebar Quick Entry button). */
  children: React.ReactNode;
}

/**
 * Quick Time Entry modal. Opens on trigger click, lazy-fetches the form
 * data on first open, pre-fills customer/contract from the user's last-used
 * preferences, and submits via `createQuickTimeEntry`.
 *
 * Excludes internal-notes and log-on-behalf-of by design.
 */
export function QuickTimeEntryDialog({ children }: QuickTimeEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<QuickEntryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0]!;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuickTimeEntryFormData>({
    resolver: zodResolver(quickTimeEntrySchema),
    defaultValues: {
      customer_id: "",
      contract_id: "",
      entry_date: today,
      hours: undefined,
      category_id: "",
      description: "",
      is_billable: true,
    },
  });

  const customerId = watch("customer_id");
  const contractId = watch("contract_id");
  const categoryId = watch("category_id");
  const isBillable = watch("is_billable");

  // Contracts narrowed to the selected customer.
  const filteredContracts = useMemo(() => {
    if (!data || !customerId) return [];
    return data.contracts.filter((c) => c.customer_id === customerId);
  }, [data, customerId]);

  // Lazy-load form data on first open.
  useEffect(() => {
    if (!open || data) return;
    let cancelled = false;
    setIsLoading(true);
    getQuickEntryFormData()
      .then((result) => {
        if (cancelled) return;
        setData(result);

        // Pre-fill from preferences if values are still valid.
        const lastCustomer = result.preferences.time_entry?.last_customer_id;
        const lastContract = result.preferences.time_entry?.last_contract_id;

        const customerStillValid =
          lastCustomer && result.customers.some((c) => c.id === lastCustomer);
        if (customerStillValid) {
          setValue("customer_id", lastCustomer!);

          const contractStillValid =
            lastContract &&
            result.contracts.some(
              (c) => c.id === lastContract && c.customer_id === lastCustomer
            );
          if (contractStillValid) {
            setValue("contract_id", lastContract!);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, data, setValue]);

  // When the customer changes, reset / auto-pick the contract.
  useEffect(() => {
    if (!data || !customerId) return;
    const matches = data.contracts.filter((c) => c.customer_id === customerId);
    const currentBelongs = matches.some((c) => c.id === contractId);
    if (!currentBelongs) {
      // Auto-select if exactly one matching contract, else clear.
      if (matches.length === 1) {
        setValue("contract_id", matches[0]!.id);
      } else {
        const def = matches.find((c) => c.is_default);
        setValue("contract_id", def ? def.id : "");
      }
    }
  }, [customerId, contractId, data, setValue]);

  async function onSubmit(values: QuickTimeEntryFormData) {
    setIsSubmitting(true);
    const result = await createQuickTimeEntry(values);
    setIsSubmitting(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    showSuccess("Time entry created");
    setOpen(false);
    reset({
      customer_id: values.customer_id,
      contract_id: values.contract_id,
      entry_date: today,
      hours: undefined,
      category_id: "",
      description: "",
      is_billable: true,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Time Entry</DialogTitle>
          <DialogDescription>
            Log time with a reduced field set. Use Detailed Entry for internal
            notes or to log on behalf of someone else.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qte-customer">Customer *</Label>
            <Select
              value={customerId}
              onValueChange={(v) => setValue("customer_id", v)}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger id="qte-customer">
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select customer"}
                />
              </SelectTrigger>
              <SelectContent>
                {(data?.customers ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer_id && (
              <p className="text-sm text-destructive">
                {errors.customer_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qte-contract">Contract *</Label>
            <Select
              value={contractId || ""}
              onValueChange={(v) => setValue("contract_id", v)}
              disabled={isLoading || isSubmitting || !customerId}
            >
              <SelectTrigger id="qte-contract">
                <SelectValue
                  placeholder={
                    !customerId ? "Select customer first" : "Select contract"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredContracts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contract_id && (
              <p className="text-sm text-destructive">
                {errors.contract_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qte-date">Date *</Label>
              <Input
                id="qte-date"
                type="date"
                {...register("entry_date")}
                disabled={isSubmitting}
              />
              {errors.entry_date && (
                <p className="text-sm text-destructive">
                  {errors.entry_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="qte-hours">Hours *</Label>
              <Input
                id="qte-hours"
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                placeholder="0.00"
                {...register("hours")}
                disabled={isSubmitting}
              />
              {errors.hours && (
                <p className="text-sm text-destructive">
                  {errors.hours.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qte-category">Category *</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => setValue("category_id", v)}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger id="qte-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(data?.categories ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qte-description">Description</Label>
            <Textarea
              id="qte-description"
              rows={3}
              placeholder="What did you work on?"
              {...register("description")}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="qte-billable"
              checked={isBillable}
              onCheckedChange={(checked) =>
                setValue("is_billable", checked === true)
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="qte-billable" className="font-normal">
              Billable time
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isSubmitting ? "Saving..." : "Log Time"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
