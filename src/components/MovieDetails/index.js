import { Suspense } from "react";

import Actions from "./Actions";
import MovieDetailsClient from "./MovieDetailsClient";
import MovieDetailsHero from "./Hero";
import LoadingRing from "../LoadingRing";

const MovieDetails = ({ id, meta }) => (
  <div className="bg-[#04152d] text-white">
    <MovieDetailsHero
      id={id}
      meta={meta}
      actionsSlot={
        <Suspense fallback={null}>
          <Actions id={id} />
        </Suspense>
      }
    />

    <Suspense fallback={<LoadingRing label="movie-loading" />}>
      <MovieDetailsClient id={id} />
    </Suspense>
  </div>
);

export default MovieDetails;
