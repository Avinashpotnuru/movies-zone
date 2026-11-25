"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_FILTERS,
  parseFilters,
  toQuery,
} from "@/components/MovieFilters/constants";

export const useMovieFilters = ({
  pathname,
  baseQuery = {},
  defaults = DEFAULT_FILTERS,
  includeList = true,
  lockOriginalLanguage = false,
  pageParam = "page",
} = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPathname = usePathname();
  const targetPathname = pathname || currentPathname;

  const queryFilters = useMemo(
    () =>
      parseFilters(Object.fromEntries(searchParams.entries()), defaults, {
        lockOriginalLanguage,
        pageParam,
      }),
    [searchParams, defaults, lockOriginalLanguage, pageParam]
  );

  const [filters, setFilters] = useState(queryFilters);
  const filtersRef = useRef(filters);
  const lastPushedQueryRef = useRef(null);

  const buildQuery = useCallback(
    (next) => ({
      ...baseQuery,
      ...toQuery(next, defaults, { includeList, pageParam }),
    }),
    [baseQuery, defaults, includeList, pageParam]
  );

  useEffect(() => {
    const key = JSON.stringify(buildQuery(queryFilters));
    if (!lastPushedQueryRef.current || key === lastPushedQueryRef.current) {
      filtersRef.current = queryFilters;
      setFilters(queryFilters);
      if (key === lastPushedQueryRef.current) lastPushedQueryRef.current = null;
    }
  }, [queryFilters, buildQuery]);

  const pushFilters = useCallback(
    (next, page = 1) => {
      const normalized = { ...next, page };
      const query = buildQuery(normalized);
      filtersRef.current = normalized;
      setFilters(normalized);
      lastPushedQueryRef.current = JSON.stringify(query);

      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params.set(key, String(value));
      });
      const search = params.toString();

      router.push(search ? `${targetPathname}?${search}` : targetPathname, {
        scroll: false,
      });
    },
    [buildQuery, router, targetPathname]
  );

  const updateFilters = useCallback(
    (patch) => {
      const next = { ...filtersRef.current, list: "custom", ...patch };
      filtersRef.current = next;
      pushFilters(next, 1);
    },
    [pushFilters]
  );

  const applyFilters = useCallback(
    (next) => {
      filtersRef.current = next;
      pushFilters(next, 1);
    },
    [pushFilters]
  );

  const resetFilters = useCallback(() => {
    applyFilters(defaults);
  }, [applyFilters, defaults]);

  const goToPage = useCallback(
    (page) => {
      pushFilters(filtersRef.current, Math.max(1, page));
    },
    [pushFilters]
  );

  return {
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    goToPage,
    isReady: true,
  };
};
