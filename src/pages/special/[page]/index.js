import dynamic from "next/dynamic";
import React from "react";

import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";
import { getCollection } from "@/config/collections";
import { absoluteUrl, truncate } from "@/config/site";

const Specials = dynamic(() => import("@/components/SpecialsComponent"), {
  ssr: false,
  loading: () => <LoadingRing label="collection-loading" />,
});

const SpecialsPage = ({ page, meta }) => {
  const collection = getCollection(page);
  const title = collection?.name || "Regional collection";
  const count = meta?.totalResults
    ? `${meta.totalResults.toLocaleString()} `
    : "";
  const description = collection
    ? `Discover ${count}popular ${collection.label} films from ${collection.region} on Movies-Zone.`
    : "Discover popular films from regional cinema on Movies-Zone.";

  return (
    <>
      <Seo
        title={title}
        description={truncate(description)}
        path={`/special/${page}`}
        image={meta?.image || "/backgroundImage.jpg"}
        imageAlt={`${collection?.label || "Regional"} films`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl(`/special/${page}`),
          numberOfItems: meta?.totalResults || 0,
        }}
      />
      <Specials />
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const rawPage = params.page;
  const page = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const code = getCollection(page)?.code;

  if (!code) {
    return { notFound: true };
  }

  // Server-only chunk: the API helper never reaches the client bundle.
  const { fetchSpecialCollectionSeoMeta } = await import("@/config/seo");
  const collection = await fetchSpecialCollectionSeoMeta(page);

  return {
    props: {
      page,
      meta: collection ?? null,
    },
  };
};

export default SpecialsPage;
