import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LandingCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function LandingCard({ title, description, href, icon: Icon, className }: LandingCardProps) {
  return (
    <Link href={href}>
      <Card className={cn(
        "h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer",
        className
      )}>
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
