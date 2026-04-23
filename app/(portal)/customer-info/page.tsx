import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import { LandingCard } from "@/components/ui/landing-card";
import { FileText, Users, Flag, MessageSquare } from "lucide-react";

export default async function CustomerInfoPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const isInternal = profile.role === "admin" || profile.role === "staff";

  const internalCards = [
    {
      title: "All Contracts",
      description: "View and manage all customer contracts, billing arrangements, and service agreements.",
      href: "/contracts",
      icon: FileText,
    },
    {
      title: "All Contacts",
      description: "Browse all customer contacts across organizations with portal access status.",
      href: "/contacts",
      icon: Users,
    },
    {
      title: "All Priorities",
      description: "Track customer priorities, projects, and initiatives across all accounts.",
      href: "/priorities",
      icon: Flag,
    },
    {
      title: "All Requests",
      description: "View and respond to customer requests and support inquiries.",
      href: "/requests",
      icon: MessageSquare,
    },
  ];

  const customerCards = [
    {
      title: "My Contracts",
      description: "View your active contracts and service agreements with NextMove AI.",
      href: "/contracts",
      icon: FileText,
    },
    {
      title: "My Priorities",
      description: "Track your current priorities, projects, and initiatives.",
      href: "/priorities",
      icon: Flag,
    },
    {
      title: "My Requests",
      description: "View your submitted requests and their current status.",
      href: "/requests",
      icon: MessageSquare,
    },
  ];

  const cards = isInternal ? internalCards : customerCards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Info</h1>
        <p className="text-muted-foreground">
          {isInternal 
            ? "Access customer data, contracts, and communications."
            : "Access your contracts, priorities, and requests."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
