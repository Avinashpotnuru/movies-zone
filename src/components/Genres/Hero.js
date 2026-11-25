import Link from "next/link";

import { AiOutlineArrowLeft } from "react-icons/ai";

import { getGenreNote } from "@/config/genres";

const GenresHero = ({ genre, posterSlot, statsSlot }) => {
  const genreName = genre?.name || "Genre";

  return (
    <section className="relative overflow-hidden border-b border-white/10">
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
          <span>Genres</span>
          <span className="text-white/20">/</span>
          <span className="truncate text-[#51E5FF]">{genreName}</span>
        </div>

        <div className="mt-8 grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
              Genre collection
            </p>
            <h1
              className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              {genreName}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              {getGenreNote(genre)}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="border border-[#51E5FF]/50 bg-[#51E5FF]/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#51E5FF]">
                Popular now
              </span>
              <span className="border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Updated daily
              </span>
            </div>
          </div>

          {posterSlot}
        </div>

        {statsSlot && (
          <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
            {statsSlot}
          </div>
        )}
      </div>
    </section>
  );
};

export default GenresHero;
