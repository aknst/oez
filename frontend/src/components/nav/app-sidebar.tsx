import * as React from "react";
import { LogIn } from "lucide-react";

import { NavMain } from "@/components/nav/nav-main";
import { NavAdminMenu } from "@/components/nav/nav-admin-menu";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { navData, team } from "@/config/site-config";
import { NavBrand } from "./nav-brand";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sessionUser } = useAuthContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBrand team={team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavAdminMenu projects={navData.navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        {sessionUser ? (
          <NavUser
            name={sessionUser?.full_name || ""}
            email={sessionUser.email}
          />
        ) : (
          <SidebarMenuButton
            asChild
            size="lg"
            variant="outline"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Link to="/login">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <LogIn className="size-4" />
              </div>
              <span className="truncate font-semibold">Вход в аккаунт</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
