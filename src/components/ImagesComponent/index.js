import Image from "next/image";
import Link from "next/link";

import { AiOutlineArrowLeft } from "react-icons/ai";

import ImageGallery from "./ImageGallery";
import { imageUrl } from "./imageUrl";

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

const ImagesComponent = ({ id, meta, backdrops = [], posters = [] }) => {
  const title = meta?.title || "Movie gallery";
  const featured = backdrops[0]?.file_path || meta?.backdrop_path || "";

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

        <ImageGallery
          id={id}
          title={title}
          backdrops={backdrops}
          posters={posters}
        />
      </div>
    </section>
  );
};

export default ImagesComponent;
