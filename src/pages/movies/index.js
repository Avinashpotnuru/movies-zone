import Seo from "@/components/Seo";
import MovieListing from "@/components/MovieListing";

const MoviesPage = () => {
  return (
    <>
      <Seo
        title="Movie library"
        description="Browse now playing, popular, top rated, and upcoming films in the Movies-Zone movie index."
        path="/movies"
      />
      <MovieListing />
    </>
  );
};

export default MoviesPage;
