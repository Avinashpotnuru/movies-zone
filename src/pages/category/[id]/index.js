import dynamic from "next/dynamic";
import React from "react";

import ApiProvider from "@/components/ApiProvider";
import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";
import { absoluteUrl, truncate } from "@/config/site";

const Genres = dynamic(() => import("@/components/Genres"), {
  ssr: false,
  loading: () => <LoadingRing label="genre-loading" />,
});

const CategoryPage = ({ id, meta }) => {
  const genreName = meta?.name || "Genre";
  const count = meta?.totalResults
    ? `${meta.totalResults.toLocaleString()} `
    : "";
  const description =
    genreName !== "Genre"
      ? `Browse ${count}popular ${genreName.toLowerCase()} films on Movies-Zone.`
      : "Browse popular films by genre on Movies-Zone.";

  return (
    <>
      <Seo
        title={`${genreName} movies`}
        description={truncate(description)}
        path={`/category/${id}`}
        image={meta?.image || "/backgroundImage.jpg"}
        imageAlt={`${genreName} films`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${genreName} movies`,
          description,
          url: absoluteUrl(`/category/${id}`),
          numberOfItems: meta?.totalResults || 0,
        }}
      />
      <ApiProvider>
        <Genres />
      </ApiProvider>
    </>
  );
};

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async ({ params }) => {
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Server-only chunk: both API helpers stay out of the client bundle.
  const { fetchGenreSeoMeta, fetchGenreCollectionSeoMeta } = await import(
    "@/config/seo"
  );
  const [genre, collection] = await Promise.all([
    fetchGenreSeoMeta(id),
    fetchGenreCollectionSeoMeta(id),
  ]);

  return {
    props: {
      id,
      meta: {
        name: genre?.name || "",
        image: collection?.image || "",
        totalResults: collection?.totalResults || 0,
      },
    },
    revalidate: genre ? 3600 : 60,
  };
};

export default CategoryPage;
