import ApiProvider from "@/components/ApiProvider";
import JsonLd from "@/components/JsonLd";
import SearchResults from "@/components/SearchResults";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { fetchSearchSeoMeta } from "@/config/seo";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl, truncate } from "@/config/site";

export const dynamic = "force-dynamic";

const normalizeTerm = (value) => (Array.isArray(value) ? value[0] : value || "");
const normalizePage = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  return Math.max(1, Number(raw) || 1);
};

const getSearchPath = (term, page) =>
  `/search-movies/${encodeURIComponent(term)}${page > 1 ? `?page=${page}` : ""}`;

const getDescription = (term, meta) =>
  truncate(
    term
      ? `${
          meta?.totalResults
            ? `${meta.totalResults.toLocaleString()} titles matched for “${term}”. `
            : ""
        }Browse search results for “${term}” on Movies-Zone.`
      : "Search the Movies-Zone archive by movie title."
  );

export async function generateMetadata({ params, searchParams }) {
  const term = normalizeTerm(params.name);
  const page = normalizePage(searchParams?.page);
  const meta = term ? await fetchSearchSeoMeta(term, page) : null;
  const searchPath = getSearchPath(term, page);

  return createMetadata({
    title: term
      ? `Search: ${term}${page > 1 ? ` — Page ${page}` : ""}`
      : "Search movies",
    description: getDescription(term, meta),
    path: searchPath,
    image: meta?.image || "/backgroundImage.jpg",
    imageAlt: "Search results",
    noindex: true,
  });
}

export default async function SearchMoviesPage({ params, searchParams }) {
  const term = normalizeTerm(params.name);
  const page = normalizePage(searchParams?.page);
  const meta = term ? await fetchSearchSeoMeta(term, page) : null;
  const searchPath = getSearchPath(term, page);
  const description = getDescription(term, meta);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: term ? `Search results for ${term}` : "Search movies",
    description,
    url: absoluteUrl(searchPath),
    numberOfItems: meta?.totalResults || 0,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ApiProvider>
        <FavoritesProvider>
          <SearchResults term={term} page={page} />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
}
