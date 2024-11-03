import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const ChangeThemeButton = () => {
  const { setTheme, theme } = useTheme();

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button onClick={changeTheme}>
      {theme === "dark" && (
        <>
          <SunIcon /> Ativar modo claro
        </>
      )}

      {theme === "light" && (
        <>
          <MoonIcon /> Ativar modo escuro
        </>
      )}
    </Button>
  );
};

export default function Page() {
  return (
    <RootLayout breadcrumb={["Configurações"]}>
      <ChangeThemeButton />
    </RootLayout>
  );
}
