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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
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
  CreditCardIcon,
  HomeIcon,
  LogOutIcon,
  PackageSearchIcon,
  Settings2Icon,
} from "lucide-react";

import { signOut, useSession } from "next-auth/react";

import Link from "next/link";

import React from "react";

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

  return (
    <SidebarProvider>
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

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/settings">
                            <Settings2Icon />
                            <span>Configurações</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
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
                        <span>Sua conta</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/payment">
                        <CreditCardIcon />
                        <span>Pagamento</span>
                      </Link>
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
