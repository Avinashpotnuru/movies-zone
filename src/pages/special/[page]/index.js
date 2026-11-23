import Specials from "@/components/SpecialsComponent";

import React from "react";

import Seo from "@/components/Seo";
import { absoluteUrl, truncate } from "@/config/site";

const COLLECTIONS = {
  hindi: { label: "Hindi", name: "Hindi movies", region: "India · Hindi", code: "hi" },
  telugu: { label: "Telugu", name: "Telugu movies", region: "India · Telugu", code: "te" },
  tamil: { label: "Tamil", name: "Tamil movies", region: "India · Tamil", code: "ta" },
  kannada: { label: "Kannada", name: "Kannada movies", region: "India · Kannada", code: "kn" },
  malayalam: {
    label: "Malayalam",
    name: "Malayalam movies",
    region: "India · Malayalam",
    code: "ml",
  },
};

const SpecialsPage = ({ page, meta }) => {
  const collection = COLLECTIONS[page];
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
  const code = COLLECTIONS[page]?.code;

  if (!code) {
    return { props: { page, meta: null } };
  }

  // Server-only chunk: the API helper never reaches the client bundle.
  const { fetchSpecialCollectionSeoMeta } = await import("@/config/seo");
  const collection = await fetchSpecialCollectionSeoMeta(code);

  return {
    props: {
      page,
      meta: collection ?? null,
    },
  };
};

export default SpecialsPage;
