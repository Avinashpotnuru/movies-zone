import { Suspense } from "react";

import GenresHero from "./Hero";
import GenresClient from "./GenresClient";
import HeroPoster from "./HeroPoster";
import HeroStats from "./HeroStats";
import LoadingRing from "../LoadingRing";

const PostFallback = () => (
  <div
    className="mx-auto aspect-[210/300] w-full max-w-[235px] animate-pulse border border-white/10 bg-[#0a1b31]"
    aria-hidden="true"
  />
);

const Genres = ({ id, genre }) => (
  <div className="bg-[#04152d] text-white">
    <GenresHero
      genre={genre}
      posterSlot={
        <Suspense fallback={<PostFallback />}>
          <HeroPoster id={id} genreName={genre?.name} />
        </Suspense>
      }
      statsSlot={
        <Suspense fallback={null}>
          <HeroStats id={id} />
        </Suspense>
      }
    />

    <Suspense fallback={<LoadingRing label="genre-loading" />}>
      <GenresClient id={id} />
    </Suspense>
  </div>
);

export default Genres;
