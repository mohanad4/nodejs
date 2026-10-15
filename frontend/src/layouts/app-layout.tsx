import { Outlet, useLocation } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { navItems } from "@/config/nav";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppLayout() {
  const { pathname } = useLocation();
  const current = navItems.find((item) => pathname.startsWith(item.url));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center" />
          <h1 className="text-sm font-medium">{current?.title ?? "Admin Panel"}</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
