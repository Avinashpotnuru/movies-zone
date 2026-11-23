import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { useGetGenresQuery, useGetMoviesQuery } from "@/store/api/restApis";
import { tabsHandler } from "@/store/slice/tabsSlice";
import { backdropPath, imagePath } from "@/utilities";

import LandingMovieCard from "../LandingMovieCard";
import Pagination from "../Pagination";

const MOVIE_TABS = [
  { title: "Now Playing", tab: "now_playing" },
  { title: "Popular", tab: "popular" },
  { title: "Top Rated", tab: "top_rated" },
  { title: "Upcoming", tab: "upcoming" },
];

const QUICK_LINKS = [
  { label: "Hindi", href: "/special/hindi" },
  { label: "Telugu", href: "/special/telugu" },
  { label: "Tamil", href: "/special/tamil" },
  { label: "Kannada", href: "/special/kannada" },
  { label: "Malayalam", href: "/special/malayalam" },
];

const ErrorState = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Library unavailable
    </p>
    <h1 className="text-3xl font-extrabold">The movie list could not load</h1>
    <p className="max-w-md text-sm text-slate-400">
      Something went wrong while fetching this list. Please try again shortly.
    </p>
    <Link
      href="/"
      className="mt-3 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
    >
      <AiOutlineArrowLeft size={16} aria-hidden="true" />
      Back to home
    </Link>
  </div>
);

const Stat = ({ label, value, accent }) => (
  <div className="border-l border-white/10 px-4 first:border-l-0 first:pl-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    <p
      className={`mt-1.5 text-sm font-bold leading-snug ${
        accent ? "text-[#51E5FF]" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

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
        src={
          movie.poster_path ? `${imagePath}${movie.poster_path}` : "/noimage.png"
        }
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
        <span className="text-slate-400">
          {movie.release_date?.slice(0, 4) ?? "—"}
        </span>
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
  const dispatch = useDispatch();
  const pageId = Number(useSelector((state) => state.tabsSlice.tabs)) || 1;

  const [tab, setTab] = useState("popular");
  const [view, setView] = useState("grid");

  const { data: genresData } = useGetGenresQuery();
  const {
    data,
    isLoading,
    isError,
  } = useGetMoviesQuery({ tab, pageId });

  useEffect(() => {
    dispatch(tabsHandler(1));
  }, [dispatch]);

  useEffect(() => {
    if (data?.total_pages && pageId > data.total_pages) {
      dispatch(tabsHandler(1));
    }
  }, [data?.total_pages, pageId, dispatch]);

  if (isError) return <ErrorState />;

  const activeTab = MOVIE_TABS.find((item) => item.tab === tab);
  const movies = data?.results ?? [];
  const featured = movies[0];
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const genres = (genresData?.genres ?? []).slice(0, 8);

  const changeTab = (value) => {
    setTab(value);
    dispatch(tabsHandler(1));
  };

  return (
    <div className="bg-[#04152d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        {featured?.backdrop_path && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={`${backdropPath}${featured.backdrop_path}`}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-20 blur-[2px]"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[#04152d]/65" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-12 pt-10 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#51E5FF]"
            >
              <AiOutlineArrowLeft size={14} aria-hidden="true" />
              Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#51E5FF]">Movies</span>
          </div>

          <div className="mt-8 grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
                Library / All films
              </p>
              <h1
                className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
              >
                The movie index
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                New releases, audience favourites and the films critics keep
                talking about — every list in one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="border border-[#F4442E]/60 bg-[#F4442E]/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F4442E]">
                  Four curated lists
                </span>
                <span className="border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Updated daily
                </span>
              </div>
            </div>

            {featured && (
              <Link
                href={`/movies/${featured.id}`}
                className="group relative block aspect-[16/10] overflow-hidden border border-white/20 bg-[#0a1b31] transition-colors hover:border-[#51E5FF]/60"
              >
                <Image
                  src={
                    featured.backdrop_path
                      ? `${backdropPath}${featured.backdrop_path}`
                      : "/backgroundImage.jpg"
                  }
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/50 to-transparent" />
                <span className="absolute left-4 top-4 border border-white/20 bg-[#04152d]/85 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
                  Featured · {activeTab?.title}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="line-clamp-1 text-xl font-extrabold text-white sm:text-2xl">
                    {featured.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {featured.overview || "No overview available."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {featured.vote_average > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-[#04152d]/85 px-2.5 py-1.5 text-sm font-bold text-[#51E5FF] tabular-nums">
                        <AiFillStar size={14} aria-hidden="true" />
                        {Number(featured.vote_average).toFixed(1)}
                      </span>
                    )}
                    <span className="bg-[#04152d]/85 px-2.5 py-1.5 text-xs font-semibold text-white tabular-nums">
                      {featured.release_date?.slice(0, 4) ?? "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors group-hover:text-[#51E5FF]">
                      View film
                      <AiOutlineArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
            <Stat label="Titles" value={totalResults.toLocaleString() || "—"} />
            <Stat label="Pages" value={String(totalPages).padStart(2, "0")} />
            <Stat label="Current list" value={activeTab?.title || "—"} />
            <Stat label="View" value={view === "grid" ? "Posters" : "Compact"} accent />
          </div>
        </div>
      </section>

      <div className="sticky top-[92px] z-30 border-b border-white/10 bg-[#04152d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MOVIE_TABS.map((item, index) => {
              const active = item.tab === tab;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => changeTab(item.tab)}
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
            <p className="text-xs text-slate-400 tabular-nums">
              {totalResults.toLocaleString() || "—"} titles · Page {pageId} of{" "}
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
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                Quick jump
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {QUICK_LINKS.map((item, index) => (
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

            {genres.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                  Genres
                </p>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/category/${genre.id}`}
                      className="border border-white/10 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-[#51E5FF]/50 hover:text-[#51E5FF]"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold text-white">
                {activeTab?.title}
                <span className="ml-2 text-slate-500 tabular-nums">
                  / page {pageId}
                </span>
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                Showing {movies.length} of{" "}
                {totalResults.toLocaleString() || "—"}
              </p>
            </div>

            {isLoading ? (
              <div
                className={`mt-6 ${
                  view === "grid"
                    ? "grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
                    : "space-y-2"
                }`}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`movie-index-skeleton-${index}`}
                    className="animate-pulse"
                    aria-hidden="true"
                  >
                    <div
                      className={
                        view === "grid"
                          ? "aspect-[2/3] bg-[#0a1b31]"
                          : "h-[132px] bg-[#0a1b31]"
                      }
                    />
                  </div>
                ))}
              </div>
            ) : movies.length ? (
              view === "grid" ? (
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
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
                      index={(pageId - 1) * 20 + index}
                    />
                  ))}
                </div>
              )
            ) : (
              <p className="mt-8 text-sm text-slate-400">
                No movies are available in this list right now.
              </p>
            )}

            <Pagination
              pages={totalPages}
              current={pageId}
              onChange={(page) => dispatch(tabsHandler(page))}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieListing;
