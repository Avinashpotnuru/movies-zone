"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AiOutlineArrowRight,
  AiOutlineFilter,
} from "react-icons/ai";
import { getCollection } from "@/config/collections";
import { useDiscoverMoviesQuery, useGetGenresQuery } from "@/store/api/restApis";

import {
  AppliedFilterChips,
  DiscoverErrorState,
  EmptyState,
  MoviePosterCard,
  SkeletonGrid,
} from "@/components/DiscoverShell";
import {
  createFilterChips,
  DEFAULT_FILTERS,
} from "@/components/MovieFilters/constants";
import {
  FilterActions,
  FilterDrawer,
  FilterPanel,
} from "@/components/MovieFilters";
import { useMovieFilters } from "@/hooks/useMovieFilters";

import LoadingRing from "../LoadingRing";
import Pagination from "../Pagination";

const EMPTY_GENRES = [];

const Loader = () => <LoadingRing label="collection-loading" />;

const Specials = ({ page }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const collection = getCollection(page);
  const ready = Boolean(collection?.code);

  const defaults = useMemo(
    () => ({ ...DEFAULT_FILTERS, originalLanguage: collection?.code || "" }),
    [collection?.code]
  );
  const { filters, updateFilters, resetFilters, goToPage } = useMovieFilters({
    defaults,
    includeList: false,
    lockOriginalLanguage: true,
    pageParam: "p",
  });

  const { data: genresData } = useGetGenresQuery();
  const genres = genresData?.genres ?? EMPTY_GENRES;

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

  const { data, isLoading, isError } = useDiscoverMoviesQuery(apiFilters, {
    skip: !ready,
  });

  useEffect(() => {
    if (ready && data?.total_pages && filters.page > data.total_pages) {
      goToPage(1);
    }
  }, [data?.total_pages, filters.page, ready, goToPage]);

  const chips = useMemo(
    () =>
      createFilterChips({
        filters,
        genres,
        onChange: updateFilters,
        defaults,
        includeLanguage: false,
      }),
    [filters, genres, updateFilters, defaults]
  );

  const panelProps = {
    filters,
    genres,
    onChange: updateFilters,
    onReset: resetFilters,
    activeCount: chips.length,
    showLanguage: false,
    languageLabel: collection?.label || "Collection",
  };

  if (!ready) return <Loader />;
  if (isError) {
    return (
      <DiscoverErrorState
        eyebrow="Collection unavailable"
        title="This collection could not be loaded"
        message="The filters you selected may be too narrow. Reset them or try another collection."
        href="/special/hindi"
        actionLabel="View Hindi movies"
        actionIcon={<AiOutlineArrowRight size={16} aria-hidden="true" />}
      />
    );
  }

  const movies = data?.results ?? [];
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="bg-[#04152d] text-white">
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        panelProps={panelProps}
        label="Collection filters"
      />

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              Collection filters
            </p>
            <p className="mt-1 text-xs text-slate-400 tabular-nums">
              {totalResults.toLocaleString() || "—"} titles · Page {filters.page}{" "}
              of {totalPages}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={resetFilters}
              className="flex min-h-[40px] items-center border border-white/15 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors hover:border-[#F4442E] hover:text-[#F4442E]"
            >
              Reset
            </button>
          </div>
        </div>

        <AppliedFilterChips
          chips={chips}
          onClear={resetFilters}
          className="mt-6"
        />

        <div className="mt-9 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-[176px]">
              <div className="no-scrollbar max-h-[calc(100vh-196px)] overflow-y-auto border border-white/10 border-t-2 border-t-[#51E5FF] bg-[#061a31] shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
                <FilterPanel {...panelProps} />
                <FilterActions {...panelProps} />
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                Collection / Index
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {`${collection.label} films`}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Popular releases, classics and everything in between — narrowed by
                your filters.
              </p>
            </div>

            {isLoading ? (
              <SkeletonGrid
                count={10}
                className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                showMetaLine
              />
            ) : movies.length ? (
              <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {movies.map((movie) => (
                  <MoviePosterCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <EmptyState className="mt-9" onReset={resetFilters} />
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

export default Specials;
