import Image from "next/image";
import Link from "next/link";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";

import { useGetMovieImagesQuery } from "@/store/api/restApis";

const TMDB_BASE = "https://image.tmdb.org/t/p/";

const imageUrl = (path, size = "w780") =>
  path ? `${TMDB_BASE}${size}${path}` : "/noimage.png";

const FILTERS = [
  { id: "all", label: "All frames" },
  { id: "backdrops", label: "Backdrops" },
  { id: "posters", label: "Posters" },
];

const PAGE_SIZE = 18;

const Stat = ({ value, label, accent }) => (
  <div className="flex items-baseline gap-3 border-l border-white/10 pl-4 first:border-l-0 first:pl-0 sm:pl-6">
    <span
      className={`text-3xl font-bold tabular-nums sm:text-4xl ${
        accent ? "text-[#51E5FF]" : "text-white"
      }`}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
      {label}
    </span>
  </div>
);

const GalleryTile = ({ item, index, type, onOpen }) => {
  const isBackdrop = type === "backdrops";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${isBackdrop ? "backdrop" : "poster"} ${index + 1}`}
      className={`group relative overflow-hidden border border-white/10 bg-[#0a1b31] text-left transition-colors duration-300 hover:border-[#51E5FF]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] ${
        isBackdrop
          ? "col-span-2 aspect-[16/10] md:col-span-2"
          : "col-span-1 aspect-[2/3] md:col-span-1"
      }`}
    >
      <Image
        src={imageUrl(item.file_path, isBackdrop ? "w780" : "w500")}
        alt=""
        fill
        sizes={
          isBackdrop
            ? "(max-width: 767px) 100vw, (max-width: 1023px) 66vw, 60vw"
            : "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw"
        }
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <span className="absolute left-3 top-3 border border-white/20 bg-[#04152d]/80 px-2 py-1 text-[10px] font-bold tabular-nums text-[#51E5FF] backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#04152d] via-[#04152d]/70 to-transparent px-3 pb-3 pt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {isBackdrop ? "Backdrop" : "Poster"}
        <AiOutlineArrowRight size={14} aria-hidden="true" />
      </span>
    </button>
  );
};

const Lightbox = ({ items, index, title, onClose, onStep }) => {
  const current = items[index];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onStep(-1);
      if (event.key === "ArrowRight") onStep(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onStep]);

  if (!current) return null;

  const isBackdrop = current.type === "backdrops";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image ${index + 1} of ${items.length}`}
      className="fixed inset-0 z-[60] flex flex-col bg-[#020a16]/95 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
            Image archive
          </p>
          <h2 className="truncate text-lg font-bold text-white sm:text-xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-bold tabular-nums text-slate-400 sm:block">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#F4442E] hover:text-[#F4442E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
          >
            <AiOutlineClose size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-6 sm:px-16">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Previous image"
          className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-[#04152d]/70 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] sm:left-5"
        >
          <AiOutlineArrowLeft size={20} aria-hidden="true" />
        </button>

        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            key={current.file_path}
            src={imageUrl(current.file_path, "original")}
            alt={`${title} ${isBackdrop ? "backdrop" : "poster"} ${index + 1}`}
            width={isBackdrop ? 1920 : 1000}
            height={isBackdrop ? 1080 : 1500}
            className="max-h-[72vh] max-w-full object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Next image"
          className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-[#04152d]/70 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] sm:right-5"
        >
          <AiOutlineArrowRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <span className="text-[#51E5FF]">
          {isBackdrop ? "Backdrop" : "Poster"}
        </span>
        <span className="h-1 w-1 bg-white/30" />
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const ImagesComponent = ({ id, meta }) => {
  const { data, isLoading } = useGetMovieImagesQuery({ id });
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const title = meta?.title || "Movie gallery";
  const featured = data?.backdrops?.[0]?.file_path || meta?.backdrop_path || "";

  const backdrops = useMemo(() => data?.backdrops ?? [], [data?.backdrops]);
  const posters = useMemo(() => data?.posters ?? [], [data?.posters]);

  const items = useMemo(() => {
    if (filter === "backdrops") {
      return backdrops.map((item) => ({ ...item, type: "backdrops" }));
    }
    if (filter === "posters") {
      return posters.map((item) => ({ ...item, type: "posters" }));
    }
    return [
      ...backdrops.map((item) => ({ ...item, type: "backdrops" })),
      ...posters.map((item) => ({ ...item, type: "posters" })),
    ];
  }, [backdrops, posters, filter]);

  useEffect(() => {
    setLightboxIndex(null);
    setVisibleCount(PAGE_SIZE);
  }, [filter]);

  const step = useCallback(
    (delta) => {
      setLightboxIndex((current) => {
        if (current === null || !items.length) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <section className="bg-[#04152d] text-white">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-8 sm:px-8 lg:px-12">
        <Link
          href={`/movies/${id}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 transition-colors hover:text-[#51E5FF]"
        >
          <AiOutlineArrowLeft size={14} aria-hidden="true" />
          Back to film
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              04 / Image archive
            </p>
            <h1 className="mt-4 text-[clamp(2.1rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white">
              {title}
              <span className="ml-3 text-[#F4442E]">.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Posters, backdrops and production stills — the full visual record
              behind the film. Select any frame to view it full screen.
            </p>
          </div>

          {featured && (
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#0a1b31] sm:aspect-[16/8]">
              <Image
                src={imageUrl(featured, "w1280")}
                alt={`${title} featured artwork`}
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover object-center"
                priority
              />
              <span className="absolute bottom-3 left-3 border border-white/20 bg-[#04152d]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#51E5FF] backdrop-blur-sm">
                Featured frame
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-y border-white/10 py-5 sm:gap-12">
          <Stat value={backdrops.length + posters.length} label="Total frames" accent />
          <Stat value={backdrops.length} label="Backdrops" />
          <Stat value={posters.length} label="Posters" />
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto lg:sticky lg:top-[100px] lg:z-20 lg:my-8 lg:w-fit lg:rounded-none lg:bg-[#04152d]/95 lg:py-2 lg:backdrop-blur">
          {FILTERS.map((option) => {
            const count =
              option.id === "backdrops"
                ? backdrops.length
                : option.id === "posters"
                ? posters.length
                : backdrops.length + posters.length;
            const active = filter === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={active}
                className={`flex min-h-[44px] shrink-0 items-center gap-2 border px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                    : "border-white/15 text-slate-300 hover:border-white/40 hover:text-white"
                }`}
              >
                {option.label}
                <span className="tabular-nums opacity-70">{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className={`${
                  index % 3 === 0
                    ? "col-span-2 aspect-[16/10] md:col-span-2"
                    : "col-span-1 aspect-[2/3] md:col-span-1"
                } animate-pulse bg-[#0a1b31]`}
              />
            ))}
          </div>
        ) : items.length ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
              {items.slice(0, visibleCount).map((item, index) => (
                <GalleryTile
                  key={`${item.file_path}-${index}`}
                  item={item}
                  index={index}
                  type={item.type}
                  onOpen={() => setLightboxIndex(index)}
                />
              ))}
            </div>
            {visibleCount < items.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="flex min-h-[48px] items-center gap-3 border border-white/20 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
                >
                  Load more frames
                  <span className="text-[#51E5FF] tabular-nums">
                    {items.length - visibleCount}
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 border border-white/10 bg-[#0a1b31] px-6 py-16 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              No frames found
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              This archive is still empty.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
              Try another film from the library, or head back to the movie page
              for more details.
            </p>
            <Link
              href={`/movies/${id}`}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 border border-[#51E5FF] px-5 text-xs font-bold uppercase tracking-[0.18em] text-[#51E5FF] transition-colors hover:bg-[#51E5FF] hover:text-[#04152d]"
            >
              Back to film
              <AiOutlineArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {lightboxIndex !== null && items.length > 0 && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          title={title}
          onClose={closeLightbox}
          onStep={step}
        />
      )}
    </section>
  );
};

export default ImagesComponent;
