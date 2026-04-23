import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import { LandingCard } from "@/components/ui/landing-card";
import { BarChart3, History } from "lucide-react";

export default async function ReportsLandingPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const isInternal = profile.role === "admin" || profile.role === "staff";

  const internalCards = [
    {
      title: "Time Reports",
      description: "View and export time entries across all customers with filtering and summary statistics.",
      href: "/reports/time",
      icon: BarChart3,
    },
    {
      title: "Change Log",
      description: "View audit trail of all changes made to records in the system.",
      href: "/reports/changes",
      icon: History,
    },
  ];

  const customerCards = [
    {
      title: "Time Report",
      description: "View time entries logged for your account with detailed breakdowns.",
      href: "/reports/time",
      icon: BarChart3,
    },
  ];

  const cards = isInternal ? internalCards : customerCards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          {isInternal 
            ? "Access reports and analytics for time tracking and system activity."
            : "View reports for your account."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <LandingCard
            key={card.href}
            title={card.title}
            description={card.description}
            href={card.href}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
