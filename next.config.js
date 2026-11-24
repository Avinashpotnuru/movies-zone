/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["image.tmdb.org"],
  },
};

module.exports = nextConfig;
