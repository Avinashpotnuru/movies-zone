"use client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";

import { getGenreNote } from "@/config/genres";
import { useGetGenresMoviesQuery, useGetGenresQuery } from "@/store/api/restApis";
import { imagePath } from "@/utilities";

const GenreTile = ({ genre, index, feature, coral, cyan }) => {
  const { data } = useGetGenresMoviesQuery(
    { id: genre.id, pageId: 1 },
    { skip: !genre.id }
  );

  const representative = data?.results?.[0];
  const image = representative?.backdrop_path || representative?.poster_path;
  const accent = coral || cyan;

  const surface = feature
    ? "border-[#475569] bg-[#04152d] text-white"
    : coral
    ? "border-[#F4442E] bg-[#F4442E] text-[#04152d]"
    : cyan
    ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
    : "border-white/10 bg-[#04152d] text-white hover:border-[#51E5FF]/60";

  return (
    <Link
      href={`/category/${genre.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden border p-4 transition duration-300 ease-out hover:-translate-y-0.5 ${surface} ${
        feature
          ? "col-span-2 min-h-[150px] lg:row-span-2 lg:min-h-[232px]"
          : "min-h-[110px]"
      }`}
    >
      {image && (
        <Image
          src={`${imagePath}${image}`}
          alt=""
          fill
          sizes={
            feature
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          }
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            accent ? "opacity-20" : "opacity-40"
          }`}
        />
      )}

      {accent ? (
        <div
          className={`absolute inset-0 ${
            coral ? "bg-[#F4442E]/40" : "bg-[#51E5FF]/40"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/70 to-[#04152d]/10" />
      )}

      <div className="relative z-10 flex justify-end">
        <AiOutlineArrowRight
          size={feature ? 22 : 16}
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      </div>

      <div className="relative z-10">
        <h3
          className={`font-extrabold leading-tight tracking-tight ${
            feature ? "text-3xl lg:text-4xl" : "text-base"
          }`}
        >
          {genre.name}
        </h3>
        {feature && (
          <p className="mt-3 max-w-[210px] text-xs leading-relaxed text-white/70">
            {getGenreNote(genre)}
          </p>
        )}
      </div>
    </Link>
  );
};

const GenreExplorer = () => {
  const { data, isLoading } = useGetGenresQuery();
  const genres = data?.genres?.slice(0, 15) ?? [];

  return (
    <section className="border-y border-white/10 bg-[#0a1b31]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              02 / Explore
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Browse by genre
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Skip the searching and go straight to the stories you love.
            </p>
          </div>
          <Link
            href="/movies"
            className="inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
          >
            See all movies
            <AiOutlineArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 15 }).map((_, index) => (
                <div
                  key={`genre-skeleton-${index}`}
                  className="min-h-[110px] animate-pulse bg-[#04152d]"
                  aria-hidden="true"
                />
              ))
            : genres.map((genre, index) => (
                <GenreTile
                  key={genre.id}
                  genre={genre}
                  index={index}
                  feature={index === 0}
                  coral={index === 5}
                  cyan={index === 10}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default GenreExplorer;
