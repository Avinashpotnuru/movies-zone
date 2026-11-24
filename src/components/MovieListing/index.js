import Image from "next/image";
import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineFilter,
} from "react-icons/ai";
import { useDiscoverMoviesQuery, useGetGenresQuery } from "@/store/api/restApis";
import { imagePath } from "@/utilities";

import { COLLECTION_LINKS } from "@/config/collections";
import {
  AppliedFilterChips,
  DiscoverErrorState,
  DiscoverHero,
  EmptyState,
  SkeletonGrid,
} from "@/components/DiscoverShell";
import {
  createFilterChips,
  CURRENT_YEAR,
  DEFAULT_FILTERS,
  daysFromToday,
} from "@/components/MovieFilters/constants";
import {
  FilterActions,
  FilterDrawer,
  FilterPanel,
} from "@/components/MovieFilters";
import { useMovieFilters } from "@/hooks/useMovieFilters";

import LandingMovieCard from "../LandingMovieCard";
import Pagination from "../Pagination";

const EMPTY_GENRES = [];

const MOVIE_TABS = [
  {
    id: "popular",
    title: "Popular",
    preset: { sortBy: "popularity.desc" },
  },
  {
    id: "top_rated",
    title: "Top Rated",
    preset: { sortBy: "vote_average.desc", voteCountGte: 1000 },
  },
  {
    id: "now_playing",
    title: "Now Playing",
    preset: {
      sortBy: "primary_release_date.desc",
      releaseFrom: daysFromToday(-60).slice(0, 4),
      releaseTo: CURRENT_YEAR.toString(),
    },
  },
  {
    id: "upcoming",
    title: "Upcoming",
    preset: {
      sortBy: "primary_release_date.asc",
      releaseFrom: CURRENT_YEAR.toString(),
      releaseTo: (CURRENT_YEAR + 1).toString(),
    },
  },
];

const MovieListRow = ({ movie, index }) => (
  <Link
    href={`/movies/${movie.id}`}
    className="group flex items-center gap-4 border border-white/10 bg-[#0a1b31] p-3 transition-colors duration-300 hover:border-[#51E5FF]/50"
  >
    <span className="hidden w-8 shrink-0 text-2xl font-black leading-none text-white/20 tabular-nums sm:block">
      {String(index + 1).padStart(2, "0")}
    </span>
    <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-[#04152d]">
      <Image
        src={movie.poster_path ? `${imagePath}${movie.poster_path}` : "/noimage.png"}
        alt=""
        fill
        sizes="64px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#51E5FF] sm:text-base">
        {movie.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs tabular-nums">
        {movie.vote_average > 0 && (
          <span className="inline-flex items-center gap-1 font-bold text-[#51E5FF]">
            <AiFillStar size={12} aria-hidden="true" />
            {Number(movie.vote_average).toFixed(1)}
          </span>
        )}
        <span className="text-slate-400">{movie.release_date?.slice(0, 4) ?? "—"}</span>
        <span className="text-slate-500">Movie</span>
      </div>
      <p className="mt-2 line-clamp-1 text-xs text-slate-500">
        {movie.overview || "No overview available."}
      </p>
    </div>
    <AiOutlineArrowRight
      size={18}
      aria-hidden="true"
      className="shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#51E5FF]"
    />
  </Link>
);

const MovieListing = () => {
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: genresData } = useGetGenresQuery();
  const genres = genresData?.genres ?? EMPTY_GENRES;

  const {
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    goToPage,
    isReady,
  } = useMovieFilters({ pathname: "/movies" });

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

  const { data, isLoading, isError } = useDiscoverMoviesQuery(apiFilters, {
    skip: !isReady,
  });

  useEffect(() => {
    if (isReady && data?.total_pages && filters.page > data.total_pages) {
      goToPage(1);
    }
  }, [data?.total_pages, filters.page, isReady, goToPage]);

  const chips = useMemo(
    () =>
      createFilterChips({
        filters,
        genres,
        onChange: updateFilters,
        defaults: DEFAULT_FILTERS,
      }),
    [filters, genres, updateFilters]
  );

  if (isError) {
    return (
      <DiscoverErrorState
        eyebrow="Library unavailable"
        title="The movie list could not load"
        message="Something went wrong while fetching this list. Please try again shortly."
      />
    );
  }

  const movies = data?.results ?? [];
  const featured = movies[0];
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const activeTab = MOVIE_TABS.find((item) => item.id === filters.list);

  const applyTab = (tab) =>
    applyFilters({ ...DEFAULT_FILTERS, ...tab.preset, list: tab.id });

  const panelProps = {
    filters,
    genres,
    onChange: updateFilters,
    onReset: resetFilters,
    activeCount: chips.length,
  };
  return (
    <div className="bg-[#04152d] text-white">
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        panelProps={panelProps}
        label="Movie filters"
      />
      <DiscoverHero
        breadcrumb={[
          {
            label: "Home",
            href: "/",
            icon: <AiOutlineArrowLeft size={14} aria-hidden="true" />,
          },
          { label: "Movies", active: true },
        ]}
        eyebrow="Library / Discover"
        title="The movie index"
        description="Filter the archive by genre, year, rating and language — every combination is shareable through the URL."
        badges={[
          { label: "TMDB discover", tone: "coral" },
          { label: "URL-synced filters" },
        ]}
        featured={featured}
        featuredLabel={`Featured · ${activeTab?.title || "Filtered"}`}
        stats={[
          { label: "Titles", value: totalResults.toLocaleString() || "—" },
          { label: "Pages", value: String(totalPages).padStart(2, "0") },
          {
            label: "Current list",
            value: activeTab?.title || "Custom filters",
          },
          {
            label: "View",
            value: view === "grid" ? "Posters" : "Compact",
            accent: true,
          },
        ]}
      />

      <div className="sticky top-[92px] z-30 border-b border-white/10 bg-[#04152d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {MOVIE_TABS.map((item, index) => {
              const active = item.id === filters.list;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyTab(item)}
                  className={`flex shrink-0 items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "bg-[#51E5FF] text-[#04152d]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-[10px] tabular-nums ${
                      active ? "text-[#04152d]/60" : "text-slate-600"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className={`flex min-h-[40px] shrink-0 items-center gap-2 border px-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors lg:hidden ${
                chips.length > 0
                  ? "border-[#51E5FF]/60 text-[#51E5FF]"
                  : "border-white/15 text-white hover:border-[#51E5FF]/60 hover:text-[#51E5FF]"
              }`}
            >
              <AiOutlineFilter size={16} aria-hidden="true" />
              Filters
              {chips.length > 0 && (
                <span className="bg-[#F4442E] px-1.5 text-[10px] tabular-nums">
                  {chips.length}
                </span>
              )}
            </button>

            <p className="text-xs text-slate-400 tabular-nums">
              {totalResults.toLocaleString() || "—"} titles · Page {filters.page} of{" "}
              {totalPages}
            </p>

            <div className="flex border border-white/15">
              {[
                { value: "grid", label: "Grid" },
                { value: "list", label: "List" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                  className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                    view === option.value
                      ? "bg-white text-[#04152d]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-[176px]">
              <div className="no-scrollbar max-h-[calc(100vh-196px)] overflow-y-auto border border-white/10 border-t-2 border-t-[#51E5FF] bg-[#061a31] shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
                <FilterPanel {...panelProps} />
                <FilterActions {...panelProps} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                Quick jump
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {COLLECTION_LINKS.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between border border-white/10 bg-[#0a1b31] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:border-[#F4442E]/50 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </span>
                    <AiOutlineArrowRight
                      size={14}
                      aria-hidden="true"
                      className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#F4442E]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <AppliedFilterChips
              chips={chips}
              onClear={() => applyTab(MOVIE_TABS[0])}
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold text-white">
                {activeTab?.title || "Filtered results"}
                <span className="ml-2 text-slate-500 tabular-nums">
                  / page {filters.page}
                </span>
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                Showing {movies.length} of {totalResults.toLocaleString() || "—"}
              </p>
            </div>

            {!isReady || isLoading ? (
              <SkeletonGrid
                count={8}
                variant={view === "grid" ? "poster" : "compact"}
                className={`mt-6 ${
                  view === "grid"
                    ? "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    : "space-y-2"
                }`}
              />
            ) : movies.length ? (
              view === "grid" ? (
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {movies.map((movie) => (
                    <LandingMovieCard key={movie.id} compact {...movie} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-2">
                  {movies.map((movie, index) => (
                    <MovieListRow
                      key={movie.id}
                      movie={movie}
                      index={(filters.page - 1) * 20 + index}
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyState onReset={() => applyTab(MOVIE_TABS[0])} />
            )}

            <Pagination
              pages={totalPages}
              current={filters.page}
              onChange={goToPage}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieListing;
