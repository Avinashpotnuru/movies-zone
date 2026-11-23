import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";
import { MdFavorite, MdOutlineFavorite } from "react-icons/md";
import { ProgressBar } from "react-loader-spinner";

import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { useGetMovieFullDetailsByIdQuery } from "@/store/api/restApis";
import { backdropPath, imagePath } from "@/utilities";

import CastCard from "../CastCard";

const MAX_CAST = 12;
const MAX_VIDEOS = 7;
const MAX_SIMILAR = 10;

const pad = (value) => String(value ?? 0).padStart(2, "0");

const PRIORITY_CREW_JOBS = [
  "Director",
  "Screenplay",
  "Writer",
  "Producer",
  "Director of Photography",
  "Original Music Composer",
  "Editor",
];

const Loader = () => (
  <div className="flex min-h-[70vh] items-center justify-center bg-[#04152d]">
    <ProgressBar
      height="80"
      width="80"
      ariaLabel="progress-bar-loading"
      wrapperStyle={{}}
      wrapperClass="progress-bar-wrapper"
      borderColor="#F4442E"
      barColor="#51E5FF"
    />
  </div>
);

const ErrorState = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Something went wrong
    </p>
    <h1 className="text-3xl font-extrabold">Movie details unavailable</h1>
    <p className="max-w-md text-sm text-slate-400">
      This title could not be loaded. Please go back and try again.
    </p>
    <Link
      href="/"
      className="mt-3 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
    >
      <AiOutlineArrowLeft size={16} aria-hidden="true" />
      Back to home
    </Link>
  </div>
);

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      )}
    </div>
  </div>
);

const Stat = ({ label, value, accent }) => (
  <div className="border-l border-white/10 px-4 first:border-l-0 first:pl-0">
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

const VideoFeature = ({ video }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.key}`}
    target="_blank"
    rel="noreferrer"
    aria-label={`Watch ${video.name || "video"} on YouTube`}
    className="group block border border-white/10 bg-[#04152d] transition-colors duration-300 hover:border-[#51E5FF]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
  >
    <div className="relative aspect-video overflow-hidden">
      <div
        role="img"
        aria-label={video.name || "Video thumbnail"}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${video.key}/hqdefault.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/25 to-transparent" />

      <span className="absolute left-4 top-4 border border-white/20 bg-[#04152d]/85 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
        {video.type || "Video"}
      </span>
      <span className="absolute right-4 top-4 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Official footage
      </span>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center border border-white/40 bg-[#04152d]/75 text-white transition duration-300 group-hover:scale-95 group-hover:border-[#F4442E] group-hover:bg-[#F4442E]">
          <BsFillPlayFill size={30} aria-hidden="true" />
        </span>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
          Featured trailer
        </p>
        <h3 className="mt-2 max-w-2xl text-xl font-extrabold leading-tight text-white sm:text-2xl">
          {video.name}
        </h3>
      </div>
    </div>

    <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Open on YouTube
      </p>
      <AiOutlineArrowRight
        size={16}
        aria-hidden="true"
        className="text-[#51E5FF] transition-transform duration-300 group-hover:translate-x-1"
      />
    </div>
  </a>
);

const VideoListRow = ({ video, index }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.key}`}
    target="_blank"
    rel="noreferrer"
    aria-label={`Watch ${video.name || "video"} on YouTube`}
    className="group flex items-center gap-3 border-b border-white/10 p-3 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#51E5FF]"
  >
    <span className="w-6 shrink-0 text-lg font-black leading-none text-white/20 tabular-nums">
      {pad(index + 2)}
    </span>

    <div className="relative aspect-video w-20 shrink-0 overflow-hidden bg-[#04152d] sm:w-24">
      <div
        role="img"
        aria-label={video.name || "Video thumbnail"}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${video.key}/hqdefault.jpg)`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-[#04152d]/30 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <BsFillPlayFill size={20} aria-hidden="true" />
      </span>
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#51E5FF]">
        {video.type || "Video"}
      </p>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#51E5FF] sm:text-sm">
        {video.name}
      </p>
    </div>

    <AiOutlineArrowRight
      size={15}
      aria-hidden="true"
      className="hidden shrink-0 text-slate-600 transition-colors duration-300 group-hover:text-[#51E5FF] sm:block"
    />
  </a>
);

const SimilarCard = ({ movie }) => (
  <Link
    href={`/movies/${movie.id}`}
    className="group block border border-white/10 bg-[#0a1b31] transition-colors duration-300 hover:border-[#51E5FF]/50"
  >
    <div className="relative aspect-[2/3] overflow-hidden bg-[#04152d]">
      <Image
        src={
          movie.poster_path
            ? `${imagePath}${movie.poster_path}`
            : "/noimage.png"
        }
        alt={movie.title ? `${movie.title} poster` : ""}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {movie.vote_average > 0 && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 bg-[#04152d]/90 px-2 py-1 text-[11px] font-bold text-[#51E5FF] tabular-nums">
          <AiFillStar size={11} aria-hidden="true" />
          {movie.vote_average.toFixed(1)}
        </span>
      )}
    </div>
    <div className="p-2.5">
      <h3
        title={movie.title}
        className="line-clamp-1 text-xs font-bold leading-snug text-white transition-colors group-hover:text-[#51E5FF]"
      >
        {movie.title}
      </h3>
      <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
        {movie.release_date?.slice(0, 4) ?? "—"}
      </p>
    </div>
  </Link>
);

const MovieDetails = () => {
  const router = useRouter();
  const rawId = router.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const ready = router.isReady && Boolean(id);

  const { data, isLoading, isError } = useGetMovieFullDetailsByIdQuery(
    { id },
    { skip: !ready }
  );
  const { isFavorite, toggleFavorite } = useFavoriteToggle();
  const saved = isFavorite(id);

  if (!ready || isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  const backdropSrc = data.backdrop_path
    ? `${backdropPath}${data.backdrop_path}`
    : "/backgroundImage.jpg";
  const posterSrc = data.poster_path
    ? `${imagePath}${data.poster_path}`
    : "/noimage.png";

  const cast = (data.credits?.cast ?? [])
    .filter((person, index, list) => {
      const key = person?.id ?? person?.name;
      return list.findIndex((item) => (item?.id ?? item?.name) === key) === index;
    })
    .slice(0, MAX_CAST);
  const allCrew = data.credits?.crew ?? [];
  const priorityCrew = allCrew
    .filter((person) => PRIORITY_CREW_JOBS.includes(person.job))
    .slice(0, 6);
  const crew = priorityCrew.length ? priorityCrew : allCrew.slice(0, 6);

  const videos =
    data.videos?.results
      ?.filter((video) => video.site === "YouTube" && video.key)
      .slice(0, MAX_VIDEOS) ?? [];
  const trailer = videos.find((video) => video.type === "Trailer") ?? videos[0];
  const trailerKey = trailer?.key ?? null;
  const orderedVideos = trailer
    ? [trailer, ...videos.filter((video) => video.id !== trailer.id)]
    : videos;

  const similar = data.similar?.results?.slice(0, MAX_SIMILAR) ?? [];
  const genres = data.genres ?? [];
  const runtime = data.runtime ?? 0;
  const rating = data.vote_average?.toFixed(1);
  const votes = data.vote_count ? data.vote_count.toLocaleString() : "—";
  const year = data.release_date?.slice(0, 4) ?? "—";

  return (
    <div className="bg-[#04152d] text-white">
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

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-14 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
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
              {data.title || "Details"}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-[104px_minmax(0,1fr)] gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-end lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="relative aspect-[2/3] overflow-hidden border border-white/20 bg-[#0a1b31] shadow-2xl shadow-black/50">
              <Image
                src={posterSrc}
                alt={data.title ? `${data.title} poster` : "Movie poster"}
                fill
                priority
                sizes="(max-width: 640px) 104px, (max-width: 1024px) 150px, 340px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
                Feature film · {year}
              </p>
              <h1
                className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
              >
                {data.title || "Untitled"}
              </h1>

              {data.tagline && (
                <p className="mt-3 text-base font-semibold text-slate-300 sm:text-lg">
                  “{data.tagline}”
                </p>
              )}

              <p className="mt-5 line-clamp-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {data.overview || "No overview available for this title."}
              </p>

              {genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id ?? genre.name}
                      className="border border-[#51E5FF]/30 bg-[#0a1b31] px-3 py-1 text-xs font-semibold text-[#51E5FF]"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {trailerKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2 bg-[#F4442E] px-6 text-sm font-bold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-[#04152d] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4442E]"
                  >
                    <BsFillPlayFill size={19} aria-hidden="true" />
                    Watch trailer
                  </a>
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
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
            <Stat label="Rating" value={rating ? `${rating} / 10` : "—"} accent />
            <Stat label="Votes" value={votes} />
            <Stat
              label="Runtime"
              value={`${Math.floor(runtime / 60)}h ${runtime % 60}m`}
            />
            <Stat label="Status" value={data.status || "—"} />
          </div>
        </div>
      </section>

      <nav className="sticky top-[92px] z-30 border-y border-white/10 bg-[#04152d]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {[
            { href: "#cast", label: "Cast & crew" },
            { href: "#videos", label: "Videos" },
            { href: "#similar", label: "Similar" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 border-b-2 border-transparent py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        id="cast"
        className="mx-auto max-w-[1400px] scroll-mt-32 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <SectionHeading
          eyebrow="01 / People"
          title="Cast & crew"
          description="The faces and the minds behind this film."
        />

        <div className="mt-9 grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Top billed cast
            </p>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cast.length ? (
                cast.map((person, index) => (
                  <CastCard
                    key={`${person.id ?? person.name ?? "cast"}-${index}`}
                    person={person}
                    role={person.character || "Cast"}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex min-h-[180px] w-full items-center justify-center border border-dashed border-white/15 bg-[#0a1b31]/40 px-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      No cast information yet
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                      Cast details have not been provided for this title.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0a1b31] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Key crew
            </p>
            <div className="mt-4 divide-y divide-white/10">
              {crew.length ? (
                crew.map((person) => (
                  <div
                    key={`${person.id}-${person.job}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <Link
                      href={`/cast/${person.id}`}
                      className="truncate text-sm font-semibold text-white transition-colors hover:text-[#51E5FF]"
                    >
                      {person.name}
                    </Link>
                    <span className="shrink-0 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#51E5FF]">
                      {person.job}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-3 text-sm text-slate-400">
                  Crew information is not available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="videos"
        className="scroll-mt-32 border-y border-white/10 bg-[#061a31]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <SectionHeading
            eyebrow="02 / Media"
            title="Videos & trailers"
            description="A closer look through official clips, teasers and trailers."
          />

          {orderedVideos.length ? (
            <div
              className={`mt-10 grid gap-4 ${
                orderedVideos.length > 1
                  ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]"
                  : ""
              }`}
            >
              <VideoFeature video={orderedVideos[0]} />

              {orderedVideos.length > 1 ? (
                <div className="border border-white/10 bg-[#04152d]">
                  <div className="flex items-end justify-between gap-4 border-b border-white/10 p-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
                        Clip index
                      </p>
                      <p className="mt-2 text-4xl font-black leading-none text-white tabular-nums">
                        {pad(orderedVideos.length)}
                      </p>
                    </div>
                    <p className="text-right text-[9px] font-bold uppercase leading-relaxed tracking-[0.18em] text-slate-600">
                      YouTube
                      <br />
                      Official archive
                    </p>
                  </div>

                  <div>
                    {orderedVideos.slice(1).map((video, index) => (
                      <VideoListRow
                        key={`${video.id}-${video.key}`}
                        video={video}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-9 flex min-h-[260px] items-center justify-center border border-dashed border-white/15 bg-[#04152d]/40 px-5 text-center">
              <div>
                <span className="mx-auto flex h-12 w-12 items-center justify-center border border-white/15 text-[#51E5FF]">
                  <BsFillPlayFill size={24} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-bold text-white">
                  No footage in the archive
                </p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  Official clips and trailers have not been added for this title.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="similar"
        className="mx-auto max-w-[1400px] scroll-mt-32 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <SectionHeading
          eyebrow="03 / Keep watching"
          title="More like this"
          description="If you liked this one, these are worth a look."
        />

        {similar.length ? (
          <div className="mt-9 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {similar.map((movie) => (
              <SimilarCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-400">
            No similar movies are available right now.
          </p>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;
