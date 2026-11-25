import Image from "next/image";
import Link from "next/link";

import { AiOutlineArrowLeft } from "react-icons/ai";

import { backdropPath, imagePath } from "@/utilities";

const Stat = ({ label, value, accent }) => (
  <div className="border-white/10 px-4 sm:border-l sm:first:border-l-0 sm:first:pl-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    <p
      className={`mt-1.5 text-sm font-bold tabular-nums ${
        accent ? "text-[#51E5FF]" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

const MovieDetailsHero = ({ id, meta, actionsSlot }) => {
  const backdropSrc = meta?.backdrop_path
    ? `${backdropPath}${meta.backdrop_path}`
    : "/backgroundImage.jpg";
  const posterSrc = meta?.poster_path
    ? `${imagePath}${meta.poster_path}`
    : "/noimage.png";
  const year = meta?.release_date?.slice(0, 4) || "—";
  const rating = meta?.vote_average > 0 ? meta.vote_average.toFixed(1) : "";
  const votes = meta?.vote_count ? meta.vote_count.toLocaleString() : "—";
  const runtime = meta?.runtime ?? 0;
  const genres = meta?.genres ?? [];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backdropSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-[#04152d]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-12 pt-16 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#51E5FF]"
          >
            <AiOutlineArrowLeft size={14} aria-hidden="true" />
            Back
          </Link>
          <span className="text-white/20">/</span>
          <span>Movies</span>
          <span className="text-white/20">/</span>
          <span className="truncate text-[#51E5FF]">
            {meta?.title || "Details"}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-end lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="relative hidden aspect-[2/3] overflow-hidden border border-white/20 bg-[#0a1b31] shadow-2xl shadow-black/50 sm:block">
            <Image
              src={posterSrc}
              alt={meta?.title ? `${meta.title} poster` : "Movie poster"}
              fill
              priority
              sizes="(max-width: 1024px) 150px, 340px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="float-left mr-4 mb-2 w-24 sm:hidden">
              <div className="relative aspect-[2/3] overflow-hidden border border-white/20 bg-[#0a1b31] shadow-xl shadow-black/50">
                <Image
                  src={posterSrc}
                  alt={meta?.title ? `${meta.title} poster` : "Movie poster"}
                  fill
                  priority
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
              Feature film · {year}
            </p>
            <h1 className="mt-4 text-[clamp(1.75rem,6.5vw,2.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-[clamp(2rem,4.6vw,4rem)] sm:leading-[0.95]">
              {meta?.title || "Untitled"}
            </h1>

            {meta?.tagline && (
              <p className="mt-3 text-sm font-semibold leading-snug text-slate-300 sm:text-lg sm:leading-normal">
                “{meta.tagline}”
              </p>
            )}

            <div className="clear-both sm:hidden" />

            <p className="mt-5 line-clamp-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {meta?.overview || "No overview available for this title."}
            </p>

            {genres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="border border-[#51E5FF]/30 bg-[#0a1b31] px-3 py-1 text-xs font-semibold text-[#51E5FF]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {actionsSlot}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
          <Stat label="Rating" value={rating ? `${rating} / 10` : "—"} accent />
          <Stat label="Votes" value={votes} />
          <Stat label="Runtime" value={`${Math.floor(runtime / 60)}h ${runtime % 60}m`} />
          <Stat label="Status" value={meta?.status || "—"} />
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsHero;
