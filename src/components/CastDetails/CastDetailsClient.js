"use client";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineZoomIn,
} from "react-icons/ai";
import { useGetCastFullDetailsQuery } from "@/store/api/restApis";
import { backdropPath, imagePath } from "@/utilities";

import LoadingRing from "../LoadingRing";

const CREDIT_PAGE_SIZE = 12;

const Loader = () => <LoadingRing label="profile-loading" />;

const ErrorState = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Something went wrong
    </p>
    <h1 className="text-3xl font-extrabold">Profile unavailable</h1>
    <p className="max-w-md text-sm text-slate-400">
      This person could not be loaded. Please go back and try again.
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

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
    <div className="min-w-0">
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
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

const CreditCard = ({ credit }) => {
  const isMovie = credit.media_type === "movie";
  const title = credit.title || credit.name || "Untitled";
  const year = (credit.release_date || credit.first_air_date)?.slice(0, 4) ?? "—";
  const rating = credit.vote_average?.toFixed(1);

  const content = (
    <>
      <div className="relative aspect-[2/3] overflow-hidden bg-[#04152d]">
        <Image
          src={
            credit.poster_path
              ? `${imagePath}${credit.poster_path}`
              : "/noimage.png"
          }
          alt=""
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-1.5 top-1.5 border border-white/20 bg-[#04152d]/85 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-300">
          {isMovie ? "Movie" : "TV"}
        </span>
        {rating && credit.vote_average > 0 && (
          <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 bg-[#04152d]/90 px-1.5 py-0.5 text-[10px] font-bold text-[#51E5FF] tabular-nums">
            <AiFillStar size={10} aria-hidden="true" />
            {rating}
          </span>
        )}
      </div>
      <div className="p-2">
        <h3
          title={title}
          className="line-clamp-1 text-[11px] font-bold text-white transition-colors group-hover:text-[#51E5FF]"
        >
          {title}
        </h3>
        <p
          title={credit.character}
          className="mt-0.5 line-clamp-1 text-[10px] text-slate-400"
        >
          {credit.character || "Cast"}
        </p>
        <p className="mt-0.5 text-[10px] text-slate-500 tabular-nums">{year}</p>
      </div>
    </>
  );

  const className =
    "group block border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/50";

  return isMovie ? (
    <Link href={`/movies/${credit.id}`} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
};

const GalleryTile = ({
  photo,
  index,
  total,
  name,
  className = "",
  sizes,
  priority = false,
  featured = false,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`View photo ${index + 1} of ${total}`}
    className={`group relative overflow-hidden bg-[#04152d] transition-colors duration-300 hover:bg-[#0a1b31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#51E5FF] ${className}`}
  >
    <Image
      src={`${imagePath}${photo.file_path}`}
      alt={`${name || "Cast"} photo ${index + 1}`}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#04152d]/90 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-50" />

    <span
      className={`absolute top-0 left-0 h-0.5 bg-[#F4442E] transition-all duration-500 group-hover:w-full ${
        featured ? "w-16" : "w-0"
      }`}
      aria-hidden="true"
    />

    <span className="absolute left-3 top-3 text-[10px] font-bold tracking-[0.18em] text-[#51E5FF] tabular-nums">
      {String(index + 1).padStart(2, "0")}
    </span>

    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
      <div className="min-w-0">
        {featured ? (
          <>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#51E5FF]">
              Featured frame
            </p>
            <p className="mt-1 truncate text-sm font-bold text-white">
              {name || "Official photography"}
            </p>
          </>
        ) : (
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 tabular-nums">
            {String(total).padStart(2, "0")} frames
          </p>
        )}
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/20 bg-[#04152d]/85 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <AiOutlineZoomIn size={15} aria-hidden="true" />
      </span>
    </div>
  </button>
);

const CastDetails = ({ id }) => {
  const ready = Boolean(id);

  const { data, isLoading, isError } = useGetCastFullDetailsQuery(
    { id },
    { skip: !ready }
  );
  const [mediaFilter, setMediaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [activePhoto, setActivePhoto] = useState(null);
  const [visibleCount, setVisibleCount] = useState(CREDIT_PAGE_SIZE);

  const photoCount =
    (data?.images?.profiles ?? []).filter((photo) => photo.file_path).length;

  useEffect(() => {
    if (activePhoto === null) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [activePhoto]);

  useEffect(() => {
    if (activePhoto === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePhoto(null);
      }
      if (event.key === "ArrowLeft") {
        setActivePhoto((prev) => (prev - 1 + photoCount) % photoCount);
      }
      if (event.key === "ArrowRight") {
        setActivePhoto((prev) => (prev + 1) % photoCount);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhoto, photoCount]);

  useEffect(() => {
    setVisibleCount(CREDIT_PAGE_SIZE);
  }, [mediaFilter, sortBy]);

  if (!ready || isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  const credits = (data.combined_credits?.cast ?? [])
    .filter(
      (item, index, list) =>
        list.findIndex(
          (other) => other.id === item.id && other.media_type === item.media_type
        ) === index
    )
    .sort(
      (a, b) =>
        (b.popularity ?? b.vote_count ?? 0) - (a.popularity ?? a.vote_count ?? 0)
    );

  const crewCredits = (data.combined_credits?.crew ?? [])
    .filter(
      (item, index, list) =>
        list.findIndex(
          (other) => other.id === item.id && other.media_type === item.media_type
        ) === index
    )
    .sort(
      (a, b) =>
        (b.popularity ?? b.vote_count ?? 0) - (a.popularity ?? a.vote_count ?? 0)
    )
    .slice(0, 12);

  const knownFor = credits.slice(0, 4);

  const filteredCredits = credits.filter((credit) =>
    mediaFilter === "all" ? true : credit.media_type === mediaFilter
  );

  const movieCount = credits.filter((credit) => credit.media_type === "movie").length;
  const tvCount = credits.filter((credit) => credit.media_type === "tv").length;
  const years = credits
    .map((credit) =>
      Number((credit.release_date || credit.first_air_date)?.slice(0, 4))
    )
    .filter((year) => Number.isFinite(year) && year > 0);
  const firstYear = years.length ? Math.min(...years) : "—";
  const lastYear = years.length ? Math.max(...years) : "—";

  const sortValue = (credit) => {
    if (sortBy === "newest") {
      return Number((credit.release_date || credit.first_air_date)?.slice(0, 4)) || 0;
    }
    if (sortBy === "rating") return credit.vote_average ?? 0;
    return credit.popularity ?? credit.vote_count ?? 0;
  };
  const visibleCredits = [...filteredCredits].sort(
    (a, b) => sortValue(b) - sortValue(a)
  );
  const shownCredits = visibleCredits.slice(0, visibleCount);
  const remainingCredits = visibleCredits.length - shownCredits.length;

  const photos = (data.images?.profiles ?? []).filter((photo) => photo.file_path);
  const galleryPhotos = photos.slice(0, 9);

  return (
    <div className="bg-[#04152d] text-white">
      <nav className="sticky top-[76px] z-30 border-y border-white/10 bg-[#04152d]/95 backdrop-blur-sm sm:top-[92px]">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {[
            { href: "#known-for", label: "Known for" },
            { href: "#filmography", label: "Filmography" },
            { href: "#crew", label: "Crew" },
            { href: "#photos", label: "Photos" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 border-b-2 border-transparent py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        id="known-for"
        className="scroll-mt-32 border-b border-white/10 bg-[#0a1b31]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="01 / Spotlight"
            title="Best known for"
            description="The titles most often associated with this person."
          />

          {knownFor.length ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {knownFor.map((credit) => {
                const title = credit.title || credit.name || "Untitled";
                const year =
                  (credit.release_date || credit.first_air_date)?.slice(0, 4) ??
                  "—";
                const image = credit.backdrop_path || credit.poster_path;
                const isMovie = credit.media_type === "movie";

                const card = (
                  <>
                    <Image
                      src={
                        image
                          ? `${backdropPath}${image}`
                          : "/backgroundImage.jpg"
                      }
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
                        {year} · {isMovie ? "Movie" : "TV"}
                      </p>
                      <h3 className="mt-1.5 line-clamp-1 text-sm font-bold text-white">
                        {title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                        {credit.character || credit.job || "Cast"}
                      </p>
                    </div>
                  </>
                );

                const className =
                  "group relative block aspect-[16/10] overflow-hidden border border-white/10 bg-[#04152d] transition-colors duration-300 hover:border-[#51E5FF]/50";

                return isMovie ? (
                  <Link
                    key={`known-${credit.media_type}-${credit.id}`}
                    href={`/movies/${credit.id}`}
                    className={className}
                  >
                    {card}
                  </Link>
                ) : (
                  <div
                    key={`known-${credit.media_type}-${credit.id}`}
                    className={className}
                  >
                    {card}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-7 text-sm text-slate-400">
              No spotlight titles are available.
            </p>
          )}
        </div>
      </section>

      <section
        id="filmography"
        className="scroll-mt-32 border-t border-white/10 bg-[#04152d]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <SectionHeading
            eyebrow="02 / Work"
            title="Filmography"
            description="Selected acting credits across film and television."
          />

          <div className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="min-w-0 space-y-6">
              <div className="border border-white/10 bg-[#0a1b31] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                  Refine
                </p>
                <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col">
                  {[
                    { value: "all", label: "All work", count: credits.length },
                    { value: "movie", label: "Movies", count: movieCount },
                    { value: "tv", label: "TV series", count: tvCount },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMediaFilter(option.value)}
                      className={`flex shrink-0 items-center justify-between gap-4 border px-3 py-2.5 text-left text-xs font-bold transition-colors lg:w-full ${
                        mediaFilter === option.value
                          ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                          : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {option.label}
                      <span className="tabular-nums opacity-60">
                        {String(option.count).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-[#0a1b31] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                  Sort by
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1 lg:grid-cols-1">
                  {[
                    { value: "popular", label: "Popular" },
                    { value: "newest", label: "Newest" },
                    { value: "rating", label: "Rating" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortBy(option.value)}
                      className={`border px-2 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors lg:px-3 ${
                        sortBy === option.value
                          ? "border-[#F4442E]/60 text-[#F4442E]"
                          : "border-white/10 text-slate-500 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Career span
                </p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-white tabular-nums">
                  {firstYear} <span className="text-[#51E5FF]">—</span> {lastYear}
                </p>
                <p className="mt-1 text-xs text-slate-500 tabular-nums">
                  {credits.length} credited works
                </p>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <p className="text-sm font-semibold text-white">
                  {mediaFilter === "all"
                    ? "All work"
                    : mediaFilter === "movie"
                    ? "Movies"
                    : "TV series"}
                  <span className="ml-2 text-slate-500 tabular-nums">
                    / {filteredCredits.length} titles
                  </span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Sorted by {sortBy}
                </p>
              </div>

              {shownCredits.length ? (
                <>
                  <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {shownCredits.map((credit) => (
                      <CreditCard
                        key={`${credit.media_type}-${credit.id}`}
                        credit={credit}
                      />
                    ))}
                  </div>

                  {visibleCredits.length > CREDIT_PAGE_SIZE && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <p className="text-xs text-slate-500 tabular-nums">
                        Showing {shownCredits.length} of {visibleCredits.length}{" "}
                        credits
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {visibleCount > CREDIT_PAGE_SIZE && (
                          <button
                            type="button"
                            onClick={() => setVisibleCount(CREDIT_PAGE_SIZE)}
                            className="border border-white/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors hover:border-white/40 hover:text-white"
                          >
                            Show less
                          </button>
                        )}
                        {remainingCredits > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setVisibleCount((count) => count + CREDIT_PAGE_SIZE)
                            }
                            className="inline-flex items-center gap-2 border border-[#51E5FF] bg-[#51E5FF] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#04152d] transition-colors hover:bg-transparent hover:text-[#51E5FF]"
                          >
                            Show more
                            <span className="tabular-nums opacity-70">
                              +{Math.min(remainingCredits, CREDIT_PAGE_SIZE)}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-6 flex min-h-[220px] items-center justify-center border border-dashed border-white/15 bg-[#0a1b31]/40 px-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      No credits in this category
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                      Try another filter — this person may not have credits here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="crew" className="border-y border-white/10 bg-[#0a1b31]">
        <div className="mx-auto max-w-[1400px] scroll-mt-32 px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <SectionHeading
            eyebrow="03 / Behind the camera"
            title="Crew credits"
            description="Work behind the lens, from directing to production."
          />

          {crewCredits.length ? (
            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {crewCredits.map((credit) => {
                const title = credit.title || credit.name || "Untitled";
                const year =
                  (credit.release_date || credit.first_air_date)?.slice(0, 4) ??
                  "—";
                const isMovie = credit.media_type === "movie";

                const content = (
                  <>
                    <div className="relative h-[84px] w-[56px] shrink-0 overflow-hidden border border-white/10 bg-[#04152d]">
                      <Image
                        src={
                          credit.poster_path
                            ? `${imagePath}${credit.poster_path}`
                            : "/noimage.png"
                        }
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#51E5FF]">
                        {credit.job || credit.department || "Crew"}
                      </p>
                      <h3
                        title={title}
                        className="mt-1 line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#51E5FF]"
                      >
                        {title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {year} · {credit.department || (isMovie ? "Movie" : "TV")}
                      </p>
                    </div>
                  </>
                );

                const className =
                  "group flex items-center gap-3 border border-white/10 bg-[#04152d] p-3 transition-colors duration-300 hover:border-[#51E5FF]/50";

                return isMovie ? (
                  <Link
                    key={`crew-${credit.media_type}-${credit.id}-${credit.job}`}
                    href={`/movies/${credit.id}`}
                    className={className}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={`crew-${credit.media_type}-${credit.id}-${credit.job}`}
                    className={className}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-slate-400">
              No crew credits are available for this person.
            </p>
          )}
        </div>
      </section>

      <section
        id="photos"
        className="scroll-mt-32 border-y border-white/10 bg-[#061a31]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-[116px] lg:self-start">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#F4442E]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                  04 / Gallery
                </p>
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Photos
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                A closer look through official profile photography.
              </p>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-5xl font-black leading-none tracking-tight text-white tabular-nums">
                  {String(photos.length).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  frames in archive
                </p>
              </div>

              <a
                href={`https://www.themoviedb.org/person/${id}/images`}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-fit items-center gap-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
              >
                View all on TMDB
                <AiOutlineArrowRight size={15} aria-hidden="true" />
              </a>

              <div className="mt-10 hidden border-t border-white/10 pt-5 lg:block">
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.18em] text-slate-600">
                  Select a frame to expand · ← → to navigate · Esc to close
                </p>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Official stills / Contact sheet
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 tabular-nums">
                  01 — {String(galleryPhotos.length).padStart(2, "0")}
                </p>
              </div>

              {galleryPhotos.length ? (
                <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryPhotos.map((photo, index) => (
                    <GalleryTile
                      key={`${photo.file_path}-${index}`}
                      photo={photo}
                      index={index}
                      total={photos.length}
                      name={data.name}
                      featured={index === 0}
                      priority={index === 0}
                      onClick={() => setActivePhoto(index)}
                      sizes={
                        index === 0
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                          : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      }
                      className={
                        index === 0 ? "col-span-2 row-span-2" : "aspect-[3/4]"
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center border border-dashed border-white/15 bg-[#04152d]/40 px-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      No photos available
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                      Official profile imagery has not been added for this person.
                    </p>
                  </div>
                </div>
              )}

              {photos.length > 9 && (
                <p className="mt-4 text-xs text-slate-500 tabular-nums">
                  Showing 9 of {photos.length} official images
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {activePhoto !== null && photos[activePhoto] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020a16]/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-[#04152d]/85 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
          >
            <AiOutlineClose size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActivePhoto((prev) => (prev - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-[#04152d]/85 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] sm:left-8"
          >
            <AiOutlineLeft size={18} aria-hidden="true" />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={`${imagePath}${photos[activePhoto].file_path}`}
              alt={`${data.name || "Cast"} photo ${activePhoto + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActivePhoto((prev) => (prev + 1) % photos.length);
            }}
            aria-label="Next photo"
            className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-[#04152d]/85 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] sm:right-8"
          >
            <AiOutlineRight size={18} aria-hidden="true" />
          </button>

          <div
            className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#04152d]/80 px-5 py-4 backdrop-blur-sm sm:px-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                Gallery frame
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {data.name || "Cast"}
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 tabular-nums">
              {String(activePhoto + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:block">
              ← → navigate · Esc close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CastDetails;
