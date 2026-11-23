import Seo from "@/components/Seo";
import ImagesComponent from "@/components/ImagesComponent";
import { absoluteUrl, tmdbImageUrl, truncate } from "@/config/site";

const ImagesPage = ({ id, meta, images }) => {
  const title = meta?.title || "Movie gallery";
  const galleryImages = images.map((path) => tmdbImageUrl(path, "w500"));
  const seoImage = meta?.backdrop_path
    ? tmdbImageUrl(meta.backdrop_path, "original")
    : meta?.poster_path
    ? tmdbImageUrl(meta.poster_path, "w500")
    : galleryImages[0] || "/backgroundImage.jpg";

  const description = truncate(
    meta?.overview
      ? `${meta.overview} Browse posters and backdrop artwork for ${title} on Movies-Zone.`
      : `Browse posters and backdrop artwork for ${title} on Movies-Zone.`
  );

  return (
    <>
      <Seo
        title={`${title} photos`}
        description={description}
        path={`/images/${id}`}
        image={seoImage}
        imageAlt={`${title} artwork`}
        noindex={!meta}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: `${title} photos`,
          description,
          url: absoluteUrl(`/images/${id}`),
          image: galleryImages.length
            ? galleryImages.map((path) => absoluteUrl(path))
            : undefined,
        }}
      />
      <ImagesComponent id={id} />
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Server-only chunk: both API helpers stay out of the client bundle.
  const { fetchMovieSeoMeta, fetchMovieImagesSeoMeta } = await import(
    "@/config/seo"
  );
  const [movie, imageData] = await Promise.all([
    fetchMovieSeoMeta(id),
    fetchMovieImagesSeoMeta(id),
  ]);

  const images = [
    ...(imageData?.backdrops ?? []),
    ...(imageData?.posters ?? []),
  ]
    .map((item) => item.file_path)
    .filter(Boolean)
    .slice(0, 8);

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
          }
        : null,
      images,
    },
  };
};

export default ImagesPage;
