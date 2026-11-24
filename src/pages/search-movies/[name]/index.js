import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import ApiProvider from "@/components/ApiProvider";
import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";
import { absoluteUrl, truncate } from "@/config/site";
import { FavoritesProvider } from "@/hooks/useFavoriteToggle";
import { useGetSearchMoviesQuery } from "@/store/api/restApis";

const MoviesSearch = dynamic(() => import("@/components/MovieSearch"), {
  ssr: false,
  loading: () => <LoadingRing label="search-loading" />,
});

const SearchResults = ({ term, page }) => {
  const router = useRouter();
  const ready = Boolean(term);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetSearchMoviesQuery(
      { searchInput: term, pageId: page },
      { skip: !ready }
    );

  const movies = data?.results ?? [];

  const handlePageChange = (nextPage) => {
    const path = `/search-movies/${encodeURIComponent(term)}`;
    router.push(nextPage > 1 ? `${path}?page=${nextPage}` : path);
  };

  return (
    <MoviesSearch
      query={term}
      movies={movies}
      totalResults={data?.total_results}
      currentPage={page}
      totalPages={data?.total_pages ?? 1}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={refetch}
      onPageChange={handlePageChange}
    />
  );
};

const SearchMovies = ({ initialTerm, initialPage, meta }) => {
  const term = initialTerm;
  const page = Math.max(1, Number(initialPage) || 1);
  const searchPath = `/search-movies/${encodeURIComponent(term)}${
    page > 1 ? `?page=${page}` : ""
  }`;

  const description = truncate(
    term
      ? `${
          meta?.totalResults
            ? `${meta.totalResults.toLocaleString()} titles matched for “${term}”. `
            : ""
        }Browse search results for “${term}” on Movies-Zone.`
      : "Search the Movies-Zone archive by movie title."
  );

  return (
    <>
      <Seo
        title={
          term
            ? `Search: ${term}${page > 1 ? ` — Page ${page}` : ""}`
            : "Search movies"
        }
        description={description}
        path={searchPath}
        image={meta?.image || "/backgroundImage.jpg"}
        imageAlt="Search results"
        noindex
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: term ? `Search results for ${term}` : "Search movies",
          description,
          url: absoluteUrl(searchPath),
          numberOfItems: meta?.totalResults || 0,
        }}
      />
      <ApiProvider>
        <FavoritesProvider>
          <SearchResults term={term} page={page} />
        </FavoritesProvider>
      </ApiProvider>
    </>
  );
};

export const getServerSideProps = async ({ params, query }) => {
  const rawName = params.name;
  const term = Array.isArray(rawName) ? rawName[0] : rawName || "";
  const rawPage = query.page;
  const initialPage = Math.max(
    1,
    Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1
  );

  // Server-only chunk: the search metadata helper never reaches the client bundle.
  const { fetchSearchSeoMeta } = await import("@/config/seo");
  const meta = term ? await fetchSearchSeoMeta(term, initialPage) : null;

  return {
    props: {
      initialTerm: term,
      initialPage,
      meta: meta ?? null,
    },
  };
};

export default SearchMovies;
