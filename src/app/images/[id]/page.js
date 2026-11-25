import ImagesComponent from "@/components/ImagesComponent";
import JsonLd from "@/components/JsonLd";
import { fetchMovieImagesSeoMeta, fetchMovieSeoMeta } from "@/config/seo";
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
      }
    : null;

const getImages = (data) =>
  [...(data?.backdrops ?? []), ...(data?.posters ?? [])]
    .map((item) => item.file_path)
    .filter(Boolean)
    .slice(0, 8);

const getGalleryData = (data) => ({
  backdrops: (data?.backdrops ?? [])
    .filter((item) => item?.file_path)
    .map(({ file_path }) => ({ file_path })),
  posters: (data?.posters ?? [])
    .filter((item) => item?.file_path)
    .map(({ file_path }) => ({ file_path })),
});

const getSeoImage = (meta, galleryImages) => {
  if (meta?.backdrop_path) return tmdbImageUrl(meta.backdrop_path, "original");
  if (meta?.poster_path) return tmdbImageUrl(meta.poster_path, "w500");
  return galleryImages[0] || "/backgroundImage.jpg";
};

const getDescription = (meta, title) =>
  truncate(
    meta?.overview
      ? `${meta.overview} Browse posters and backdrop artwork for ${title} on Movies-Zone.`
      : `Browse posters and backdrop artwork for ${title} on Movies-Zone.`
  );

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const id = normalizeId(params.id);
  const [movie, imageData] = await Promise.all([
    fetchMovieSeoMeta(id),
    fetchMovieImagesSeoMeta(id),
  ]);
  const meta = shapeMeta(movie);
  const galleryImages = getImages(imageData).map((path) =>
    tmdbImageUrl(path, "w500")
  );
  const title = meta?.title || "Movie gallery";

  return createMetadata({
    title: `${title} photos`,
    description: getDescription(meta, title),
    path: `/images/${id}`,
    image: getSeoImage(meta, galleryImages),
    imageAlt: `${title} artwork`,
    noindex: !meta,
  });
}

export default async function ImagesPage({ params }) {
  const id = normalizeId(params.id);
  const [movie, imageData] = await Promise.all([
    fetchMovieSeoMeta(id),
    fetchMovieImagesSeoMeta(id),
  ]);
  const meta = shapeMeta(movie);
  const images = getImages(imageData);
  const { backdrops, posters } = getGalleryData(imageData);
  const title = meta?.title || "Movie gallery";
  const galleryImages = images.map((path) => tmdbImageUrl(path, "w500"));
  const description = getDescription(meta, title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${title} photos`,
    description,
    url: absoluteUrl(`/images/${id}`),
    image: galleryImages.length
      ? galleryImages.map((path) => absoluteUrl(path))
      : undefined,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ImagesComponent
        id={id}
        meta={meta}
        backdrops={backdrops}
        posters={posters}
      />
    </>
  );
}
