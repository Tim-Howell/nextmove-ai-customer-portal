import { z } from "zod";

/**
 * Per-user UI preferences stored in `profiles.preferences` (jsonb).
 *
 * The shape is intentionally permissive: every field is optional and
 * `parseUserPreferences` falls back to an empty object when the column is
 * `NULL`, missing, or contains anything that fails validation. Callers
 * should never throw on bad data — this is a UX nicety, not a contract.
 */
export const userPreferencesSchema = z
  .object({
    time_entry: z
      .object({
        last_customer_id: z.string().uuid().optional(),
        last_contract_id: z.string().uuid().optional(),
      })
      .optional(),
  })
  .passthrough();

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

/**
 * Tolerant parse of an unknown jsonb payload from `profiles.preferences`.
 * Returns `{}` when the input is null/undefined or fails validation.
 */
export function parseUserPreferences(input: unknown): UserPreferences {
  if (input === null || input === undefined) {
    return {};
  }
  const result = userPreferencesSchema.safeParse(input);
  return result.success ? result.data : {};
}
