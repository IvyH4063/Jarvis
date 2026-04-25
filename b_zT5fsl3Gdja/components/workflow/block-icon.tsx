"use client";

import { Mail, Sparkles, Calendar, BookOpen, Bell } from "lucide-react";

interface BlockIconProps {
  icon: string;
  className?: string;
}

export function BlockIcon({ icon, className = "h-5 w-5" }: BlockIconProps) {
  switch (icon) {
    case "mail":
      return <Mail className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "bell":
      return <Bell className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
