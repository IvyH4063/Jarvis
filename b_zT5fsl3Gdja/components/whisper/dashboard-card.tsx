"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  color: "blue" | "teal" | "amber";
}

const colorClasses = {
  blue: {
    bg: "bg-primary/10",
    icon: "text-primary",
    activeBorder: "border-primary",
    hover: "hover:border-primary/50",
  },
  teal: {
    bg: "bg-accent/10",
    icon: "text-accent",
    activeBorder: "border-accent",
    hover: "hover:border-accent/50",
  },
  amber: {
    bg: "bg-amber-500/10",
    icon: "text-amber-600",
    activeBorder: "border-amber-500",
    hover: "hover:border-amber-500/50",
  },
};

export function DashboardCard({
  title,
  description,
  icon: Icon,
  isActive,
  onClick,
  color,
}: DashboardCardProps) {
  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-4 p-6 rounded-2xl border bg-card transition-all duration-300 text-center",
        colors.hover,
        isActive && [colors.activeBorder, "shadow-lg"]
      )}
    >
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", colors.bg)}>
        <Icon className={cn("w-7 h-7", colors.icon)} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isActive && (
        <span className={cn("text-xs font-medium px-3 py-1 rounded-full", colors.bg, colors.icon)}>
          Selected
        </span>
      )}
    </button>
  );
}
