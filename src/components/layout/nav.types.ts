import type { LucideIcon } from "lucide-react";

export type Role = string;

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: Role[];
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}
