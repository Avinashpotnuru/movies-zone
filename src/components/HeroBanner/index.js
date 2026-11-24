import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AiFillStar,
  AiOutlineArrowRight,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";

import { useGetTrendingMoviesQuery } from "@/store/api/restApis";
import { imagePath } from "@/utilities";

const MAX_SLIDES = 10;
const AUTOPLAY_DELAY = 6000;

const posterSrc = (movie) =>
  movie?.poster_path ? `${imagePath}${movie.poster_path}` : "/noimage.png";

const HeroBanner = () => {
  const { data, isLoading } = useGetTrendingMoviesQuery({ trending: "day" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const slides = data?.results?.slice(0, MAX_SLIDES) ?? [];
  const slideCount = slides.length;
  const featured = slides[active];
  const rating = Number(featured?.vote_average);
  const metaChipClass =
    "inline-flex h-[38px] items-center border border-white/20 bg-white/[0.03] px-3";

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slideCount < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slideCount);
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [active, paused, reduceMotion, slideCount]);

  const goTo = (index) => {
    if (!slides.length) return;
    setActive((index + slides.length) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#04152d] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-24 h-[640px] w-[640px] rounded-full bg-[#51E5FF]/[0.08] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/5 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[clamp(640px,82vh,780px)] max-w-[1400px] grid-cols-1 items-center gap-8 px-5 pb-24 pt-6 sm:gap-12 sm:px-8 sm:pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-12 lg:pb-20 lg:pt-10">
        <div
          key={featured?.id ?? "empty"}
          className="relative z-10"
          aria-live="polite"
        >
          <p className="hero-enter flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[#51E5FF]">
            <span className="h-px w-9 bg-[#F4442E]" aria-hidden="true" />
            Trending today ·{" "}
            {String(slides.length ? active + 1 : 0).padStart(2, "0")}
          </p>

          <h1
            className="hero-enter mt-6 line-clamp-3 font-extrabold leading-[0.95] tracking-[-0.04em] text-white text-[clamp(2rem,9vw,3rem)] md:text-[2.25rem] lg:text-[clamp(2.5rem,3.2vw,3rem)]"
            style={{ animationDelay: "90ms" }}
          >
            {featured?.title ??
              (isLoading ? "Loading featured films…" : "No features today")}
          </h1>

          <div
            className="hero-enter mt-7 flex flex-wrap items-center gap-2"
            style={{ animationDelay: "150ms" }}
          >
            {rating > 0 && (
              <span
                className={`${metaChipClass} gap-2 text-sm font-bold text-[#51E5FF] tabular-nums`}
              >
                <AiFillStar size={15} aria-hidden="true" />
                {rating.toFixed(1)}
              </span>
            )}
            {featured?.release_date && (
              <span
                className={`${metaChipClass} text-sm font-semibold text-white tabular-nums`}
              >
                {featured.release_date.slice(0, 4)}
              </span>
            )}
            <span
              className={`${metaChipClass} text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300`}
            >
              Now playing
            </span>
          </div>

          {featured?.overview && (
            <p
              className="hero-enter mt-6 line-clamp-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
              style={{ animationDelay: "210ms" }}
            >
              {featured.overview}
            </p>
          )}

          <div
            className="hero-enter mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "270ms" }}
          >
            {featured && (
              <Link
                href={`/movies/${featured.id}`}
                className="inline-flex min-h-[52px] items-center gap-2 bg-[#51E5FF] px-7 text-sm font-bold text-[#04152d] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
              >
                View film
                <AiOutlineArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <Link
              href="/movies"
              className="inline-flex min-h-[52px] items-center gap-2 border border-white/30 px-7 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#51E5FF] hover:text-[#51E5FF] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Browse collection
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[250px] sm:max-w-[310px] lg:max-w-[400px]">
          <div className="relative mx-auto aspect-[20/21] w-full">
            {slideCount ? (
              slides.map((movie, index) => {
                const offset = (index - active + slideCount) % slideCount;
                const isCurrent = offset === 0;
                const isPrevious = offset === slideCount - 1;
                const isNext = offset === 1;
                if (!isCurrent && !isPrevious && !isNext) return null;

                const positionClass = isCurrent
                  ? "z-20 aspect-[2/3] w-[56%] -translate-x-1/2 -translate-y-1/2 rotate-0 opacity-100 shadow-2xl shadow-black/60 hover:opacity-95"
                  : isPrevious
                    ? "z-10 aspect-[2/3] w-[44%] -translate-x-[112%] -translate-y-1/2 -rotate-[9deg] opacity-50 hover:opacity-80"
                    : "z-10 aspect-[2/3] w-[44%] -translate-x-[12%] -translate-y-1/2 rotate-[9deg] opacity-50 hover:opacity-80";

                return (
                  <div
                    key={movie.id}
                    className={`hero-poster-slide absolute left-1/2 top-1/2 overflow-hidden border border-white/20 bg-[#0a1b31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] ${positionClass}`}
                  >
                    {isCurrent ? (
                      <Link
                        href={`/movies/${movie.id}`}
                        className="relative block h-full w-full"
                      >
                        <Image
                          src={posterSrc(movie)}
                          alt={`${movie.title} poster`}
                          fill
                          priority
                          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 26vw, 230px"
                          quality={70}
                          className="object-cover"
                        />
                        <span className="absolute left-3 top-3 bg-[#F4442E] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                          Featured
                        </span>
                        <span className="absolute bottom-3 right-3 bg-[#04152d]/85 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-[#51E5FF] tabular-nums">
                          {String(active + 1).padStart(2, "0")} /{" "}
                          {String(slideCount).padStart(2, "0")}
                        </span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-label={`Show ${movie.title}`}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={posterSrc(movie)}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 20vw, 180px"
                          quality={70}
                          className="object-cover"
                        />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="absolute left-1/2 top-1/2 flex aspect-[2/3] w-[56%] -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/10 bg-[#0a1b31] text-sm text-slate-400">
                {isLoading ? "Loading posters…" : "No features today"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#04152d]/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 sm:inline">
              Slide
            </span>
            <div className="flex gap-1.5 sm:gap-2 sm:flex-none sm:justify-start">
              {slides.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`h-[3px] w-4 transition-colors duration-300 sm:w-8 lg:w-10 ${
                    index === active
                      ? "bg-[#51E5FF]"
                      : "bg-white/20 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <span className="mr-1 text-xs font-bold tracking-widest text-slate-300 tabular-nums">
              {String(slides.length ? active + 1 : 0).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={slides.length < 2}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
            >
              <AiOutlineLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={slides.length < 2}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
            >
              <AiOutlineRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
