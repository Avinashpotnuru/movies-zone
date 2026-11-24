import dynamic from "next/dynamic";

import ApiProvider from "@/components/ApiProvider";
import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";

const MovieListing = dynamic(() => import("@/components/MovieListing"), {
  ssr: false,
  loading: () => <LoadingRing label="library-loading" />,
});

const MoviesPage = () => {
  return (
    <>
      <Seo
        title="Movie library"
        description="Browse now playing, popular, top rated, and upcoming films in the Movies-Zone movie index."
        path="/movies"
      />
      <ApiProvider>
        <FavoritesProvider>
          <MovieListing />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
};

export default MoviesPage;
