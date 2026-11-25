import { Suspense } from "react";

import LoadingRing from "../LoadingRing";
import FavoritesClient from "./FavoritesClient";

const Favorites = () => (
  <Suspense fallback={<LoadingRing label="favorites-loading" />}>
    <FavoritesClient />
  </Suspense>
);

export default Favorites;
