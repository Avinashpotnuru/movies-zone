"use client";

import { useMemo } from "react";

import { useMovieFilters } from "@/hooks/useMovieFilters";
import { useDiscoverMoviesQuery } from "@/store/api/restApis";

export const useMovieListingData = () => {
  const { filters } = useMovieFilters({ pathname: "/movies" });

  const apiFilters = useMemo(
    () => ({
      page: filters.page,
      sortBy: filters.sortBy,
      withGenres: filters.withGenres,
      releaseFrom: filters.releaseFrom,
      releaseTo: filters.releaseTo,
      voteAverageGte: filters.voteAverageGte,
      voteAverageLte: filters.voteAverageLte,
      voteCountGte: filters.voteCountGte,
      originalLanguage: filters.originalLanguage,
    }),
    [filters]
  );

  const { data } = useDiscoverMoviesQuery(apiFilters);

  return { filters, data };
};
