import Image from "next/image";
import Link from "next/link";

import { AiFillStar } from "react-icons/ai";
import { MdFavorite, MdOutlineFavorite } from "react-icons/md";

import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { imagePath } from "@/utilities";

const LandingMovieCard = ({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
  overview,
  compact = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavoriteToggle();
  const saved = isFavorite(id);

  const rating = vote_average?.toFixed(1);
  const href = `/movies/${id}`;

  return (
    <article className="group relative border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/50">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#04152d]">
          <Image
            src={poster_path ? `${imagePath}${poster_path}` : "/noimage.png"}
            alt={title ? `${title} poster` : "Movie poster"}
            fill
            sizes={
              compact
                ? "(max-width: 640px) 30vw, (max-width: 1280px) 18vw, 14vw"
                : "(max-width: 640px) 33vw, (max-width: 1280px) 22vw, 18vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-transparent to-transparent opacity-80" />

          {rating && (
            <span
              className={`absolute inline-flex items-center gap-1 bg-[#04152d]/90 font-bold text-[#51E5FF] tabular-nums ${
                compact
                  ? "left-1.5 top-1.5 px-1 py-0.5 text-[9px]"
                  : "left-2 top-2 px-1.5 py-0.5 text-[10px]"
              }`}
            >
              <AiFillStar size={compact ? 9 : 10} aria-hidden="true" />
              {rating}
            </span>
          )}

          <div
            className={`absolute inset-x-0 bottom-0 translate-y-2 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 ${
              compact ? "p-1.5" : "p-2"
            }`}
          >
            <p
              className={`leading-relaxed text-white/80 ${
                compact ? "line-clamp-2 text-[10px]" : "line-clamp-2 text-[11px]"
              }`}
            >
              {overview || "No overview available."}
            </p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(id)}
        aria-label={saved ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={saved}
        className={`absolute flex items-center justify-center border bg-[#04152d]/85 transition-colors duration-200 hover:border-[#F4442E] hover:text-[#F4442E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] ${
          compact ? "right-1.5 top-1.5 h-7 w-7" : "right-2 top-2 h-8 w-8"
        } ${
          saved
            ? "border-[#F4442E] text-[#F4442E]"
            : "border-white/20 text-white"
        }`}
      >
        {saved ? (
          <MdFavorite size={compact ? 13 : 15} aria-hidden="true" />
        ) : (
          <MdOutlineFavorite size={compact ? 13 : 15} aria-hidden="true" />
        )}
      </button>

      <div className={compact ? "p-1.5" : "p-2"}>
        <Link href={href}>
          <h3
            className={`line-clamp-2 font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#51E5FF] ${
              compact ? "text-[11px]" : "text-xs"
            }`}
          >
            {title}
          </h3>
        </Link>
        <p
          className={`text-slate-400 tabular-nums ${
            compact ? "mt-0.5 text-[10px]" : "mt-1 text-[11px]"
          }`}
        >
          {release_date?.slice(0, 4) ?? "—"} · Movie
        </p>
      </div>
    </article>
  );
};

export default LandingMovieCard;
