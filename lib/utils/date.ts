/**
 * Format a YYYY-MM-DD date string (from a Postgres `date` column) for display.
 *
 * Why this exists: `new Date("2026-05-06")` parses the string as UTC midnight,
 * which in any timezone west of UTC then renders as the previous day in
 * `toLocaleDateString()`. Splitting and constructing with `new Date(y, m - 1, d)`
 * builds the date in local time so the displayed day matches what the user
 * picked in the form.
 */
export function formatDateOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  // Accept both "YYYY-MM-DD" and full ISO timestamps; we only care about the date part.
  const datePart = dateStr.length >= 10 ? dateStr.slice(0, 10) : dateStr;
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString();
}
