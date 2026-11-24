import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AiFillStar, AiOutlineArrowRight } from "react-icons/ai";

import {
  useGetMoviesQuery,
  useGetTrendingMoviesQuery,
} from "@/store/api/restApis";
import { imagePath } from "@/utilities";

import { SkeletonGrid } from "../DiscoverShell";
import HeroBanner from "../HeroBanner";
import LandingMovieCard from "../LandingMovieCard";

const GenreExplorer = dynamic(() => import("../GenreExplorer"));

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

const TrendingCard = ({ movie, rank }) => (
  <Link
    href={`/movies/${movie.id}`}
    className={`group flex items-center gap-4 border bg-[#0a1b31] p-4 transition-colors duration-300 hover:border-[#51E5FF]/50 ${
      rank === 1 ? "border-l-2 border-l-[#F4442E]" : "border-white/10"
    }`}
  >
    <span className="w-8 shrink-0 text-3xl font-black leading-none text-white/20 tabular-nums">
      0{rank}
    </span>
    <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-[#04152d]">
      <Image
        src={
          movie.poster_path ? `${imagePath}${movie.poster_path}` : "/noimage.png"
        }
        alt=""
        fill
        sizes="80px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-[#51E5FF]">
        {movie.title}
      </h3>
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#51E5FF] tabular-nums">
        <AiFillStar size={13} aria-hidden="true" />
        {movie.vote_average?.toFixed(1)}
        <span className="ml-2 text-slate-400">
          {movie.release_date?.slice(0, 4) ?? "—"}
        </span>
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 transition-colors group-hover:text-white">
        View film
        <AiOutlineArrowRight size={13} aria-hidden="true" />
      </span>
    </div>
  </Link>
);

const Movies = () => {
  const [trending, setTrending] = useState("week");

  const { data: popularData, isLoading: popularLoading } = useGetMoviesQuery({
    tab: "popular",
    pageId: 1,
  });
  const { data: trendingData, isLoading: trendingLoading } =
    useGetTrendingMoviesQuery({ trending });

  const featuredTrending = trendingData?.results?.slice(0, 3) ?? [];
  const popularPicks = popularData?.results?.slice(0, 6) ?? [];

  const trendingToggle = (
    <div className="flex border border-white/15">
      {[
        { value: "day", label: "Today" },
        { value: "week", label: "This week" },
      ].map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTrending(option.value)}
          className={`flex min-h-[44px] items-center px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
            trending === option.value
              ? "bg-[#51E5FF] text-[#04152d]"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-[#04152d] text-white">
      <HeroBanner />

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
        <SectionHeading
          eyebrow="01 / What's hot"
          title="Trending right now"
          description="A quick look at the films holding strong this week — switch to today for the newest pulse."
          action={trendingToggle}
        />

        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {featuredTrending.length
            ? featuredTrending.map((movie, index) => (
                <TrendingCard key={movie.id} movie={movie} rank={index + 1} />
              ))
            : trendingLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`trending-skeleton-${index}`}
                  className="h-[156px] animate-pulse bg-[#0a1b31]"
                  aria-hidden="true"
                />
              ))
            : null}
        </div>
      </section>

      <GenreExplorer />

      <section
        id="movies"
        className="mx-auto max-w-[1400px] scroll-mt-28 px-4 py-14 sm:px-8 lg:px-12 lg:py-16"
      >
        <SectionHeading
          eyebrow="03 / The collection"
          title="Explore movies"
          description="A small preview of the full movie index. Use the complete library for genre, year, rating and language filters."
          action={
            <Link
              href="/movies"
              className="inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
            >
              Open full library
              <AiOutlineArrowRight size={15} aria-hidden="true" />
            </Link>
          }
        />

        {popularLoading ? (
          <SkeletonGrid
            count={6}
            className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
          />
        ) : (
          <div className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {popularPicks.map((movie) => (
              <LandingMovieCard key={movie.id} compact {...movie} />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 tabular-nums">
            {popularData?.total_results?.toLocaleString() ?? "—"} titles in the
            full index
          </p>
          <Link
            href="/movies"
            className="inline-flex min-h-[44px] items-center gap-2 bg-[#51E5FF] px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#04152d] transition-colors hover:bg-white"
          >
            Browse all movies
            <AiOutlineArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Movies;
