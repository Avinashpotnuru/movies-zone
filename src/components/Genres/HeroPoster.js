"use client";

import Image from "next/image";
import Link from "next/link";

import { AiFillStar } from "react-icons/ai";

import { useGetGenresMoviesQuery } from "@/store/api/restApis";
import { imagePath } from "@/utilities";

const HeroPoster = ({ id, genreName }) => {
  const { data } = useGetGenresMoviesQuery({ id, pageId: 1 });

  const featured = data?.results?.[0];
  const backups = data?.results?.slice(1, 3) ?? [];

  if (!featured) {
    return (
      <div
        className="mx-auto aspect-[210/300] w-full max-w-[235px] animate-pulse border border-white/10 bg-[#0a1b31]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative h-[300px] sm:h-[360px] lg:h-[400px]">
        {backups.map((movie, index) => (
          <div
            key={`backup-${movie.id}`}
            aria-hidden="true"
            className={`absolute top-7 h-[230px] w-[156px] overflow-hidden border border-white/15 bg-[#0a1b31] shadow-xl shadow-black/40 sm:h-[270px] sm:w-[180px] lg:h-[300px] lg:w-[200px] ${
              index === 0
                ? "left-0 -rotate-6 sm:left-2"
                : "right-0 rotate-6 sm:right-2"
            }`}
          >
            <Image
              src={
                movie.poster_path
                  ? `${imagePath}${movie.poster_path}`
                  : "/noimage.png"
              }
              alt=""
              fill
              sizes="200px"
              className="object-cover opacity-50"
            />
          </div>
        ))}

        <Link
          href={`/movies/${featured.id}`}
          className="group absolute left-1/2 top-0 h-[270px] w-[184px] -translate-x-1/2 overflow-hidden border border-white/25 bg-[#0a1b31] shadow-2xl shadow-black/60 transition-transform duration-300 hover:-translate-y-1 sm:h-[320px] sm:w-[215px] lg:h-[350px] lg:w-[235px]"
          aria-label={`View ${featured.title}`}
        >
          <Image
            src={
              featured.poster_path
                ? `${imagePath}${featured.poster_path}`
                : "/noimage.png"
            }
            alt={featured.title ? `${featured.title} poster` : ""}
            fill
            priority
            sizes="235px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/20 to-transparent" />
          <span className="absolute left-2 top-2 border border-white/20 bg-[#04152d]/85 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#51E5FF]">
            Top pick
          </span>
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="line-clamp-2 text-sm font-extrabold leading-tight text-white sm:text-base">
              {featured.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-300 tabular-nums">
              {featured.vote_average > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-[#51E5FF]">
                  <AiFillStar size={11} aria-hidden="true" />
                  {Number(featured.vote_average).toFixed(1)}
                </span>
              )}
              <span>{featured.release_date?.slice(0, 4) ?? "—"}</span>
            </div>
          </div>
        </Link>
      </div>

      <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {genreName ? `${genreName} / ` : ""}Featured selection
      </p>
    </div>
  );
};

export default HeroPoster;
