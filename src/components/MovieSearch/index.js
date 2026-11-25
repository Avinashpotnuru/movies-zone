"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AiFillStar,
  AiOutlineAppstore,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import useDebounce from "@/hooks/useDebounce";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { imagePath } from "@/utilities";

import Pagination from "../Pagination";

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "title", label: "A–Z" },
];

const pad = (value) => String(value ?? 0).padStart(2, "0");

const getYear = (date) => date?.slice(0, 4) || "—";

const getRating = (value) => {
  const rating = Number(value);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "—";
};

const buildSearchPath = (term, page = 1) => {
  const path = `/search-movies/${encodeURIComponent(term.trim())}`;
  return page > 1 ? `${path}?page=${page}` : path;
};

const SearchForm = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="flex w-full max-w-2xl items-center border border-white/15 bg-[#0a1b31] transition-colors focus-within:border-[#51E5FF]/70"
  >
    <AiOutlineSearch
      size={20}
      aria-hidden="true"
      className="ml-4 shrink-0 text-[#51E5FF]"
    />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by movie title (2+ characters)…"
      aria-label="Search movies"
      className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
    />
    <button
      type="submit"
      disabled={value.trim().length < 2}
      className="inline-flex min-h-[46px] shrink-0 items-center gap-2 bg-[#51E5FF] px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#04152d] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      Search
      <AiOutlineArrowRight size={15} aria-hidden="true" />
    </button>
  </form>
);

const FavoriteButton = ({ movieId, className = "" }) => {
  const { isFavorite, toggleFavorite } = useFavoriteToggle();
  const saved = isFavorite(movieId);

  if (!movieId) return null;

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(movieId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center border border-white/20 bg-[#04152d]/90 transition-colors hover:border-[#F4442E] hover:text-[#F4442E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] ${
        saved ? "text-[#F4442E]" : "text-white"
      } ${className}`}
    >
      {saved ? (
        <MdFavorite size={17} aria-hidden="true" />
      ) : (
        <MdFavoriteBorder size={17} aria-hidden="true" />
      )}
    </button>
  );
};

const SearchResultCard = ({ movie, index }) => {
  const title = movie.title?.trim() || "Untitled";
  const href = movie.id ? `/movies/${movie.id}` : null;
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};
  const poster = movie.poster_path
    ? `${imagePath}${movie.poster_path}`
    : "/noimage.png";

  return (
    <div className="group relative border border-white/10 bg-[#0a1b31] transition duration-300 hover:-translate-y-0.5 hover:border-[#51E5FF]/60">
      <Wrapper {...wrapperProps} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#04152d]">
          <Image
            src={poster}
            alt={title === "Untitled" ? "" : `${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-transparent to-transparent opacity-90" />
          <span className="absolute left-3 top-3 border border-white/20 bg-[#04152d]/85 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.16em] text-[#51E5FF] tabular-nums">
            {pad(index + 1)}
          </span>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-snug text-white transition-colors group-hover:text-[#51E5FF]">
            {title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-500 tabular-nums">
              {getYear(movie.release_date)}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-[#51E5FF] tabular-nums">
              <AiFillStar size={12} aria-hidden="true" />
              {getRating(movie.vote_average)}
            </span>
          </div>
        </div>
      </Wrapper>
      <FavoriteButton movieId={movie.id} className="absolute right-3 top-3" />
    </div>
  );
};

const SearchResultRow = ({ movie, index }) => {
  const title = movie.title?.trim() || "Untitled";
  const href = movie.id ? `/movies/${movie.id}` : null;
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};
  const poster = movie.poster_path
    ? `${imagePath}${movie.poster_path}`
    : "/noimage.png";

  return (
    <div className="group relative border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/60">
      <Wrapper
        {...wrapperProps}
        className="flex items-center gap-4 p-3 pr-14"
      >
        <span className="hidden w-8 shrink-0 text-2xl font-black leading-none text-white/20 tabular-nums sm:block">
          {pad(index + 1)}
        </span>
        <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-[#04152d]">
          <Image
            src={poster}
            alt=""
            fill
            sizes="64px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#51E5FF] sm:text-base">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {movie.overview || "No synopsis has been added for this title."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <span className="tabular-nums">{getYear(movie.release_date)}</span>
            <span className="inline-flex items-center gap-1 text-[#51E5FF] tabular-nums">
              <AiFillStar size={11} aria-hidden="true" />
              {getRating(movie.vote_average)}
            </span>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          aria-hidden="true"
          className="hidden shrink-0 text-[#51E5FF] opacity-0 transition-opacity group-hover:opacity-100 sm:block"
        />
      </Wrapper>
      <FavoriteButton movieId={movie.id} className="absolute right-3 top-3" />
    </div>
  );
};

const StatePanel = ({ eyebrow, title, description, action }) => (
  <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-2xl border border-white/10 bg-[#0a1b31] px-6 py-12 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        {description}
      </p>
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  </div>
);

const LoadingGrid = () => (
  <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[2/3] animate-pulse border border-white/10 bg-[#0a1b31]"
        />
      ))}
    </div>
  </div>
);

const MoviesSearch = ({
  query = "",
  movies = [],
  totalResults,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  onPageChange,
}) => {
  const router = useRouter();
  const [input, setInput] = useState(query);
  const [sortBy, setSortBy] = useState("relevance");
  const [view, setView] = useState("grid");
  const debouncedInput = useDebounce(input, 450);
  const lastAutoTerm = useRef(query);

  useEffect(() => {
    setInput(query);
    lastAutoTerm.current = query;
  }, [query]);

  useEffect(() => {
    const term = debouncedInput.trim();
    if (term.length < 2 || term === query || term === lastAutoTerm.current) {
      return;
    }
    lastAutoTerm.current = term;
    router.replace(buildSearchPath(term, 1));
  }, [debouncedInput, query, router]);

  const sortedMovies = useMemo(() => {
    const unique = movies.filter(
      (movie, index, list) =>
        movie?.id && list.findIndex((item) => item?.id === movie.id) === index
    );

    if (sortBy === "rating") {
      return [...unique].sort(
        (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
      );
    }
    if (sortBy === "newest") {
      return [...unique].sort((a, b) =>
        (b.release_date || "").localeCompare(a.release_date || "")
      );
    }
    if (sortBy === "title") {
      return [...unique].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }
    return unique;
  }, [movies, sortBy]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const term = input.trim();
    if (term.length < 2) return;
    if (term === query && currentPage === 1) return;
    router.push(buildSearchPath(term, 1));
  };

  const handlePageChange = (page) => {
    if (typeof onPageChange === "function") {
      onPageChange(page);
      return;
    }
    router.push(buildSearchPath(query, page));
  };

  if (!query) {
    return (
      <div className="min-h-[70vh] bg-[#04152d]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#F4442E]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              Search / Archive
            </p>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Find your next
            <br />
            <span className="text-[#51E5FF]">obsession.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400">
            Search the archive by title, then refine the results by rating,
            release year, or name.
          </p>
          <div className="mt-8">
            <SearchForm
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/movies"
              className="inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
            >
              Browse all movies
              <AiOutlineArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[46px] items-center gap-2 border border-white/20 px-6 text-sm font-bold text-white transition-colors hover:border-white/50"
            >
              <AiOutlineArrowLeft size={16} aria-hidden="true" />
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = totalResults ?? sortedMovies.length;

  return (
    <div className="bg-[#04152d]">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#F4442E]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                  Search / Results
                </p>
              </div>
              <h1 className="mt-4 break-words text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                “{query}”
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                Every match from the archive, sorted and scored for a faster
                pick.
              </p>
              <div className="mt-7">
                <SearchForm
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                />
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Results refresh automatically as you type
                </p>
              </div>
            </div>

            <div className="border border-white/10 bg-[#0a1b31] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                  Signal
                </p>
                <AiFillStar size={16} className="text-[#F4442E]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-5xl font-black leading-none tracking-tight text-white tabular-nums">
                {pad(total)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                titles matched for this query
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Loaded
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white tabular-nums">
                    {pad(sortedMovies.length)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Source
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white">TMDB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <LoadingGrid />
      ) : isError ? (
        <StatePanel
          eyebrow="Signal lost"
          title="The search could not load"
          description="The archive did not respond. Check the connection and try the query again."
          action={
            <button
              type="button"
              onClick={() => onRetry?.()}
              className="inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
            >
              <AiOutlineReload size={16} aria-hidden="true" />
              Retry search
            </button>
          }
        />
      ) : !sortedMovies.length ? (
        <StatePanel
          eyebrow="No signal"
          title={`No titles found for “${query}”`}
          description="Try a different spelling, a shorter title, or browse the full movie library."
          action={
            <Link
              href="/movies"
              className="inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
            >
              Browse all movies
              <AiOutlineArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Sort
              </span>
              {SORTS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    sortBy === option.value
                      ? "border-[#F4442E]/70 text-[#F4442E]"
                      : "border-white/10 text-slate-500 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <p
                aria-live="polite"
                className="text-xs text-slate-500 tabular-nums"
              >
                {isFetching
                  ? "Updating…"
                  : `${pad(sortedMovies.length)} shown · page ${currentPage}/${totalPages}`}
              </p>
              <div className="flex border border-white/15">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  className={`flex h-10 w-10 items-center justify-center transition-colors ${
                    view === "grid"
                      ? "bg-[#51E5FF] text-[#04152d]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <AiOutlineAppstore size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  className={`flex h-10 w-10 items-center justify-center transition-colors ${
                    view === "list"
                      ? "bg-[#51E5FF] text-[#04152d]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <AiOutlineUnorderedList size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`transition-opacity duration-300 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {view === "grid" ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {sortedMovies.map((movie, index) => (
                  <SearchResultCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-2">
                {sortedMovies.map((movie, index) => (
                  <SearchResultRow
                    key={movie.id}
                    movie={movie}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 ? (
            <Pagination
              pages={totalPages}
              current={currentPage}
              onChange={handlePageChange}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MoviesSearch;
