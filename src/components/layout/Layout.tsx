import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { NavSection } from "./nav.types";

interface LayoutProps {
  appName: string;
  brandIcon: LucideIcon;
  appVersion?: string;
  navSections: NavSection[];
  title: string;
  subtitle?: string;
  helpTopic?: string;
  headerRightSlot?: ReactNode;
  portalUrl?: string;
  children: ReactNode;
}

export function Layout({
  appName,
  brandIcon,
  appVersion,
  navSections,
  title,
  subtitle,
  helpTopic,
  headerRightSlot,
  portalUrl,
  children,
}: LayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--proesa-mist)" }}>
      <Sidebar
        appName={appName}
        brandIcon={brandIcon}
        appVersion={appVersion}
        sections={navSections}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          helpTopic={helpTopic}
          rightSlot={headerRightSlot}
          portalUrl={portalUrl}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
