import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { ProgressBar } from "react-loader-spinner";

import { useGetGenresMoviesQuery, useGetGenresQuery } from "@/store/api/restApis";
import { tabsHandler } from "@/store/slice/tabsSlice";
import { backdropPath, imagePath } from "@/utilities";

import Pagination from "../Pagination";

const GENRE_NOTES = {
  28: "Big-scale stories, relentless pace and the films that keep you on the edge of your seat.",
  12: "Epic journeys, impossible worlds and the thrill of the unknown.",
  16: "Animated worlds with heart, humour and a little bit of magic.",
  35: "Sharp jokes, awkward moments and the comedies worth rewatching.",
  80: "Criminal minds, moral lines and the cases that never let go.",
  18: "Human stories, honest performances and the films that stay with you.",
  27: "Dark corners, loud scares and the thrill of being genuinely unsettled.",
  878: "Future worlds, bold ideas and cinema that asks what comes next.",
  53: "Twists, tension and stories that refuse to give you a easy answer.",
};

const getGenreNote = (genre) =>
  GENRE_NOTES[genre?.id] ||
  (genre?.name
    ? `A hand-picked feed of ${genre.name.toLowerCase()} films — the titles people keep coming back to.`
    : "A hand-picked feed of films from TMDB.");

const Loader = () => (
  <div className="flex min-h-[70vh] items-center justify-center bg-[#04152d]">
    <ProgressBar
      height="80"
      width="80"
      ariaLabel="genre-loading"
      wrapperStyle={{}}
      wrapperClass="progress-bar-wrapper"
      borderColor="#F4442E"
      barColor="#51E5FF"
    />
  </div>
);

const ErrorState = ({ title, message }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#04152d] px-5 text-center text-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
      Collection unavailable
    </p>
    <h1 className="text-3xl font-extrabold">{title}</h1>
    <p className="max-w-md text-sm text-slate-400">{message}</p>
    <Link
      href="/"
      className="mt-3 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition-colors hover:bg-white"
    >
      <AiOutlineArrowLeft size={16} aria-hidden="true" />
      Back to home
    </Link>
  </div>
);

const Stat = ({ label, value, accent }) => (
  <div className="border-l border-white/10 px-4 first:border-l-0 first:pl-0">
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

const SectionHeading = ({ eyebrow, title, description, action }) => (
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
    {action}
  </div>
);

const PosterDeck = ({ featured, backups, genreName }) => {
  if (!featured) return null;

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

const CategoryMovieCard = ({ movie, index }) => (
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
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="absolute left-2 top-2 border border-white/20 bg-[#04152d]/85 px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-slate-300 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
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

const RelatedGenreTile = ({ genre, index, feature }) => {
  const { data } = useGetGenresMoviesQuery(
    { id: genre.id, pageId: 1 },
    { skip: !genre.id }
  );

  const representative = data?.results?.[0];
  const image = representative?.backdrop_path || representative?.poster_path;

  return (
    <Link
      href={`/category/${genre.id}`}
      className={`group relative overflow-hidden border bg-[#04152d] transition-colors duration-300 ${
        feature
          ? "col-span-2 row-span-2 min-h-[248px] border-[#F4442E]/60 hover:border-[#F4442E] sm:min-h-[280px]"
          : "min-h-[124px] border-white/10 hover:border-[#51E5FF]/60"
      }`}
    >
      {image && (
        <Image
          src={`${imagePath}${image}`}
          alt=""
          fill
          sizes={
            feature
              ? "(max-width: 640px) 100vw, 50vw"
              : "(max-width: 640px) 50vw, 25vw"
          }
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            feature ? "opacity-55" : "opacity-40"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/70 to-[#04152d]/10" />

      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <span
            className={`text-[10px] font-bold tracking-widest tabular-nums ${
              feature ? "text-[#F4442E]" : "text-slate-500"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <AiOutlineArrowRight
            size={feature ? 20 : 16}
            aria-hidden="true"
            className={`transition-transform duration-300 ease-out group-hover:translate-x-1 ${
              feature
                ? "text-[#51E5FF]"
                : "text-slate-400 group-hover:text-[#51E5FF]"
            }`}
          />
        </div>

        <div>
          <h3
            className={`font-extrabold tracking-tight text-white ${
              feature ? "text-2xl sm:text-3xl" : "text-base"
            }`}
          >
            {genre.name}
          </h3>
          {representative?.title && (
            <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">
              {representative.title}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const Genres = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pageId = Number(useSelector((state) => state.tabsSlice.tabs)) || 1;

  const rawId = router.query.id;
  const genreId = Array.isArray(rawId) ? rawId[0] : rawId;
  const ready = router.isReady && Boolean(genreId);

  const {
    data: genresData,
    isLoading: genresLoading,
    isError: genresError,
  } = useGetGenresQuery();

  const {
    data,
    isLoading: moviesLoading,
    isError: moviesError,
  } = useGetGenresMoviesQuery({ id: genreId, pageId }, { skip: !ready });

  useEffect(() => {
    if (ready) dispatch(tabsHandler(1));
  }, [ready, genreId, dispatch]);

  useEffect(() => {
    if (data?.total_pages && pageId > data.total_pages) {
      dispatch(tabsHandler(1));
    }
  }, [data?.total_pages, pageId, dispatch]);

  if (!ready || genresLoading || (moviesLoading && !data)) return <Loader />;

  const genres = genresData?.genres ?? [];
  const genre = genres.find((item) => String(item.id) === String(genreId));
  const genreMissing =
    !genresError && genres.length > 0 && !genre;

  if (genresError || genreMissing || moviesError) {
    return (
      <ErrorState
        title={
          genresError
            ? "Genres unavailable"
            : genreMissing
            ? "Genre not found"
            : "Movies unavailable"
        }
        message={
          genresError
            ? "The genre list could not be loaded right now. Please try again shortly."
            : genreMissing
            ? "That genre does not exist. Pick another one from the home page."
            : "This genre could not be loaded. Please try another collection."
        }
      />
    );
  }

  const genreName = genre?.name || "Genre";
  const movies = data?.results ?? [];
  const featured = movies[0];
  const backups = movies.slice(1, 3);
  const totalResults = data?.total_results ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const topRated = movies.reduce(
    (best, movie) =>
      (movie.vote_average ?? 0) > (best?.vote_average ?? 0) ? movie : best,
    null
  );

  const currentIndex = genres.findIndex(
    (item) => String(item.id) === String(genreId)
  );
  const relatedGenres = genres.length
    ? Array.from({ length: 6 }, (_, offset) =>
        genres[(Math.max(0, currentIndex) + offset + 1) % genres.length]
      )
        .filter((item) => item && String(item.id) !== String(genreId))
        .slice(0, 5)
    : [];

  return (
    <div className="bg-[#04152d] text-white">
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

            <PosterDeck
              featured={featured}
              backups={backups}
              genreName={genreName}
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4">
            <Stat label="Titles" value={totalResults.toLocaleString() || "—"} />
            <Stat label="Pages" value={String(totalPages).padStart(2, "0")} />
            <Stat
              label="Top rated"
              value={
                topRated?.vote_average > 0
                  ? Number(topRated.vote_average).toFixed(1)
                  : "—"
              }
              accent
            />
            <Stat label="Source" value="TMDB" />
          </div>
        </div>
      </section>

      <nav className="sticky top-[92px] z-30 border-b border-white/10 bg-[#04152d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-stretch px-5 sm:px-8 lg:px-12">
          <div className="hidden shrink-0 items-center gap-2 border-r border-white/10 pr-6 lg:flex">
            <span className="h-1.5 w-1.5 bg-[#F4442E]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Genre index
            </span>
            <span className="text-[10px] font-bold text-slate-600 tabular-nums">
              {String(genres.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {genres.map((item, index) => {
              const active = String(item.id) === String(genreId);
              return (
                <Link
                  key={item.id}
                  href={`/category/${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex shrink-0 items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "bg-[#F4442E] text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-[10px] tabular-nums ${
                      active
                        ? "text-white/70"
                        : "text-slate-600 group-hover:text-[#51E5FF]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.name}
                  {active && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#51E5FF]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <SectionHeading
          eyebrow="01 / Collection"
          title={`${genreName} films`}
          description="The most popular releases in this genre, ranked by TMDB."
          action={
            <p className="text-sm text-slate-400 tabular-nums">
              {totalResults.toLocaleString() || "—"} titles · Page {pageId} of{" "}
              {totalPages}
            </p>
          }
        />

        {movies.length ? (
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie, index) => (
              <CategoryMovieCard
                key={movie.id}
                movie={movie}
                index={(pageId - 1) * 20 + index}
              />
            ))}
          </div>
        ) : (
          <p className="mt-9 text-sm text-slate-400">
            No movies are available in this genre right now.
          </p>
        )}

        <Pagination
          pages={totalPages}
          current={pageId}
          onChange={(page) => dispatch(tabsHandler(page))}
        />
      </section>

      {relatedGenres.length > 0 && (
        <section className="border-t border-white/10 bg-[#0a1b31]">
          <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            <SectionHeading
              eyebrow="02 / Continue exploring"
              title="Nearby genres"
              description="Keep going — there is always another corner of cinema to discover."
            />

            <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {relatedGenres.map((item, index) => (
                <RelatedGenreTile
                  key={item.id}
                  genre={item}
                  index={index}
                  feature={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Genres;
