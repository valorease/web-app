import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Valorease App</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <SessionProvider>
        <Component {...pageProps}></Component>
      </SessionProvider>
    </>
  );
}
