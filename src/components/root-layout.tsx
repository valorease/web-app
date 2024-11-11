import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleUserIcon,
  ClipboardPenIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  PackageSearchIcon,
  SunIcon,
} from "lucide-react";

import { signOut, useSession } from "next-auth/react";

import Link from "next/link";

import React, { useEffect, useState } from "react";

import { getCookie, setCookie } from "cookies-next";
import { useTheme } from "next-themes";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
  breadcrumb?: ([string, string] | string)[];
}

export default function RootLayout({
  children,
  className,
  breadcrumb,
}: RootLayoutProps) {
  const session = useSession();

  const [isClient, setIsClient] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const sidebarState = getCookie("sidebar");
    setOpen(sidebarState === "true" || sidebarState === undefined);
  }, []);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setCookie("sidebar", open.toString());
  };

  const { setTheme, theme } = useTheme();

  if (!isClient) {
    return null;
  }

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarProvider open={open} onOpenChange={onOpenChange}>
      <div id="app-site" className="flex min-h-screen w-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-0 pt-[6px]">
            <SidebarGroup>
              <SidebarGroupLabel>Valorease</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard">
                        <HomeIcon />
                        <span>Início</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarHeader>

          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    Gerencial
                    <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/products">
                            <PackageSearchIcon />
                            <span>Produtos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/reports">
                            <ClipboardPenIcon />
                            <span>Relatórios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/settings">
                            <Settings2Icon />
                            <span>Configurações</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem> */}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <CircleUserIcon />
                      {session.data?.consumer.name
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                      <ChevronUpIcon className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <CircleUserIcon />
                        <span>Minha conta</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={changeTheme}>
                      {theme === "dark" && (
                        <>
                          <SunIcon /> Modo claro
                        </>
                      )}

                      {theme === "light" && (
                        <>
                          <MoonIcon /> Modo escuro
                        </>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOutIcon />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="p-2 flex flex-col min-h-full w-full">
          <div className="flex gap-4 p-2 items-center">
            <SidebarTrigger />

            {breadcrumb !== undefined && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.map((item, index) =>
                    index + 1 < breadcrumb.length ? (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          <BreadcrumbLink href={item[0]}>
                            {item[1]}
                          </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />
                      </React.Fragment>
                    ) : (
                      <BreadcrumbPage key={index}>{item}</BreadcrumbPage>
                    )
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>

          <div className={`h-full w-full p-4 ${className}`}>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
