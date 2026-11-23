import { tmdbImageUrl } from "@/config/site";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL;
const apiKey = process.env.NEXT_PUBLIC_BACKEND_BASEURL_API_KEY;

const fetchJson = async (endpoint) => {
  if (!baseUrl || !apiKey) return null;
  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
      { headers: { authorization: `Bearer ${apiKey}` } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
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

export const fetchSpecialCollectionSeoMeta = (language) =>
  fetchJson(
    `discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=IN&with_original_language=${encodeURIComponent(
      language
    )}`
  ).then(firstFeaturedImage);

export const fetchSearchSeoMeta = (term, page = 1) =>
  fetchJson(
    `search/movie?query=${encodeURIComponent(
      term || ""
    )}&include_adult=false&page=${page}`
  ).then(firstFeaturedImage);
