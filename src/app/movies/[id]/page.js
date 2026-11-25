import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import MovieDetails from "@/components/MovieDetails";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { fetchMovieSeoMeta } from "@/config/seo";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, tmdbImageUrl, truncate } from "@/config/site";

export const dynamicParams = true;
export const revalidate = 3600;

const normalizeId = (value) => (Array.isArray(value) ? value[0] : value);

const shapeMeta = (movie) =>
  movie
    ? {
        title: movie.title || "",
        overview: movie.overview || "",
        release_date: movie.release_date || "",
        poster_path: movie.poster_path || "",
        backdrop_path: movie.backdrop_path || "",
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        genres: (movie.genres ?? []).map((genre) => genre.name),
        tagline: movie.tagline || "",
        runtime: movie.runtime || 0,
        status: movie.status || "",
      }
    : null;

const getSeoImage = (meta) => {
  if (meta?.backdrop_path) return tmdbImageUrl(meta.backdrop_path, "original");
  if (meta?.poster_path) return tmdbImageUrl(meta.poster_path, "w500");
  return "/backgroundImage.jpg";
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const id = normalizeId(params.id);
  const meta = shapeMeta(await fetchMovieSeoMeta(id));
  const year = meta?.release_date?.slice(0, 4) ?? "";
  const title = meta?.title || "Movie details";
  const seoTitle = `${title}${year ? ` (${year})` : ""}`;

  return createMetadata({
    title: seoTitle,
    description: truncate(
      meta?.overview || `${seoTitle} on Movies-Zone — cast, trailers, and more.`
    ),
    path: `/movies/${id}`,
    image: getSeoImage(meta),
    imageAlt: `${title} artwork`,
    type: "video.movie",
  });
}

export default async function MovieDetailsPage({ params }) {
  const id = normalizeId(params.id);
  const meta = shapeMeta(await fetchMovieSeoMeta(id));
  const title = meta?.title || "Movie details";
  const seoImage = getSeoImage(meta);

  const jsonLd = {
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
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <FavoritesProvider>
          <MovieDetails id={id} meta={meta} />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
}
