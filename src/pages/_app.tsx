import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Valorease App</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ThemeProvider themes={["light", "dark"]} defaultTheme="light">
        <SessionProvider>
          <Component {...pageProps}></Component>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
