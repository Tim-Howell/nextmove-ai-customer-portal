"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Flag,
  Target,
  Rocket,
  Zap,
  Star,
  Heart,
  Shield,
  Award,
  Trophy,
  Crown,
  Gem,
  Lightbulb,
  Brain,
  Puzzle,
  Layers,
  Box,
  Package,
  Briefcase,
  Building,
  Building2,
  Store,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Timer,
  Clock,
  Calendar,
  CalendarCheck,
  CheckCircle,
  CheckSquare,
  ListChecks,
  ClipboardList,
  FileText,
  FolderOpen,
  Database,
  Server,
  Cloud,
  Globe,
  Link,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Users,
  UserPlus,
  UserCheck,
  Handshake,
  Megaphone,
  Bell,
  Settings,
  Wrench,
  Hammer,
  Cog,
  Search,
  Eye,
  Lock,
  Key,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Send,
  Share,
  Download,
  Upload,
  RefreshCw,
  RotateCw,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Sparkles,
  Flame,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";

export const PRIORITY_ICONS: { name: string; icon: LucideIcon; category: string }[] = [
  // Goals & Achievement
  { name: "flag", icon: Flag, category: "Goals" },
  { name: "target", icon: Target, category: "Goals" },
  { name: "rocket", icon: Rocket, category: "Goals" },
  { name: "zap", icon: Zap, category: "Goals" },
  { name: "star", icon: Star, category: "Goals" },
  { name: "trophy", icon: Trophy, category: "Goals" },
  { name: "award", icon: Award, category: "Goals" },
  { name: "crown", icon: Crown, category: "Goals" },
  { name: "gem", icon: Gem, category: "Goals" },
  
  // Strategy & Planning
  { name: "lightbulb", icon: Lightbulb, category: "Strategy" },
  { name: "brain", icon: Brain, category: "Strategy" },
  { name: "puzzle", icon: Puzzle, category: "Strategy" },
  { name: "layers", icon: Layers, category: "Strategy" },
  { name: "box", icon: Box, category: "Strategy" },
  { name: "package", icon: Package, category: "Strategy" },
  
  // Business
  { name: "briefcase", icon: Briefcase, category: "Business" },
  { name: "building", icon: Building, category: "Business" },
  { name: "building2", icon: Building2, category: "Business" },
  { name: "store", icon: Store, category: "Business" },
  { name: "shopping-cart", icon: ShoppingCart, category: "Business" },
  { name: "credit-card", icon: CreditCard, category: "Business" },
  { name: "dollar-sign", icon: DollarSign, category: "Business" },
  { name: "handshake", icon: Handshake, category: "Business" },
  
  // Analytics
  { name: "trending-up", icon: TrendingUp, category: "Analytics" },
  { name: "bar-chart", icon: BarChart, category: "Analytics" },
  { name: "pie-chart", icon: PieChart, category: "Analytics" },
  { name: "line-chart", icon: LineChart, category: "Analytics" },
  { name: "activity", icon: Activity, category: "Analytics" },
  { name: "gauge", icon: Gauge, category: "Analytics" },
  
  // Time & Tasks
  { name: "timer", icon: Timer, category: "Time" },
  { name: "clock", icon: Clock, category: "Time" },
  { name: "calendar", icon: Calendar, category: "Time" },
  { name: "calendar-check", icon: CalendarCheck, category: "Time" },
  { name: "check-circle", icon: CheckCircle, category: "Time" },
  { name: "check-square", icon: CheckSquare, category: "Time" },
  { name: "list-checks", icon: ListChecks, category: "Time" },
  { name: "clipboard-list", icon: ClipboardList, category: "Time" },
  
  // Documents & Data
  { name: "file-text", icon: FileText, category: "Documents" },
  { name: "folder-open", icon: FolderOpen, category: "Documents" },
  { name: "database", icon: Database, category: "Documents" },
  { name: "server", icon: Server, category: "Documents" },
  { name: "cloud", icon: Cloud, category: "Documents" },
  
  // Communication
  { name: "globe", icon: Globe, category: "Communication" },
  { name: "link", icon: Link, category: "Communication" },
  { name: "mail", icon: Mail, category: "Communication" },
  { name: "message-square", icon: MessageSquare, category: "Communication" },
  { name: "phone", icon: Phone, category: "Communication" },
  { name: "video", icon: Video, category: "Communication" },
  { name: "megaphone", icon: Megaphone, category: "Communication" },
  { name: "bell", icon: Bell, category: "Communication" },
  { name: "send", icon: Send, category: "Communication" },
  { name: "share", icon: Share, category: "Communication" },
  
  // People
  { name: "users", icon: Users, category: "People" },
  { name: "user-plus", icon: UserPlus, category: "People" },
  { name: "user-check", icon: UserCheck, category: "People" },
  { name: "heart", icon: Heart, category: "People" },
  
  // Tools & Settings
  { name: "settings", icon: Settings, category: "Tools" },
  { name: "wrench", icon: Wrench, category: "Tools" },
  { name: "hammer", icon: Hammer, category: "Tools" },
  { name: "cog", icon: Cog, category: "Tools" },
  { name: "search", icon: Search, category: "Tools" },
  { name: "eye", icon: Eye, category: "Tools" },
  
  // Security
  { name: "shield", icon: Shield, category: "Security" },
  { name: "lock", icon: Lock, category: "Security" },
  { name: "key", icon: Key, category: "Security" },
  
  // Misc
  { name: "bookmark", icon: Bookmark, category: "Misc" },
  { name: "tag", icon: Tag, category: "Misc" },
  { name: "sparkles", icon: Sparkles, category: "Misc" },
  { name: "flame", icon: Flame, category: "Misc" },
  { name: "sun", icon: Sun, category: "Misc" },
  { name: "moon", icon: Moon, category: "Misc" },
];

interface IconPickerProps {
  value?: string | null;
  onChange: (iconName: string | null) => void;
  disabled?: boolean;
}

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search) return PRIORITY_ICONS;
    const lower = search.toLowerCase();
    return PRIORITY_ICONS.filter(
      (item) =>
        item.name.includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [search]);

  const selectedIcon = PRIORITY_ICONS.find((item) => item.name === value);
  const SelectedIconComponent = selectedIcon?.icon || Flag;

  return (
    <div className="space-y-2">
      <Label>Icon</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start gap-2"
            disabled={disabled}
          >
            <SelectedIconComponent className="h-4 w-4" />
            <span className="flex-1 text-left">
              {selectedIcon ? selectedIcon.name : "Select icon..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-2 border-b">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="h-64 overflow-y-auto">
            <div className="grid grid-cols-6 gap-1 p-2">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors",
                  !value && "bg-primary/10 ring-1 ring-primary"
                )}
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Flag className="h-5 w-5 text-muted-foreground" />
              </button>
              {filteredIcons.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors",
                      value === item.name && "bg-primary/10 ring-1 ring-primary"
                    )}
                    onClick={() => {
                      onChange(item.name);
                      setOpen(false);
                    }}
                    title={item.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        Choose an icon to represent this priority
      </p>
    </div>
  );
}
