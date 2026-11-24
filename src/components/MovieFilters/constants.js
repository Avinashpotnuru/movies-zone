export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Highest rated" },
  { value: "primary_release_date.desc", label: "Newest first" },
  { value: "primary_release_date.asc", label: "Oldest first" },
  { value: "title.asc", label: "Title A–Z" },
  { value: "revenue.desc", label: "Highest grossing" },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export const VOTE_COUNTS = [100, 500, 1000, 5000, 10000];

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = 1900;
export const MAX_YEAR = CURRENT_YEAR + 2;

export const DEFAULT_FILTERS = {
  list: "popular",
  sortBy: "popularity.desc",
  withGenres: [],
  releaseFrom: "",
  releaseTo: "",
  voteAverageGte: null,
  voteAverageLte: null,
  voteCountGte: null,
  originalLanguage: "",
  page: 1,
};

export const isoDate = (date) => date.toISOString().slice(0, 10);

export const daysFromToday = (days) =>
  isoDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

const queryValue = (value) => (Array.isArray(value) ? value[0] : value);

export const parseFilters = (query, defaults = DEFAULT_FILTERS, options = {}) => {
  const rawGenres = queryValue(query.with_genres);
  const numberOrNull = (value) => {
    const parsed = Number(queryValue(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };
  const pageParam = options.pageParam || "page";
  const hasFilterParams = Boolean(
    queryValue(query.sort_by) ||
      rawGenres ||
      queryValue(query["primary_release_date.gte"]) ||
      queryValue(query["primary_release_date.lte"]) ||
      queryValue(query["vote_average.gte"]) ||
      queryValue(query["vote_average.lte"]) ||
      queryValue(query["vote_count.gte"]) ||
      (!options.lockOriginalLanguage && queryValue(query.with_original_language))
  );

  return {
    ...defaults,
    list: queryValue(query.list) || (hasFilterParams ? "custom" : defaults.list),
    sortBy: queryValue(query.sort_by) || defaults.sortBy,
    withGenres: rawGenres
      ? String(rawGenres)
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [],
    releaseFrom: (queryValue(query["primary_release_date.gte"]) || "").slice(0, 4),
    releaseTo: (queryValue(query["primary_release_date.lte"]) || "").slice(0, 4),
    voteAverageGte: numberOrNull(query["vote_average.gte"]),
    voteAverageLte: numberOrNull(query["vote_average.lte"]),
    voteCountGte: numberOrNull(query["vote_count.gte"]),
    originalLanguage: options.lockOriginalLanguage
      ? defaults.originalLanguage
      : queryValue(query.with_original_language) || defaults.originalLanguage,
    page: Math.max(1, Number(queryValue(query[pageParam])) || 1),
  };
};

export const toQuery = (filters, defaults = DEFAULT_FILTERS, options = {}) => {
  const query = {};

  if (
    options.includeList !== false &&
    filters.list &&
    filters.list !== defaults.list
  ) {
    query.list = filters.list;
  }
  if (filters.sortBy && filters.sortBy !== defaults.sortBy) {
    query.sort_by = filters.sortBy;
  }
  if (filters.withGenres.length) query.with_genres = filters.withGenres.join(",");
  if (filters.releaseFrom) {
    query["primary_release_date.gte"] = `${filters.releaseFrom}-01-01`;
  }
  if (filters.releaseTo) {
    query["primary_release_date.lte"] = `${filters.releaseTo}-12-31`;
  }
  if (filters.voteAverageGte) {
    query["vote_average.gte"] = String(filters.voteAverageGte);
  }
  if (filters.voteAverageLte) {
    query["vote_average.lte"] = String(filters.voteAverageLte);
  }
  if (filters.voteCountGte) {
    query["vote_count.gte"] = String(filters.voteCountGte);
  }
  if (filters.originalLanguage && filters.originalLanguage !== defaults.originalLanguage) {
    query.with_original_language = filters.originalLanguage;
  }
  if (filters.page > 1) query[options.pageParam || "page"] = String(filters.page);

  return query;
};

export const createFilterChips = ({
  filters,
  genres,
  onChange,
  defaults = DEFAULT_FILTERS,
  includeLanguage = true,
}) => {
  const chips = [];

  if (filters.sortBy !== defaults.sortBy) {
    chips.push({
      key: "sort",
      label: `Sort: ${SORT_OPTIONS.find((item) => item.value === filters.sortBy)?.label || filters.sortBy}`,
      remove: () => onChange({ sortBy: defaults.sortBy }),
    });
  }

  filters.withGenres.forEach((id) => {
    const name =
      genres.find((genre) => String(genre.id) === String(id))?.name ||
      `Genre ${id}`;
    chips.push({
      key: `genre-${id}`,
      label: name,
      remove: () =>
        onChange({
          withGenres: filters.withGenres.filter((item) => item !== id),
        }),
    });
  });

  if (filters.releaseFrom || filters.releaseTo) {
    chips.push({
      key: "years",
      label: `${filters.releaseFrom || "…"} – ${filters.releaseTo || "…"}`,
      remove: () => onChange({ releaseFrom: "", releaseTo: "" }),
    });
  }

  if (filters.voteAverageGte || filters.voteAverageLte) {
    chips.push({
      key: "rating",
      label: `Rating ${filters.voteAverageGte ?? 0}–${filters.voteAverageLte ?? 10}`,
      remove: () =>
        onChange({ voteAverageGte: null, voteAverageLte: null }),
    });
  }

  if (filters.voteCountGte) {
    chips.push({
      key: "votes",
      label: `${filters.voteCountGte.toLocaleString()}+ votes`,
      remove: () => onChange({ voteCountGte: null }),
    });
  }

  if (
    includeLanguage &&
    filters.originalLanguage &&
    filters.originalLanguage !== defaults.originalLanguage
  ) {
    chips.push({
      key: "language",
      label:
        LANGUAGE_OPTIONS.find((item) => item.value === filters.originalLanguage)
          ?.label || filters.originalLanguage,
      remove: () => onChange({ originalLanguage: defaults.originalLanguage }),
    });
  }

  return chips;
};
