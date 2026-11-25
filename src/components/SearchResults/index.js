"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { useGetSearchMoviesQuery } from "@/store/api/restApis";

import LoadingRing from "@/components/LoadingRing";

const MoviesSearch = dynamic(() => import("@/components/MovieSearch"), {
  ssr: false,
  loading: () => <LoadingRing label="search-loading" />,
});

const SearchResults = ({ term = "", page = 1 }) => {
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

export default SearchResults;
