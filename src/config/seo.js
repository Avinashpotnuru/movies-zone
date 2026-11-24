import { getCollection } from "@/config/collections";
import { tmdbImageUrl } from "@/config/site";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL;
const apiKey = process.env.NEXT_PUBLIC_BACKEND_BASEURL_API_KEY;

const retryDelay = (attempt) => 150 * (attempt + 1);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (endpoint, attempt = 0) => {
  if (!baseUrl || !apiKey) return null;

  const retry = async () => {
    if (attempt >= 2) return null;
    await wait(retryDelay(attempt));
    return fetchJson(endpoint, attempt + 1);
  };

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
      { headers: { authorization: `Bearer ${apiKey}` } }
    );
    if (!response.ok) {
      return response.status >= 500 || response.status === 429
        ? retry()
        : null;
    }
    return await response.json();
  } catch {
    return retry();
  }
};

const firstFeaturedImage = (data) => {
  const movie = data?.results?.[0];
  return {
    image:
      tmdbImageUrl(movie?.backdrop_path, "original") ||
      tmdbImageUrl(movie?.poster_path, "w500"),
    totalResults: data?.total_results ?? 0,
  };
};

export const fetchMovieSeoMeta = (id) => fetchJson(`movie/${id}`);

export const fetchMovieImagesSeoMeta = (id) => fetchJson(`movie/${id}/images`);

export const fetchPersonSeoMeta = (id) => fetchJson(`person/${id}`);

export const fetchGenreSeoMeta = async (id) => {
  const data = await fetchJson("genre/movie/list");
  const genre = (data?.genres ?? []).find(
    (item) => String(item.id) === String(id)
  );
  return genre ?? null;
};

export const fetchGenreCollectionSeoMeta = (id) =>
  fetchJson(
    `discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${encodeURIComponent(
      id
    )}`
  ).then(firstFeaturedImage);

export const fetchSpecialCollectionSeoMeta = (page) => {
  const language = getCollection(page)?.code || page;

  return fetchJson(
    `discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=IN&with_original_language=${encodeURIComponent(
      language
    )}`
  ).then(firstFeaturedImage);
};

export const fetchSearchSeoMeta = (term, page = 1) =>
  fetchJson(
    `search/movie?query=${encodeURIComponent(
      term || ""
    )}&include_adult=false&page=${page}`
  ).then(firstFeaturedImage);
