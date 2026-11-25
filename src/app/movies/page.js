import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import MovieListing from "@/components/MovieListing";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl } from "@/config/site";

const DESCRIPTION =
  "Browse now playing, popular, top rated, and upcoming films in the Movies-Zone movie index.";

export const metadata = createMetadata({
  title: "Movie library",
  description: DESCRIPTION,
  path: "/movies",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": absoluteUrl("/movies"),
  name: "Movies-Zone movie library",
  description: DESCRIPTION,
  url: absoluteUrl("/movies"),
};

export default function MoviesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <FavoritesProvider>
          <MovieListing />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
}
