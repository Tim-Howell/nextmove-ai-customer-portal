import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateOnly } from "@/lib/utils/date";
import type { ProjectContractSnapshot } from "@/app/actions/dashboard-charts";

interface CustomerProjectSnapshotCardProps {
  contract: ProjectContractSnapshot;
}

/** Cap the description so cards stay a consistent, readable height. */
const MAX_DESCRIPTION_WORDS = 28;

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
}

/**
 * Snapshot card for a fixed-rate project or subscription contract. Unlike the
 * hours burndown cards there is no usage bar — these contracts are billed at a
 * fixed rate, so we surface the total hours billed to date alongside the
 * contract metadata and a truncated description.
 *
 * Server component — no interactivity needed.
 */
export function CustomerProjectSnapshotCard({
  contract,
}: CustomerProjectSnapshotCardProps) {
  const {
    contractId,
    contractName,
    contractTypeLabel,
    totalHoursBilled,
    startDate,
    description,
  } = contract;

  return (
    <Link href={`/contracts/${contractId}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {contractName}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{contractTypeLabel}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="font-display tabular-nums text-3xl">
                {totalHoursBilled.toFixed(1)}
                <span className="text-muted-foreground text-base font-normal">
                  {" "}
                  hrs
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Total hours billed (all time)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm tabular-nums">
                {startDate ? formatDateOnly(startDate) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Start date</p>
            </div>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground">
              {truncateWords(description, MAX_DESCRIPTION_WORDS)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
