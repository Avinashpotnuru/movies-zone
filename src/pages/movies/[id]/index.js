//next imports

import dynamic from "next/dynamic";

import Seo from "@/components/Seo";
import { absoluteUrl, tmdbImageUrl, truncate } from "@/config/site";

//import components
const MovieDetails = dynamic(() => import("@/components/MovieDetails"), {
  ssr: false,
});

const MoviesDetailsPage = ({ id, meta }) => {
  const year = meta?.release_date?.slice(0, 4) ?? "";
  const title = meta?.title || "Movie details";
  const seoTitle = `${title}${year ? ` (${year})` : ""}`;
  const seoImage = meta?.backdrop_path
    ? tmdbImageUrl(meta.backdrop_path, "original")
    : meta?.poster_path
    ? tmdbImageUrl(meta.poster_path, "w500")
    : "/backgroundImage.jpg";

  return (
    <>
      <Seo
        title={seoTitle}
        description={truncate(
          meta?.overview || `${seoTitle} on Movies-Zone — cast, trailers, and more.`
        )}
        path={`/movies/${id}`}
        image={seoImage}
        imageAlt={`${title} artwork`}
        type="video.movie"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Movie",
          name: title,
          description: meta?.overview || undefined,
          image: absoluteUrl(seoImage),
          datePublished: meta?.release_date || undefined,
          genre: meta?.genres ?? [],
          aggregateRating:
            meta?.vote_average > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: meta.vote_average,
                  bestRating: 10,
                  ratingCount: meta.vote_count || undefined,
                }
              : undefined,
        }}
      />
      <MovieDetails />
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Server-only chunk: the API fetch helper never reaches the client bundle.
  const { fetchMovieSeoMeta } = await import("@/config/seo");
  const movie = await fetchMovieSeoMeta(id);

  return {
    props: {
      id,
      meta: movie
        ? {
            title: movie.title || "",
            overview: movie.overview || "",
            release_date: movie.release_date || "",
            poster_path: movie.poster_path || "",
            backdrop_path: movie.backdrop_path || "",
            vote_average: movie.vote_average || 0,
            vote_count: movie.vote_count || 0,
            genres: (movie.genres ?? []).map((genre) => genre.name),
          }
        : null,
    },
  };
};

export default MoviesDetailsPage;
