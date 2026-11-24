import "@/styles/globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import Head from "next/head";

import Layout from "@/components/Layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Movies-Zone</title>
        <link
          rel="icon"
          href="/moviesZoneLogo.png"
          type="image/x-icon"
          sizes="any"
        />
        <meta name="theme-color" content="#04152d" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      </Head>
      <div
        className={`app-shell overflow-x-container ${inter.variable} ${spaceGrotesk.variable}`}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
