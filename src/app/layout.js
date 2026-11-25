import "@/styles/globals.css";

import { Inter, Space_Grotesk } from "next/font/google";

import Layout from "@/components/Layout";
import { createMetadata } from "@/config/metadata";

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

export const metadata = {
  ...createMetadata({
    description:
      "Discover trending films, explore genres, search the archive, and save a watchlist on Movies-Zone.",
    path: "/",
  }),
  icons: { icon: "/moviesZoneLogo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#04152d" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      </head>
      <body
        className={`app-shell ${inter.variable} ${spaceGrotesk.variable}`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
