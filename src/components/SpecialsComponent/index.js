import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { ProgressBar } from "react-loader-spinner";

import { useGetSpecialMoviesQuery } from "@/store/api/restApis";
import { tabsHandler } from "@/store/slice/tabsSlice";
import { backdropPath, imagePath } from "@/utilities";

import Pagination from "../Pagination";

const COLLECTIONS = [
  {
    page: "hindi",
    label: "Hindi",
    name: "Hindi movies",
    code: "hi",
    region: "India · Hindi",
  },
  {
    page: "telugu",
    label: "Telugu",
    name: "Telugu movies",
    code: "te",
    region: "India · Telugu",
  },
  {
    page: "tamil",
    label: "Tamil",
    name: "Tamil movies",
    code: "ta",
    region: "India · Tamil",
  },
  {
    page: "kannada",
    label: "Kannada",
    name: "Kannada movies",
    code: "kn",
    region: "India · Kannada",
  },
  {
    page: "malayalam",
    label: "Malayalam",
    name: "Malayalam movies",
    code: "ml",
    region: "India · Malayalam",
  },
];

const Loader = () => (
  <div className="flex min-h-[70vh] items-center justify-center bg-[#04152d]">
    <ProgressBar
      height="80"
      width="80"
      ariaLabel="collection-loading"
      wrapperStyle={{}}
      wrapperClass="progress-bar-wrapper"
      borderColor="#F4442E"
      barColor="#51E5FF"
    />
  </div>
);

const ErrorState = ({ title }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Collection unavailable
    </p>
    <h1 className="text-3xl font-extrabold">
      {title || "This collection could not be loaded"}
    </h1>
    <p className="max-w-md text-sm text-slate-400">
      The language you selected may not be available. Try another collection.
    </p>
    <Link
      href="/special/hindi"
      className="mt-3 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
    >
      View Hindi movies
      <AiOutlineArrowRight size={16} aria-hidden="true" />
    </Link>
  </div>
);

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

const SpecialMovieCard = ({ movie }) => (
  <Link
    href={`/movies/${movie.id}`}
    className="group block border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/50"
  >
    <div className="relative aspect-[2/3] overflow-hidden bg-[#04152d]">
      <Image
        src={
          movie.poster_path ? `${imagePath}${movie.poster_path}` : "/noimage.png"
        }
        alt={movie.title ? `${movie.title} poster` : ""}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {movie.vote_average > 0 && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 bg-[#04152d]/90 px-2 py-1 text-xs font-bold text-[#51E5FF] tabular-nums">
          <AiFillStar size={12} aria-hidden="true" />
          {movie.vote_average.toFixed(1)}
        </span>
      )}
    </div>
    <div className="p-3">
      <h3
        title={movie.title}
        className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#51E5FF]"
      >
        {movie.title}
      </h3>
      <p className="mt-1 text-xs text-slate-500 tabular-nums">
        {movie.release_date?.slice(0, 4) ?? "—"} · Movie
      </p>
      <p className="mt-2 line-clamp-2 h-8 text-[11px] leading-4 text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {movie.overview || "No overview available."}
      </p>
    </div>
  </Link>
);

const Specials = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pageId = Number(useSelector((state) => state.tabsSlice.tabs)) || 1;

  const collection = COLLECTIONS.find((item) => item.page === router.query.page);
  const ready = router.isReady && Boolean(collection?.code);

  const { data, isLoading, isError } = useGetSpecialMoviesQuery(
    { pageId, code: collection?.code },
    { skip: !ready }
  );

  useEffect(() => {
    if (ready) dispatch(tabsHandler(1));
  }, [ready, collection?.page, dispatch]);

  useEffect(() => {
    if (data?.total_pages && pageId > data.total_pages) {
      dispatch(tabsHandler(1));
    }
  }, [data?.total_pages, pageId, dispatch]);

  if (!ready) return <Loader />;
  if (isError) return <ErrorState />;

  const movies = data?.results ?? [];
  const featured = movies[0];
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const isLoadingInitial = isLoading && !data;

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
            <span>Collections</span>
            <span className="text-white/20">/</span>
            <span className="truncate text-[#51E5FF]">{collection.label}</span>
          </div>

          <div className="mt-8 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
                Regional spotlight
              </p>
              <h1
                className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
              >
                {collection.name}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                A curated feed of {collection.label} cinema — the most popular
                titles, updated daily from TMDB.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Region
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-white">
                    {collection.region}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Titles
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-white tabular-nums">
                    {totalResults.toLocaleString() || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Page
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-[#51E5FF] tabular-nums">
                    {String(pageId).padStart(2, "0")} /{" "}
                    {String(totalPages).padStart(2, "0")}
                  </p>
                </div>
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
                  Featured · 01
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
                        {featured.vote_average.toFixed(1)}
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
        </div>
      </section>

      <nav className="sticky top-[92px] z-30 border-y border-white/10 bg-[#04152d]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12">
          {COLLECTIONS.map((item) => {
            const active = item.page === collection.page;
            return (
              <Link
                key={item.page}
                href={`/special/${item.page}`}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                    : "border-white/15 text-slate-300 hover:border-[#51E5FF] hover:text-[#51E5FF]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <SectionHeading
          eyebrow="01 / Collection"
          title={`${collection.label} films`}
          description="Popular releases, classics and everything in between."
          action={
            <p className="text-sm text-slate-400 tabular-nums">
              {totalResults.toLocaleString() || "—"} titles · Page {pageId} of{" "}
              {totalPages}
            </p>
          }
        />

        {isLoadingInitial ? (
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`special-skeleton-${index}`}
                className="animate-pulse"
                aria-hidden="true"
              >
                <div className="aspect-[2/3] bg-[#0a1b31]" />
                <div className="mt-3 h-4 w-3/4 bg-[#0a1b31]" />
              </div>
            ))}
          </div>
        ) : movies.length ? (
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <SpecialMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="mt-9 text-sm text-slate-400">
            No movies are available in this collection right now.
          </p>
        )}

        <Pagination
          pages={totalPages}
          current={pageId}
          onChange={(page) => dispatch(tabsHandler(page))}
        />
      </section>
    </div>
  );
};

export default Specials;
