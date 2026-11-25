import { Suspense } from "react";

import { AiOutlineArrowLeft } from "react-icons/ai";

import { DiscoverHero } from "@/components/DiscoverShell";

import LoadingRing from "../LoadingRing";
import HeroFeatured from "./HeroFeatured";
import HeroStats from "./HeroStats";
import MovieListingClient from "./MovieListingClient";

const breadcrumb = [
  {
    label: "Home",
    href: "/",
    icon: <AiOutlineArrowLeft size={14} aria-hidden="true" />,
  },
  { label: "Movies", active: true },
];

const FeaturedFallback = () => (
  <div
    className="aspect-[16/10] animate-pulse border border-white/10 bg-[#0a1b31]"
    aria-hidden="true"
  />
);

const MovieListing = () => (
  <div className="bg-[#04152d] text-white">
    <DiscoverHero
      breadcrumb={breadcrumb}
      eyebrow="Library / Discover"
      title="The movie index"
      description="Filter the archive by genre, year, rating and language — every combination is shareable through the URL."
      badges={[
        { label: "TMDB discover", tone: "coral" },
        { label: "URL-synced filters" },
      ]}
      featuredSlot={
        <Suspense fallback={<FeaturedFallback />}>
          <HeroFeatured />
        </Suspense>
      }
      statsSlot={
        <Suspense fallback={null}>
          <HeroStats />
        </Suspense>
      }
    />

    <Suspense fallback={<LoadingRing label="library-loading" />}>
      <MovieListingClient />
    </Suspense>
  </div>
);

export default MovieListing;
