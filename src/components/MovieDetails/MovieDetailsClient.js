"use client";
import Image from "next/image";
import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";

import { useGetMovieFullDetailsByIdQuery } from "@/store/api/restApis";
import { imagePath } from "@/utilities";

import CastCard from "../CastCard";
import LoadingRing from "../LoadingRing";

const MAX_CAST = 12;
const MAX_CREW = 8;
const MAX_VIDEOS = 7;
const MAX_SIMILAR = 10;

const pad = (value) => String(value ?? 0).padStart(2, "0");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
};

const formatMoney = (value) =>
  value > 0 ? currencyFormatter.format(value) : "—";

const formatLanguage = (code) => {
  if (!code) return "—";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(code) ||
      code.toUpperCase()
    );
  } catch {
    return code.toUpperCase();
  }
};

const homepageInfo = (url) => {
  if (!url) return { href: null, label: "—" };
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) return { href: null, label: "—" };
    return {
      href: parsed.href,
      label: parsed.hostname.replace(/^www\./, ""),
    };
  } catch {
    return { href: null, label: "—" };
  }
};

const PRIORITY_CREW_JOBS = [
  "Director",
  "Screenplay",
  "Writer",
  "Producer",
  "Director of Photography",
  "Original Music Composer",
  "Editor",
];

const Loader = () => <LoadingRing label="movie-loading" />;

const ErrorState = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Something went wrong
    </p>
    <h1 className="text-3xl font-extrabold">Movie details unavailable</h1>
    <p className="max-w-md text-sm text-slate-400">
      This title could not be loaded. Please go back and try again.
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

const SectionHeading = ({ eyebrow, title, description }) => (
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
  </div>
);

const Fact = ({ label, value, href }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex max-w-full items-center gap-2 text-sm font-bold text-[#51E5FF] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
      >
        <span className="truncate">{value}</span>
        <AiOutlineArrowRight size={14} aria-hidden="true" />
      </a>
    ) : (
      <p title={value} className="mt-2 break-words text-sm font-bold text-white">
        {value}
      </p>
    )}
  </div>
);

const VideoFeature = ({ video, onPlay }) => (
  <button
    type="button"
    onClick={() => onPlay(video)}
    aria-label={`Play ${video.name || "video"}`}
    className="group block w-full border border-white/10 bg-[#04152d] text-left transition-colors duration-300 hover:border-[#51E5FF]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
  >
    <div className="relative aspect-video overflow-hidden">
      <div
        role="img"
        aria-label={video.name || "Video thumbnail"}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${video.key}/hqdefault.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/25 to-transparent" />

      <span className="absolute left-4 top-4 border border-white/20 bg-[#04152d]/85 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
        {video.type || "Video"}
      </span>
      <span className="absolute right-4 top-4 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Official footage
      </span>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center border border-white/40 bg-[#04152d]/75 text-white transition duration-300 group-hover:scale-95 group-hover:border-[#F4442E] group-hover:bg-[#F4442E]">
          <BsFillPlayFill size={30} aria-hidden="true" />
        </span>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
          Featured trailer
        </p>
        <h3 className="mt-2 max-w-2xl text-xl font-extrabold leading-tight text-white sm:text-2xl">
          {video.name}
        </h3>
      </div>
    </div>

    <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Play in Movies-Zone
      </p>
      <AiOutlineArrowRight
        size={16}
        aria-hidden="true"
        className="text-[#51E5FF] transition-transform duration-300 group-hover:translate-x-1"
      />
    </div>
  </button>
);

const VideoListRow = ({ video, index, onPlay }) => (
  <button
    type="button"
    onClick={() => onPlay(video)}
    aria-label={`Play ${video.name || "video"}`}
    className="group flex w-full items-center gap-3 border-b border-white/10 p-3 text-left transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#51E5FF]"
  >
    <span className="w-6 shrink-0 text-lg font-black leading-none text-white/20 tabular-nums">
      {pad(index + 2)}
    </span>

    <div className="relative aspect-video w-20 shrink-0 overflow-hidden bg-[#04152d] sm:w-24">
      <div
        role="img"
        aria-label={video.name || "Video thumbnail"}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${video.key}/hqdefault.jpg)`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-[#04152d]/30 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <BsFillPlayFill size={20} aria-hidden="true" />
      </span>
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
        {video.type || "Video"}
      </p>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#51E5FF] sm:text-sm">
        {video.name}
      </p>
    </div>

    <AiOutlineArrowRight
      size={15}
      aria-hidden="true"
      className="hidden shrink-0 text-slate-600 transition-colors duration-300 group-hover:text-[#51E5FF] sm:block"
    />
  </button>
);

const VideoModal = ({ video, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!video) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020915]/90 p-5 backdrop-blur-sm sm:p-10"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Video player: ${video.name || "video"}`}
        className="border border-white/15 bg-[#04152d] shadow-2xl shadow-black/60"
        style={{
          width: "min(80vw, 40rem, calc(60vh * 16 / 9))",
          maxHeight: "78vh",
          overflowY: "auto",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
              {video.type || "Video"} · Playing in Movies-Zone
            </p>
            <h2 className="mt-2 truncate text-lg font-extrabold text-white sm:text-xl">
              {video.name || "Official video"}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#F4442E] hover:text-[#F4442E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
          >
            <AiOutlineClose size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={video.key}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
              video.key
            )}?autoplay=1&rel=0&modestbranding=1`}
            title={video.name || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 sm:px-5 sm:py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Press Escape to close
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Source · YouTube
          </p>
        </div>
      </div>
    </div>
  );
};

const SimilarCard = ({ movie }) => (
  <Link
    href={`/movies/${movie.id}`}
    className="group block border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/50"
  >
    <div className="relative aspect-[2/3] overflow-hidden bg-[#04152d]">
      <Image
        src={
          movie.poster_path
            ? `${imagePath}${movie.poster_path}`
            : "/noimage.png"
        }
        alt={movie.title ? `${movie.title} poster` : ""}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {movie.vote_average > 0 && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 bg-[#04152d]/90 px-2 py-1 text-[11px] font-bold text-[#51E5FF] tabular-nums">
          <AiFillStar size={11} aria-hidden="true" />
          {movie.vote_average.toFixed(1)}
        </span>
      )}
    </div>
    <div className="p-2.5">
      <h3
        title={movie.title}
        className="line-clamp-1 text-xs font-bold leading-snug text-white transition-colors group-hover:text-[#51E5FF]"
      >
        {movie.title}
      </h3>
      <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
        {movie.release_date?.slice(0, 4) ?? "—"}
      </p>
    </div>
  </Link>
);

const MovieDetails = ({ id }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const closeVideo = useCallback(() => setActiveVideo(null), []);
  const ready = Boolean(id);

  const { data, isLoading, isError } = useGetMovieFullDetailsByIdQuery(
    { id },
    { skip: !ready }
  );

  useEffect(() => {
    const onPlay = (event) => setActiveVideo(event.detail);
    window.addEventListener("movies-zone:play-video", onPlay);
    return () => window.removeEventListener("movies-zone:play-video", onPlay);
  }, []);

  if (!ready || isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  const cast = (data.credits?.cast ?? [])
    .filter((person, index, list) => {
      const key = person?.id ?? person?.name;
      return list.findIndex((item) => (item?.id ?? item?.name) === key) === index;
    })
    .slice(0, MAX_CAST);
  const allCrew = data.credits?.crew ?? [];
  const priorityCrew = allCrew
    .filter((person) => PRIORITY_CREW_JOBS.includes(person.job))
    .sort(
      (a, b) =>
        PRIORITY_CREW_JOBS.indexOf(a.job) -
        PRIORITY_CREW_JOBS.indexOf(b.job)
    );
  const seenCrewJobs = new Set();
  const onePerPriorityJob = priorityCrew.filter((person) => {
    if (seenCrewJobs.has(person.job)) return false;
    seenCrewJobs.add(person.job);
    return true;
  });
  const rankedCrew = [
    ...onePerPriorityJob,
    ...priorityCrew.filter((person) => !onePerPriorityJob.includes(person)),
  ];
  const crew = rankedCrew.length
    ? rankedCrew.slice(0, MAX_CREW)
    : allCrew.slice(0, MAX_CREW);

  const videos =
    data.videos?.results
      ?.filter((video) => video.site === "YouTube" && video.key)
      .slice(0, MAX_VIDEOS) ?? [];
  const trailer = videos.find((video) => video.type === "Trailer") ?? videos[0];
  const orderedVideos = trailer
    ? [trailer, ...videos.filter((video) => video.id !== trailer.id)]
    : videos;

  const similar = data.similar?.results?.slice(0, MAX_SIMILAR) ?? [];
  const releaseDate = formatDate(data.release_date);
  const originalTitle = data.original_title || data.title || "—";
  const language = formatLanguage(data.original_language);
  const budget = formatMoney(data.budget);
  const revenue = formatMoney(data.revenue);
  const homepage = homepageInfo(data.homepage);
  const companies = [
    ...new Set(
      (data.production_companies ?? [])
        .map((company) => company.name)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="bg-[#04152d] text-white">
      <section className="border-y border-white/10 bg-[#061a31]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="04 / Archive"
            title="Film facts"
            description="The details that round out this title."
          />

          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <Fact label="Release date" value={releaseDate} />
            <Fact label="Original title" value={originalTitle} />
            <Fact label="Original language" value={language} />
            <Fact label="Budget" value={budget} />
            <Fact label="Revenue" value={revenue} />
            <Fact label="Homepage" value={homepage.label} href={homepage.href} />
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Production companies
            </p>
            {companies.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {companies.map((company) => (
                  <span
                    key={company}
                    className="border border-white/10 bg-[#04152d] px-3 py-2 text-xs font-semibold text-slate-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm font-bold text-white">—</p>
            )}
          </div>
        </div>
      </section>

      <nav className="sticky top-[76px] z-30 border-y border-white/10 bg-[#04152d]/95 backdrop-blur-sm sm:top-[88px]">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {[
            { href: "#cast", label: "Cast & crew" },
            { href: "#videos", label: "Videos" },
            { href: "#similar", label: "Similar" },
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
        id="cast"
        className="mx-auto max-w-[1400px] scroll-mt-32 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <SectionHeading
          eyebrow="01 / People"
          title="Cast & crew"
          description="The faces and the minds behind this film."
        />

        <div className="mt-9 grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Top billed cast
            </p>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cast.length ? (
                cast.map((person, index) => (
                  <CastCard
                    key={`${person.id ?? person.name ?? "cast"}-${index}`}
                    person={person}
                    role={person.character || "Cast"}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex min-h-[180px] w-full items-center justify-center border border-dashed border-white/15 bg-[#0a1b31]/40 px-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      No cast information yet
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                      Cast details have not been provided for this title.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0a1b31] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Key crew
            </p>
            <div className="mt-4 divide-y divide-white/10">
              {crew.length ? (
                crew.map((person) => (
                  <div
                    key={`${person.id}-${person.job}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <Link
                      href={`/cast/${person.id}`}
                      className="truncate text-sm font-semibold text-white transition-colors hover:text-[#51E5FF]"
                    >
                      {person.name}
                    </Link>
                    <span className="shrink-0 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#51E5FF]">
                      {person.job}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-3 text-sm text-slate-400">
                  Crew information is not available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="videos"
        className="scroll-mt-32 border-y border-white/10 bg-[#061a31]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <SectionHeading
            eyebrow="02 / Media"
            title="Videos & trailers"
            description="A closer look through official clips, teasers and trailers."
          />

          {orderedVideos.length ? (
            <div
              className={`mt-10 grid gap-4 ${
                orderedVideos.length > 1
                  ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]"
                  : ""
              }`}
            >
              <VideoFeature video={orderedVideos[0]} onPlay={setActiveVideo} />

              {orderedVideos.length > 1 ? (
                <div className="border border-white/10 bg-[#04152d]">
                  <div className="flex items-end justify-between gap-4 border-b border-white/10 p-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                        Clip index
                      </p>
                      <p className="mt-2 text-4xl font-black leading-none text-white tabular-nums">
                        {pad(orderedVideos.length)}
                      </p>
                    </div>
                    <p className="text-right text-[9px] font-bold uppercase leading-relaxed tracking-[0.18em] text-slate-600">
                      YouTube
                      <br />
                      Official archive
                    </p>
                  </div>

                  <div>
                    {orderedVideos.slice(1).map((video, index) => (
                      <VideoListRow
                        key={`${video.id}-${video.key}`}
                        video={video}
                        index={index}
                        onPlay={setActiveVideo}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-9 flex min-h-[260px] items-center justify-center border border-dashed border-white/15 bg-[#04152d]/40 px-5 text-center">
              <div>
                <span className="mx-auto flex h-12 w-12 items-center justify-center border border-white/15 text-[#51E5FF]">
                  <BsFillPlayFill size={24} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-bold text-white">
                  No footage in the archive
                </p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  Official clips and trailers have not been added for this title.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="similar"
        className="mx-auto max-w-[1400px] scroll-mt-32 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <SectionHeading
          eyebrow="03 / Keep watching"
          title="More like this"
          description="If you liked this one, these are worth a look."
        />

        {similar.length ? (
          <div className="mt-9 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {similar.map((movie) => (
              <SimilarCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-400">
            No similar movies are available right now.
          </p>
        )}
      </section>

      <VideoModal video={activeVideo} onClose={closeVideo} />
    </div>
  );
};

export default MovieDetails;
