import ApiProvider from "@/components/ApiProvider";
import CastDetails from "@/components/CastDetails";
import JsonLd from "@/components/JsonLd";
import { fetchPersonSeoMeta } from "@/config/seo";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, tmdbImageUrl, truncate } from "@/config/site";

export const dynamicParams = true;
export const revalidate = 3600;

const normalizeId = (value) => (Array.isArray(value) ? value[0] : value);

const shapeMeta = (person) =>
  person
    ? {
        name: person.name || "",
        biography: person.biography || "",
        profile_path: person.profile_path || "",
        birthday: person.birthday || "",
        deathday: person.deathday || "",
        known_for_department: person.known_for_department || "",
        place_of_birth: person.place_of_birth || "",
        gender: person.gender || 0,
        popularity: person.popularity || 0,
        homepage: person.homepage || "",
        also_known_as: person.also_known_as || [],
        external_ids: person.external_ids || {},
      }
    : null;

const getSeoImage = (meta) =>
  meta?.profile_path
    ? tmdbImageUrl(meta.profile_path, "w500")
    : "/backgroundImage.jpg";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const id = normalizeId(params.id);
  const meta = shapeMeta(await fetchPersonSeoMeta(id));
  const name = meta?.name || "Cast profile";

  return createMetadata({
    title: name,
    description: truncate(
      meta?.biography || `Explore ${name}'s credits and photos on Movies-Zone.`
    ),
    path: `/cast/${id}`,
    image: getSeoImage(meta),
    imageAlt: `${name} profile`,
    type: "profile",
  });
}

export default async function CastPage({ params }) {
  const id = normalizeId(params.id);
  const meta = shapeMeta(await fetchPersonSeoMeta(id));
  const name = meta?.name || "Cast profile";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: meta?.biography || undefined,
    image: absoluteUrl(getSeoImage(meta)),
    birthDate: meta?.birthday || undefined,
    deathDate: meta?.deathday || undefined,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <CastDetails id={id} meta={meta} />
      </ApiProvider>
    </>
  );
}
