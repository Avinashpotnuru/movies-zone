import { Fragment, memo } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";

import { backdropPath, imagePath } from "@/utilities";

export const Stat = ({ label, value, accent, inline }) => (
  <div
    className={inline ? "" : "border-l border-white/10 px-4 first:border-l-0 first:pl-0"}
  >
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

export const FeaturedMovie = ({ movie, label }) => {
  if (!movie) return null;

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative block aspect-[16/10] overflow-hidden border border-white/20 bg-[#0a1b31] transition-colors hover:border-[#51E5FF]/60"
    >
      <Image
        src={
          movie.backdrop_path
            ? `${backdropPath}${movie.backdrop_path}`
            : "/backgroundImage.jpg"
        }
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/50 to-transparent" />

      <span className="absolute left-4 top-4 border border-white/20 bg-[#04152d]/85 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
        {label}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h2 className="line-clamp-1 text-xl font-extrabold text-white sm:text-2xl">
          {movie.title}
        </h2>
        <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
          {movie.overview || "No overview available."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {movie.vote_average > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-[#04152d]/85 px-2.5 py-1.5 text-sm font-bold text-[#51E5FF] tabular-nums">
              <AiFillStar size={14} aria-hidden="true" />
              {Number(movie.vote_average).toFixed(1)}
            </span>
          )}
          <span className="bg-[#04152d]/85 px-2.5 py-1.5 text-xs font-semibold text-white tabular-nums">
            {movie.release_date?.slice(0, 4) ?? "—"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors group-hover:text-[#51E5FF]">
            View film
            <AiOutlineArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const DiscoverHero = ({
  breadcrumb = [],
  eyebrow,
  title,
  description,
  badges = [],
  featured,
  featuredSlot,
  featuredLabel = "Featured · 01",
  stats = [],
  statsSlot,
  titleSize = "clamp(2.25rem, 5vw, 4rem)",
  gridClassName = "lg:grid-cols-[1.05fr_0.95fr] lg:items-center",
  statsVariant = "grid",
}) => (
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

    <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-14 lg:pt-8">
      {breadcrumb.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400"
        >
          {breadcrumb.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && <span className="text-white/20">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#51E5FF]"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    item.active ? "truncate text-[#51E5FF]" : undefined
                  }
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      )}

      <div className={`mt-8 grid gap-9 ${gridClassName} lg:gap-12`}>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
            {eyebrow}
          </p>
          <h1
            className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
            style={{ fontSize: titleSize }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            {description}
          </p>

          {badges.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={
                    badge.tone === "coral"
                      ? "border border-[#F4442E]/60 bg-[#F4442E]/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F4442E]"
                      : "border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
                  }
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {featuredSlot ?? <FeaturedMovie movie={featured} label={featuredLabel} />}
      </div>

      {(statsSlot || stats.length > 0) && (
        <div
          className={
            statsVariant === "inline"
              ? "mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5"
              : "mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4"
          }
        >
          {statsSlot ??
            stats.map((stat) => (
              <Stat
                key={stat.label}
                {...stat}
                inline={statsVariant === "inline"}
              />
            ))}
        </div>
      )}
    </div>
  </section>
);

export const AppliedFilterChips = ({ chips = [], onClear, className = "mb-6" }) => {
  if (!chips.length) return null;

  return (
    <div className={`${className} border-l-2 border-[#F4442E] bg-white/[0.02] px-4 py-4`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
          Applied
        </span>
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.remove}
            className="flex min-h-[36px] items-center gap-2 border border-[#51E5FF]/40 bg-[#51E5FF]/10 px-3 text-[11px] font-semibold text-[#51E5FF] transition-colors hover:border-[#F4442E] hover:text-[#F4442E]"
          >
            {chip.label}
            <AiOutlineClose size={12} aria-hidden="true" />
          </button>
        ))}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-[36px] px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export const SkeletonGrid = ({
  count = 8,
  variant = "poster",
  className = "mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  showMetaLine = false,
}) => (
  <div className={className} aria-hidden="true">
    {Array.from({ length: count }).map((_, index) =>
      variant === "compact" ? (
        <div
          key={`compact-skeleton-${index}`}
          className="h-[132px] animate-pulse bg-[#0a1b31]"
        />
      ) : (
        <div key={`poster-skeleton-${index}`} className="animate-pulse">
          <div className="aspect-[2/3] bg-[#0a1b31]" />
          {showMetaLine && <div className="mt-3 h-4 w-3/4 bg-[#0a1b31]" />}
        </div>
      )
    )}
  </div>
);

export const EmptyState = ({
  eyebrow = "No matches",
  title = "Nothing fits those filters.",
  description = "Try widening the year range, lowering the rating, or clearing a genre.",
  onReset,
  className = "mt-8",
  headingLevel = "h2",
}) => {
  const Heading = headingLevel;

  return (
    <div className={`${className} border border-white/10 bg-[#0a1b31] px-6 py-14 text-center`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
        {eyebrow}
      </p>
      <Heading className="mt-3 text-2xl font-bold text-white">{title}</Heading>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex min-h-[44px] items-center border border-[#51E5FF] px-5 text-xs font-bold uppercase tracking-[0.18em] text-[#51E5FF] transition-colors hover:bg-[#51E5FF] hover:text-[#04152d]"
        >
          Reset filters
        </button>
      )}
    </div>
  );
};

export const DiscoverErrorState = ({
  eyebrow = "Collection unavailable",
  title = "This collection could not be loaded",
  message = "The filters you selected may be too narrow. Reset them or try another collection.",
  href = "/",
  actionLabel = "Back to home",
  actionIcon,
}) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      {eyebrow}
    </p>
    <h1 className="text-3xl font-extrabold">{title}</h1>
    <p className="max-w-md text-sm text-slate-400">{message}</p>
    <Link
      href={href}
      className="mt-3 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
    >
      {actionIcon || <AiOutlineArrowLeft size={16} aria-hidden="true" />}
      {actionLabel}
    </Link>
  </div>
);

export const MoviePosterCard = memo(function MoviePosterCard({
  movie,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
}) {
  return (
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
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {movie.vote_average > 0 && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 bg-[#04152d]/90 px-2 py-1 text-xs font-bold text-[#51E5FF] tabular-nums">
            <AiFillStar size={12} aria-hidden="true" />
            {Number(movie.vote_average).toFixed(1)}
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
});
