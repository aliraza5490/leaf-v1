"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Home,
  Leaf,
  MessageSquare,
  Package,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Conversations", url: "/dashboard/conversations", icon: MessageSquare },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Knowledge Base", url: "/dashboard/knowledge-base", icon: BookOpen },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
];

const managementItems = [
  { title: "Team", url: "/dashboard/team", icon: Users },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-3 text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Leaf</span>
            <span className="text-xs text-muted-foreground">AI Assistant</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
