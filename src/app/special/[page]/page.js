import { notFound } from "next/navigation";

import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import SpecialsComponent from "@/components/SpecialsComponent";
import { COLLECTIONS, getCollection } from "@/config/collections";
import { fetchSpecialCollectionSeoMeta } from "@/config/seo";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, truncate } from "@/config/site";

export const dynamicParams = false;
export const revalidate = 3600;

const normalizePage = (value) => (Array.isArray(value) ? value[0] : value);

const getDescription = (collection, count) =>
  collection
    ? `Discover ${count}popular ${collection.label} films from ${collection.region} on Movies-Zone.`
    : "Discover popular films from regional cinema on Movies-Zone.";

export async function generateStaticParams() {
  return COLLECTIONS.map(({ page }) => ({ page }));
}

export async function generateMetadata({ params }) {
  const page = normalizePage(params.page);
  const collection = getCollection(page);
  if (!collection) return createMetadata({ title: "Page not found", noindex: true });

  const meta = await fetchSpecialCollectionSeoMeta(page);
  const count = meta?.totalResults
    ? `${meta.totalResults.toLocaleString()} `
    : "";

  return createMetadata({
    title: collection.name,
    description: truncate(getDescription(collection, count)),
    path: `/special/${page}`,
    image: meta?.image || "/backgroundImage.jpg",
    imageAlt: `${collection.label} films`,
  });
}

export default async function SpecialsPage({ params }) {
  const page = normalizePage(params.page);
  const collection = getCollection(page);
  if (!collection) notFound();

  const meta = await fetchSpecialCollectionSeoMeta(page);
  const count = meta?.totalResults
    ? `${meta.totalResults.toLocaleString()} `
    : "";
  const description = getDescription(collection, count);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description,
    url: absoluteUrl(`/special/${page}`),
    numberOfItems: meta?.totalResults || 0,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <SpecialsComponent page={page} />
      </ApiProvider>
    </>
  );
}
