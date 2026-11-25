"use client";

import { useMemo } from "react";

import { getCollection } from "@/config/collections";
import { DEFAULT_FILTERS } from "@/components/MovieFilters/constants";
import { useMovieFilters } from "@/hooks/useMovieFilters";
import { useDiscoverMoviesQuery } from "@/store/api/restApis";

export const useSpecialsData = (page) => {
  const collection = getCollection(page);
  const ready = Boolean(collection?.code);

  const defaults = useMemo(
    () => ({ ...DEFAULT_FILTERS, originalLanguage: collection?.code || "" }),
    [collection?.code]
  );

  const { filters } = useMovieFilters({
    defaults,
    includeList: false,
    lockOriginalLanguage: true,
    pageParam: "p",
  });

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
      originalLanguage: collection?.code || "",
      originCountry: "IN",
    }),
    [filters, collection?.code]
  );

  const { data } = useDiscoverMoviesQuery(apiFilters, { skip: !ready });

  return { collection, filters, data };
};
