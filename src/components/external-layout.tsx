import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Link from "next/link";

import { useRouter } from "next/router";

interface ExternalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ExternalLayout({
  children,
  className,
}: ExternalLayoutProps) {
  const router = useRouter();

  const menuLinks = [
    ["https://valorease.site", "Início"],
    ["/login", "Entrar"],
    ["/register", "Cadastrar-se"],
  ];

  return (
    <div
      id="app-site"
      className={`flex flex-col justify-between min-h-screen w-screen ${className}`}
    >
      <header className="p-6 px-8 flex justify-between items-center m-2 rounded-2xl">
        <Link href="https://valorease.site" className="text-lg">
          Valorease <strong>App</strong>
        </Link>

        <NavigationMenu className="hidden sm:flex">
          <NavigationMenuList className="gap-2 sm:gap-4 md:gap-8">
            {...menuLinks.map(([link, label]) => {
              return (
                <NavigationMenuItem key={link + label}>
                  <Link href={link} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={router.pathname == link ? "font-semibold" : ""}
                    >
                      {label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {children}

      <footer className="p-8 flex justify-between">
        <p>
          <strong>Valorease</strong>
          <br />
          2024 | Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
