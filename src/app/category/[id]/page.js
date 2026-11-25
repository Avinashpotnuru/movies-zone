import ApiProvider from "@/components/ApiProvider";
import Genres from "@/components/Genres";
import JsonLd from "@/components/JsonLd";
import {
  fetchGenreCollectionSeoMeta,
  fetchGenreSeoMeta,
} from "@/config/seo";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, truncate } from "@/config/site";

export const dynamicParams = true;
export const revalidate = 3600;

const normalizeId = (value) => (Array.isArray(value) ? value[0] : value);

const getDescription = (genreName, count) =>
  genreName !== "Genre"
    ? `Browse ${count}popular ${genreName.toLowerCase()} films on Movies-Zone.`
    : "Browse popular films by genre on Movies-Zone.";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const id = normalizeId(params.id);
  const [genre, collection] = await Promise.all([
    fetchGenreSeoMeta(id),
    fetchGenreCollectionSeoMeta(id),
  ]);
  const genreName = genre?.name || "Genre";
  const count = collection?.totalResults
    ? `${collection.totalResults.toLocaleString()} `
    : "";

  return createMetadata({
    title: `${genreName} movies`,
    description: truncate(getDescription(genreName, count)),
    path: `/category/${id}`,
    image: collection?.image || "/backgroundImage.jpg",
    imageAlt: `${genreName} films`,
  });
}

export default async function CategoryPage({ params }) {
  const id = normalizeId(params.id);
  const [genre, collection] = await Promise.all([
    fetchGenreSeoMeta(id),
    fetchGenreCollectionSeoMeta(id),
  ]);
  const genreName = genre?.name || "Genre";
  const count = collection?.totalResults
    ? `${collection.totalResults.toLocaleString()} `
    : "";
  const description = getDescription(genreName, count);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genreName} movies`,
    description,
    url: absoluteUrl(`/category/${id}`),
    numberOfItems: collection?.totalResults || 0,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <Genres id={id} genre={genre} />
      </ApiProvider>
    </>
  );
}
