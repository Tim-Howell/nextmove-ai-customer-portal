import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";
import { getCustomers } from "@/app/actions/customers";

interface CustomerWelcomeBarProps {
  customerName: string;
  customerId: string;
}

/**
 * Top-of-dashboard greeting bar shown to customer users.
 *
 * Renders the customer's logo (or a fallback icon), the organization name,
 * and a short welcome line. Lives at the very top of the customer dashboard
 * so it acts as a context anchor for everything below it.
 */
export async function CustomerWelcomeBar({
  customerName,
  customerId,
}: CustomerWelcomeBarProps) {
  const customers = await getCustomers();
  const customer = customers.find((c) => c.id === customerId);
  const logoUrl = customer?.logo_url ?? null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          {logoUrl ? (
            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={customerName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary">{customerName}</h1>
            <p className="text-muted-foreground">
              Welcome back! Here is an overview of your NextMove AI projects and
              services.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
