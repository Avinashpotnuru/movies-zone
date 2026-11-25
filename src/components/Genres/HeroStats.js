"use client";

import { useGetGenresMoviesQuery } from "@/store/api/restApis";

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

const HeroStats = ({ id }) => {
  const { data } = useGetGenresMoviesQuery({ id, pageId: 1 });

  const movies = data?.results ?? [];
  const topRated = movies.reduce(
    (best, movie) =>
      (movie.vote_average ?? 0) > (best?.vote_average ?? 0) ? movie : best,
    null
  );

  return (
    <>
      <Stat label="Titles" value={(data?.total_results ?? 0).toLocaleString() || "—"} />
      <Stat
        label="Pages"
        value={String(data?.total_pages ?? 1).padStart(2, "0")}
      />
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
    </>
  );
};

export default HeroStats;
