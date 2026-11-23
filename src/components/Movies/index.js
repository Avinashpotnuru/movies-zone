import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { AiFillStar, AiOutlineArrowRight } from "react-icons/ai";

import {
  useGetMoviesQuery,
  useGetTrendingMoviesQuery,
} from "@/store/api/restApis";
import { tabsHandler } from "@/store/slice/tabsSlice";
import { imagePath } from "@/utilities";

import GenreExplorer from "../GenreExplorer";
import HeroBanner from "../HeroBanner";
import LandingMovieCard from "../LandingMovieCard";
import Pagination from "../Pagination";

export const tabs = [
  { title: "Now Playing", tab: "now_playing" },
  { title: "Popular", tab: "popular" },
  { title: "Top Rated", tab: "top_rated" },
  { title: "Upcoming", tab: "upcoming" },
];

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
  const dispatch = useDispatch();
  const pageId = Number(useSelector((state) => state.tabsSlice.tabs)) || 1;

  const [tab, setTab] = useState("now_playing");
  const [trending, setTrending] = useState("day");

  const {
    data: moviesData,
    isLoading: moviesLoading,
  } = useGetMoviesQuery({ tab, pageId });
  const { data: trendingData, isLoading: trendingLoading } =
    useGetTrendingMoviesQuery({ trending });

  const featuredTrending = trendingData?.results?.slice(0, 3) ?? [];
  const activeTab = tabs.find((item) => item.tab === tab);

  const changeTab = (value) => {
    setTab(value);
    dispatch(tabsHandler(1));
  };

  const changePage = (page) => {
    dispatch(tabsHandler(page));
  };

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
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
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
          description="A quick look at the films everyone is watching today — switch to the weekly view to see what's holding strong."
          action={trendingToggle}
        />

        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {featuredTrending.length
            ? featuredTrending.map((movie, index) => (
                <TrendingCard key={movie.id} movie={movie} rank={index + 1} />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`trending-skeleton-${index}`}
                  className="h-[156px] animate-pulse bg-[#0a1b31]"
                  aria-hidden="true"
                />
              ))}
        </div>
      </section>

      <GenreExplorer />

      <section
        id="movies"
        className="mx-auto max-w-[1400px] scroll-mt-28 px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
      >
        <SectionHeading
          eyebrow="03 / The collection"
          title="Explore movies"
          description="From new releases to all-time favourites. Pick a list, find your next watch."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              Filter
            </p>
            <div className="mt-4 flex gap-2 overflow-x-auto lg:flex-col">
              {tabs.map((item, index) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => changeTab(item.tab)}
                  className={`flex shrink-0 items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors duration-200 lg:w-full ${
                    tab === item.tab
                      ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                      : "border-white/10 text-slate-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] opacity-60 tabular-nums">
                      0{index + 1}
                    </span>
                    {item.title}
                  </span>
                  <AiOutlineArrowRight
                    size={14}
                    aria-hidden="true"
                    className={tab === item.tab ? "opacity-100" : "opacity-0"}
                  />
                </button>
              ))}
            </div>
            <div className="mt-8 hidden border-t border-white/10 pt-5 lg:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Updated daily
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Data powered by TMDB
              </p>
            </div>
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
                {moviesData?.total_results?.toLocaleString() ?? "—"} titles
              </p>
            </div>

            {moviesLoading ? (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`movie-skeleton-${index}`}
                    className="animate-pulse"
                    aria-hidden="true"
                  >
                    <div className="aspect-[2/3] bg-[#0a1b31]" />
                    <div className="mt-3 h-4 w-3/4 bg-[#0a1b31]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {moviesData?.results?.map((movie) => (
                  <LandingMovieCard key={movie.id} {...movie} />
                ))}
              </div>
            )}

            <Pagination
              pages={moviesData?.total_pages}
              current={pageId}
              onChange={changePage}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Movies;
