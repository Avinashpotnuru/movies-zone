const TMDB_BASE = "https://image.tmdb.org/t/p/";

export const imageUrl = (path, size = "w780") =>
  path
    ? `${TMDB_BASE}${size}/${String(path).replace(/^\/+/, "")}`
    : "/noimage.png";
