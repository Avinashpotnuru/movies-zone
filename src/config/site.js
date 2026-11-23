export const SITE_NAME = "Movies-Zone";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const DEFAULT_DESCRIPTION =
  "Discover trending films, explore genres, search the archive, and save a watchlist on Movies-Zone.";

export const DEFAULT_IMAGE = "/backgroundImage.jpg";

export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "";

export const tmdbImageUrl = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}/${String(path).replace(/^\/+/, "")}`
    : "";

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) return path;
  const base = SITE_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix || "/"}`;
};

export const truncate = (value, max = 155) => {
  const clean = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
};

export const serializeJsonLd = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
