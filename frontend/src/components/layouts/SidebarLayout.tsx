import { AppSidebar } from "@/components/nav/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/ModeToggle";
import { navData } from "@/config/site-config";

export default function SidebarLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const findActivePage = () => {
    for (const [groupName, items] of Object.entries(navData)) {
      const activePage = items.find((item) => item.url === currentPath);
      if (activePage) {
        return { activePage, groupName };
      }
    }
    return null;
  };

  const activePageInfo = findActivePage();

  if (!activePageInfo) return null;

  const { activePage, groupName } = activePageInfo;
  const groupTitle =
    groupName === "navMain"
      ? "Основные страницы"
      : groupName === "navAdmin"
      ? "Администрирование"
      : "";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>{groupTitle}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {activePage.title || activePage.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex p-4">
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
