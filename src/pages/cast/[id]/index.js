//import components

import dynamic from "next/dynamic";

import ApiProvider from "@/components/ApiProvider";
import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";
import { absoluteUrl, tmdbImageUrl, truncate } from "@/config/site";

const CastDetails = dynamic(() => import("@/components/CastDetails"), {
  ssr: false,
  loading: () => <LoadingRing label="profile-loading" />,
});

const CastPage = ({ id, meta }) => {
  const name = meta?.name || "Cast profile";
  const seoImage = meta?.profile_path
    ? tmdbImageUrl(meta.profile_path, "w500")
    : "/backgroundImage.jpg";

  return (
    <>
      <Seo
        title={name}
        description={truncate(
          meta?.biography || `Explore ${name}'s credits and photos on Movies-Zone.`
        )}
        path={`/cast/${id}`}
        image={seoImage}
        imageAlt={`${name} profile`}
        type="profile"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name,
          description: meta?.biography || undefined,
          image: absoluteUrl(seoImage),
          birthDate: meta?.birthday || undefined,
          deathDate: meta?.deathday || undefined,
        }}
      />
      <ApiProvider>
        <CastDetails />
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

  // Server-only chunk: the API fetch helper never reaches the client bundle.
  const { fetchPersonSeoMeta } = await import("@/config/seo");
  const person = await fetchPersonSeoMeta(id);

  return {
    props: {
      id,
      meta: person
        ? {
            name: person.name || "",
            biography: person.biography || "",
            profile_path: person.profile_path || "",
            birthday: person.birthday || "",
            deathday: person.deathday || "",
          }
        : null,
    },
    revalidate: person ? 3600 : 60,
  };
};

export default CastPage;
