import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import Movies from "@/components/Movies";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, SITE_NAME } from "@/config/site";

const DESCRIPTION =
  "Browse trending films, explore genres, and build a watchlist on Movies-Zone.";

export const metadata = createMetadata({
  title: "Discover movies, genres & hidden gems",
  description: DESCRIPTION,
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/"),
      name: "Movies-Zone home",
      description: DESCRIPTION,
      url: absoluteUrl("/"),
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absoluteUrl("/search-movies/")}{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <FavoritesProvider>
          <Movies />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
}
