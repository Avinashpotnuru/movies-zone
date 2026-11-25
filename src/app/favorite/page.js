import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import Favorites from "@/components/Favorites";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl } from "@/config/site";

const DESCRIPTION = "Your personal watchlist of saved movies on Movies-Zone.";

export const metadata = createMetadata({
  title: "Your favorites",
  description: DESCRIPTION,
  path: "/favorite",
  noindex: true,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": absoluteUrl("/favorite"),
  name: "Movies-Zone favorites",
  description: DESCRIPTION,
  url: absoluteUrl("/favorite"),
};

export default function FavoritePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <FavoritesProvider>
          <Favorites />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
}
