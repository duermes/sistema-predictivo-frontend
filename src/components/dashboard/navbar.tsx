"use client";

import type React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Bell,
  Home,
  Pill,
  Settings,
  User,
  LogOut,
  Calendar,
} from "lucide-react";
import {ReactNode} from "react";
import {useRouter} from "next/navigation";

const navigationItems = [
  {
    title: "Panel Principal",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Predicción de Pastillas",
        url: "/dashboard/predict",
        icon: Pill,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        title: "Configuración",
        url: "/dashboard/configuracion",
        icon: Settings,
      },
    ],
  },
];

export default function Navbar({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    router.push("/auth/login");
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full auto">
        <Sidebar
          className="border-r group-data-[state=collapsed]:w-[var(--sidebar-width-icon)] transition-all duration-300"
          collapsible="icon"
        >
          <SidebarHeader className="border-b p-4 flex justify-center">
            <div className="flex items-center gap-2 group-data-[state=expanded]:justify-start group-data-[state=collapsed]:justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shrink-0">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col group-data-[state=collapsed]:hidden">
                <span className="text-sm font-semibold">
                  Sistema Predictivo
                </span>
                <span className="text-xs text-muted-foreground">Prototipo</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 group-data-[state=collapsed]:hidden">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                          className="w-full group-data-[state=expanded]:justify-start group-data-[state=collapsed]:justify-center"
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3 px-3 py-2"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="flex flex-col group-data-[state=collapsed]:hidden">
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Usuario" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">
                          Admin
                        </span>
                        <span className="text-xs text-muted-foreground">
                          admin@admin.com
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleLogOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold">
                {navigationItems
                  .flatMap((group) => group.items)
                  .find((item) => item.url === pathname)?.title || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
