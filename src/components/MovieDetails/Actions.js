"use client";

import Link from "next/link";

import {
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";
import { MdFavorite, MdOutlineFavorite } from "react-icons/md";

import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { useGetMovieFullDetailsByIdQuery } from "@/store/api/restApis";

const Actions = ({ id }) => {
  const { data } = useGetMovieFullDetailsByIdQuery({ id });
  const { isFavorite, toggleFavorite } = useFavoriteToggle();
  const saved = isFavorite(id);

  const videos = (data?.videos?.results ?? []).filter(
    (video) => video.site === "YouTube" && video.key
  );
  const trailer = videos.find((video) => video.type === "Trailer") ?? videos[0];

  const playTrailer = () => {
    if (!trailer) return;
    window.dispatchEvent(
      new CustomEvent("movies-zone:play-video", { detail: trailer })
    );
  };

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      {trailer && (
        <button
          type="button"
          onClick={playTrailer}
          className="inline-flex min-h-[48px] items-center gap-2 bg-[#F4442E] px-6 text-sm font-bold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-[#04152d] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4442E]"
        >
          <BsFillPlayFill size={19} aria-hidden="true" />
          Watch trailer
        </button>
      )}
      <Link
        href={`/images/${id}`}
        className="inline-flex min-h-[48px] items-center gap-2 border border-white/30 px-6 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#51E5FF] hover:text-[#51E5FF] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        More images
        <AiOutlineArrowRight size={16} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => toggleFavorite(id)}
        aria-label={saved ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={saved}
        className={`inline-flex min-h-[48px] items-center gap-2 border px-5 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] ${
          saved
            ? "border-[#F4442E] text-[#F4442E]"
            : "border-white/30 text-white hover:border-[#F4442E] hover:text-[#F4442E]"
        }`}
      >
        {saved ? (
          <MdFavorite size={18} aria-hidden="true" />
        ) : (
          <MdOutlineFavorite size={18} aria-hidden="true" />
        )}
        {saved ? "Saved" : "Favorite"}
      </button>
    </div>
  );
};

export default Actions;
