"use client";

import { FeaturedMovie } from "@/components/DiscoverShell";
import { MOVIE_TABS } from "@/components/MovieFilters/constants";

import { useMovieListingData } from "./useMovieListingData";

const HeroFeatured = () => {
  const { filters, data } = useMovieListingData();
  const activeTab = MOVIE_TABS.find((item) => item.id === filters.list);

  return (
    <FeaturedMovie
      movie={data?.results?.[0]}
      label={`Featured · ${activeTab?.title || "Filtered"}`}
    />
  );
};

export default HeroFeatured;
