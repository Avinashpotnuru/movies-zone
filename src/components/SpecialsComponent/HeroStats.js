"use client";

import { Stat } from "@/components/DiscoverShell";

import { useSpecialsData } from "./useSpecialsData";

const HeroStats = ({ page }) => {
  const { collection, filters, data } = useSpecialsData(page);
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;

  return (
    <>
      <Stat label="Region" value={collection?.region || "India"} />
      <Stat label="Titles" value={totalResults.toLocaleString() || "—"} />
      <Stat
        label="Page"
        value={`${String(filters.page).padStart(2, "0")} / ${String(
          totalPages
        ).padStart(2, "0")}`}
        accent
      />
    </>
  );
};

export default HeroStats;
