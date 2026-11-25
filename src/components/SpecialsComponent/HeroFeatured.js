"use client";

import { FeaturedMovie } from "@/components/DiscoverShell";

import { useSpecialsData } from "./useSpecialsData";

const HeroFeatured = ({ page }) => {
  const { data } = useSpecialsData(page);

  return <FeaturedMovie movie={data?.results?.[0]} label="Featured · 01" />;
};

export default HeroFeatured;
