"use client";

import { Stat } from "@/components/DiscoverShell";
import { MOVIE_TABS } from "@/components/MovieFilters/constants";

import { useMovieListingData } from "./useMovieListingData";

const HeroStats = () => {
  const { filters, data } = useMovieListingData();
  const activeTab = MOVIE_TABS.find((item) => item.id === filters.list);
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;

  return (
    <>
      <Stat label="Titles" value={totalResults.toLocaleString() || "—"} />
      <Stat label="Pages" value={String(totalPages).padStart(2, "0")} />
      <Stat label="Current list" value={activeTab?.title || "Custom filters"} />
      <Stat label="Source" value="TMDB" accent />
    </>
  );
};

export default HeroStats;
