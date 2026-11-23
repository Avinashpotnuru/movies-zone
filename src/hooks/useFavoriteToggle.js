import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  useAddFavoritesMutation,
  useGetFavoriteMoviesQuery,
} from "@/store/api/restApis";

const useFavoriteToggle = () => {
  const { data } = useGetFavoriteMoviesQuery();
  const [addFavorite] = useAddFavoritesMutation();

  const [overrides, setOverrides] = useState({});
  const pendingRef = useRef(new Set());

  useEffect(() => {
    setOverrides((previous) => {
      const entries = Object.entries(previous).filter(([movieId]) =>
        pendingRef.current.has(Number(movieId))
      );
      if (entries.length === Object.keys(previous).length) return previous;
      return Object.fromEntries(entries);
    });
  }, [data]);

  const favoriteIds = useMemo(() => {
    const ids = new Set(
      (data?.results ?? [])
        .map((movie) => movie?.id)
        .filter((id) => id != null)
        .map(Number)
        .filter(Number.isFinite)
    );

    Object.entries(overrides).forEach(([movieId, value]) => {
      const id = Number(movieId);
      if (value) ids.add(id);
      else ids.delete(id);
    });

    return ids;
  }, [data, overrides]);

  const isFavorite = useCallback(
    (id) => (id == null ? false : favoriteIds.has(Number(id))),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (id) => {
      if (id == null) return;
      const movieId = Number(id);
      if (!Number.isFinite(movieId)) return;

      const next = !favoriteIds.has(movieId);
      pendingRef.current.add(movieId);
      setOverrides((previous) => ({ ...previous, [movieId]: next }));

      addFavorite({
        media_type: "movie",
        media_id: movieId,
        favorite: next,
      })
        .unwrap()
        .then(() => {
          pendingRef.current.delete(movieId);
        })
        .catch(() => {
          pendingRef.current.delete(movieId);
          setOverrides((previous) => {
            const updated = { ...previous };
            delete updated[movieId];
            return updated;
          });
        });
    },
    [addFavorite, favoriteIds]
  );

  return { isFavorite, toggleFavorite };
};

export default useFavoriteToggle;
