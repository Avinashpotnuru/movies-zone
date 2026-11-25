"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AiFillStar,
  AiOutlineAppstore,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import {
  useAddFavoritesMutation,
  useGetFavoriteMoviesQuery,
} from "@/store/api/restApis";
import { backdropPath, imagePath } from "@/utilities";

const SORTS = [
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "title", label: "A–Z" },
  { value: "original", label: "Original" },
];

const pad = (value) => String(value ?? 0).padStart(2, "0");

const getYear = (date) => date?.slice(0, 4) || "—";

const getRating = (value) => {
  const rating = Number(value);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "—";
};

const RemoveFavoriteButton = ({ title, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Remove ${title} from favorites`}
    title="Remove from favorites"
    className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#04152d]/90 text-[#F4442E] transition duration-300 after:absolute after:-inset-1 after:rounded-full after:content-[''] hover:scale-95 hover:border-[#F4442E] hover:bg-[#F4442E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] ${className}`}
  >
    <MdFavorite size={15} aria-hidden="true" />
  </button>
);

const FavoriteCard = ({ movie, index, onRemove }) => {
  const title = movie.title?.trim() || "Untitled";
  const href = movie.id ? `/movies/${movie.id}` : null;
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};
  const poster = movie.poster_path
    ? `${imagePath}${movie.poster_path}`
    : "/noimage.png";

  return (
    <article className="group relative overflow-hidden border border-white/10 bg-[#071a30] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#51E5FF]/60">
      <span
        className="absolute inset-y-0 left-0 w-[3px] bg-[#F4442E] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <Wrapper {...wrapperProps} className="block p-2 pl-3.5">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#04152d]">
          <Image
            src={poster}
            alt={title === "Untitled" ? "" : `${title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />

          <span className="absolute left-2 top-1 text-4xl font-black leading-none tracking-[-0.06em] text-white/15 tabular-nums">
            {pad(index + 1)}
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2.5">
            <span className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-300">
              <MdFavoriteBorder
                size={11}
                className="text-[#F4442E]"
                aria-hidden="true"
              />
              Saved
            </span>
            <span className="flex h-7 w-7 items-center justify-center border border-white/20 bg-[#04152d]/85 text-[#51E5FF] opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-within:opacity-100">
              <AiOutlineArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="pt-3">
          <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#51E5FF]">
            {title}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/10 pt-2.5">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Released
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-slate-400 tabular-nums">
                {getYear(movie.release_date)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Score
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-base font-black leading-none text-[#51E5FF] tabular-nums">
                <AiFillStar size={11} aria-hidden="true" />
                {getRating(movie.vote_average)}
              </p>
            </div>
          </div>
        </div>
      </Wrapper>

      <RemoveFavoriteButton
        title={title}
        onClick={() => onRemove(movie.id)}
        className="right-3 top-3"
      />
    </article>
  );
};

const FavoriteRow = ({ movie, index, onRemove }) => {
  const title = movie.title?.trim() || "Untitled";
  const href = movie.id ? `/movies/${movie.id}` : null;
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};
  const poster = movie.poster_path
    ? `${imagePath}${movie.poster_path}`
    : "/noimage.png";

  return (
    <article className="group relative overflow-hidden border border-white/10 bg-[#071a30] transition-colors duration-300 hover:border-[#51E5FF]/60">
      <span
        className="absolute inset-y-0 left-0 w-[3px] bg-[#F4442E] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <Wrapper
        {...wrapperProps}
        className="grid grid-cols-[36px_56px_minmax(0,1fr)] items-center gap-3 py-3 pl-3.5 pr-14 sm:grid-cols-[56px_80px_minmax(0,1fr)_112px] sm:gap-5 sm:py-4 sm:pl-5 sm:pr-16"
      >
        <span className="text-2xl font-black leading-none tracking-[-0.06em] text-white/15 tabular-nums sm:text-4xl">
          {pad(index + 1)}
        </span>

        <div className="relative aspect-[2/3] w-14 overflow-hidden bg-[#04152d] sm:w-20">
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 56px, 80px"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
              Saved title
            </span>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>
          <h3 className="mt-1 line-clamp-1 text-sm font-bold text-white transition-colors duration-300 group-hover:text-[#51E5FF] sm:text-base">
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-slate-500 sm:line-clamp-2">
            {movie.overview || "No synopsis has been added for this title."}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:hidden">
            <span className="tabular-nums">{getYear(movie.release_date)}</span>
            <span className="inline-flex items-center gap-1 text-[#51E5FF] tabular-nums">
              <AiFillStar size={10} aria-hidden="true" />
              {getRating(movie.vote_average)}
            </span>
          </div>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Released
          </p>
          <p className="mt-1 text-xs font-bold text-slate-400 tabular-nums">
            {getYear(movie.release_date)}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-2xl font-black leading-none text-[#51E5FF] tabular-nums">
            <AiFillStar size={13} aria-hidden="true" />
            {getRating(movie.vote_average)}
          </p>
        </div>
      </Wrapper>

      <RemoveFavoriteButton
        title={title}
        onClick={() => onRemove(movie.id)}
        className="right-3 top-1/2 -translate-y-1/2"
      />
    </article>
  );
};

const StatePanel = ({ eyebrow, title, description, action, icon }) => (
  <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-2xl border border-white/10 bg-[#0a1b31] px-6 py-14 text-center">
      {icon ? <div className="flex justify-center text-[#51E5FF]">{icon}</div> : null}
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
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
          className="animate-pulse border border-white/10 bg-[#071a30] p-2 pl-3.5"
        >
          <div className="aspect-[4/5] bg-[#0a1b31]" />
          <div className="pt-3">
            <div className="h-3 w-3/4 bg-[#0a1b31]" />
            <div className="mt-2 h-3 w-1/2 bg-[#0a1b31]" />
            <div className="mt-3 h-9 border-t border-white/10" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Favorites = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetFavoriteMoviesQuery();
  const [addFavorite] = useAddFavoritesMutation();

  const [hiddenIds, setHiddenIds] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [view, setView] = useState("grid");

  const movies = useMemo(
    () =>
      (data?.results ?? []).filter(
        (movie, index, list) =>
          movie?.id &&
          !hiddenIds.includes(movie.id) &&
          list.findIndex((item) => item?.id === movie.id) === index
      ),
    [data, hiddenIds]
  );

  const stats = useMemo(() => {
    const rated = movies.filter((movie) => Number(movie.vote_average) > 0);
    const average = rated.length
      ? (
          rated.reduce((sum, movie) => sum + Number(movie.vote_average), 0) /
          rated.length
        ).toFixed(1)
      : "—";
    const years = movies
      .map((movie) => Number(getYear(movie.release_date)))
      .filter((year) => Number.isFinite(year) && year > 0)
      .sort((a, b) => a - b);
    return {
      average,
      latestYear: years.length ? String(years[years.length - 1]) : "—",
    };
  }, [movies]);

  const visibleMovies = useMemo(() => {
    const term = filter.trim().toLowerCase();
    const list = movies.filter(
      (movie) => !term || (movie.title || "").toLowerCase().includes(term)
    );

    if (sortBy === "rating") {
      return [...list].sort(
        (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
      );
    }
    if (sortBy === "newest") {
      return [...list].sort((a, b) =>
        (b.release_date || "").localeCompare(a.release_date || "")
      );
    }
    if (sortBy === "title") {
      return [...list].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }
    return list;
  }, [movies, filter, sortBy]);

  const handleRemove = (id) => {
    if (!id) return;
    setHiddenIds((previous) => [...previous, id]);
    addFavorite({ media_type: "movie", media_id: id, favorite: false })
      .unwrap()
      .catch(() =>
        setHiddenIds((previous) => previous.filter((item) => item !== id))
      );
  };

  const featured = visibleMovies[0];
  const total = data?.total_results ?? movies.length;

  return (
    <div className="bg-[#04152d]">
      <header className="relative overflow-hidden border-b border-white/10">
        {featured?.backdrop_path ? (
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <Image
              src={`${backdropPath}${featured.backdrop_path}`}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#04152d]/65" />
          </div>
        ) : null}

        <div className="relative mx-auto max-w-[1400px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#F4442E]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              Saved / Collection
            </p>
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your <span className="text-[#51E5FF]">watchlist.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                Every title you marked, kept in one place. Refine it, reorder it,
                or remove what no longer belongs.
              </p>
            </div>

            <div className="border border-white/10 bg-[#0a1b31] p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                  Collection
                </p>
                <MdFavoriteBorder size={17} className="text-[#F4442E]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-5xl font-black leading-none tracking-tight text-white tabular-nums">
                {pad(total)}
              </p>
              <p className="mt-2 text-xs text-slate-500">titles saved</p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Avg rating
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white tabular-nums">
                    {stats.average}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Latest year
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white tabular-nums">
                    {stats.latestYear}
                  </p>
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
          title="The collection could not load"
          description="Your favorites did not respond. Check the connection and try again."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
            >
              <AiOutlineReload size={16} aria-hidden="true" />
              Retry
            </button>
          }
        />
      ) : !movies.length ? (
        <StatePanel
          eyebrow="Empty shelf"
          title="Nothing saved yet"
          description="Tap the heart on any movie to add it here. Your saved titles will be waiting in this collection."
          icon={<MdFavoriteBorder size={34} />}
          action={
            <Link
              href="/movies"
              className="inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
            >
              Browse movies
              <AiOutlineArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 border-y border-white/10 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-sm items-center border border-white/15 bg-[#0a1b31] focus-within:border-[#51E5FF]/70">
              <AiOutlineSearch
                size={18}
                aria-hidden="true"
                className="ml-3 shrink-0 text-[#51E5FF]"
              />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filter saved titles…"
                aria-label="Filter favorites"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>

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
                {isFetching ? "Updating…" : `${pad(visibleMovies.length)} shown`}
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

          {visibleMovies.length ? (
            view === "grid" ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {visibleMovies.map((movie, index) => (
                  <FavoriteCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-2">
                {visibleMovies.map((movie, index) => (
                  <FavoriteRow
                    key={movie.id}
                    movie={movie}
                    index={index}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )
          ) : (
            <StatePanel
              eyebrow="No match"
              title="No saved titles match that filter"
              description="Try a shorter title or clear the filter to see the full collection."
              action={
                <button
                  type="button"
                  onClick={() => setFilter("")}
                  className="inline-flex min-h-[46px] items-center gap-2 border border-white/20 px-6 text-sm font-bold text-white transition-colors hover:border-white/50"
                >
                  Clear filter
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
