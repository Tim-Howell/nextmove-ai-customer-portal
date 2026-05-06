import { enterCustomerView } from "@/app/actions/impersonation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ViewAsCustomerButtonProps {
  customerId: string;
}

/**
 * Server-component button that submits a form to `enterCustomerView`,
 * dropping the admin into the customer-view preview for the given
 * customer. Rendered only for real admins on the customer detail page.
 */
export function ViewAsCustomerButton({ customerId }: ViewAsCustomerButtonProps) {
  async function action() {
    "use server";
    await enterCustomerView(customerId);
  }

  return (
    <form action={action}>
      <Button type="submit" variant="outline">
        <Eye className="mr-2 h-4 w-4" />
        View as customer
      </Button>
    </form>
  );
}
