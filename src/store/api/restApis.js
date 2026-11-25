"use client";
//redux imports

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL;
const API_KEY = process.env.NEXT_PUBLIC_BACKEND_BASEURL_API_KEY;

const restApi = createApi({
  reducerPath: "restApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,

    prepareHeaders: (headers) => {
      headers.set("authorization", `Bearer ${API_KEY}`);

      return headers;
    },
  }),

  tagTypes: ["Favorites"],

  endpoints: (builder) => ({
    addFavorites: builder.mutation({
      query: (data) => ({
        url: `account/20236627/favorite`,
        method: "POST",

        body: data,
      }),
      invalidatesTags: ["Favorites"],
    }),

    getMovies: builder.query({
      query: (data) => `movie/${data.tab}?page=${data.pageId}`,
    }),

    discoverMovies: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams({
          include_adult: "false",
          include_video: "false",
          language: "en-US",
          page: String(filters.page || 1),
          sort_by: filters.sortBy || "popularity.desc",
        });

        if (filters.withGenres?.length) {
          params.set("with_genres", filters.withGenres.join(","));
        }
        if (filters.releaseFrom) {
          params.set("primary_release_date.gte", `${filters.releaseFrom}-01-01`);
        }
        if (filters.releaseTo) {
          params.set("primary_release_date.lte", `${filters.releaseTo}-12-31`);
        }
        if (filters.voteAverageGte) {
          params.set("vote_average.gte", String(filters.voteAverageGte));
        }
        if (filters.voteAverageLte) {
          params.set("vote_average.lte", String(filters.voteAverageLte));
        }
        if (filters.voteCountGte) {
          params.set("vote_count.gte", String(filters.voteCountGte));
        }
        if (filters.originalLanguage) {
          params.set("with_original_language", filters.originalLanguage);
        }
        if (filters.originCountry) {
          params.set("with_origin_country", filters.originCountry);
        }

        return `discover/movie?${params.toString()}`;
      },
    }),
    getMovieFullDetailsById: builder.query({
      query: (data) =>
        `movie/${data.id}?append_to_response=credits,similar,videos`,
    }),

    getSearchMovies: builder.query({
      query: (data) =>
        `search/movie?query=${encodeURIComponent(
          data.searchInput || ""
        )}&include_adult=false&page=${data.pageId || 1}`,
    }),

    getMovieImages: builder.query({
      query: (data) => `movie/${data.id}/images`,
    }),

    getFavoriteMovies: builder.query({
      query: () => `account/20236627/favorite/movies`,
      providesTags: ["Favorites"],
    }),
    getGenres: builder.query({
      query: () => `genre/movie/list`,
    }),
    getGenresMovies: builder.query({
      query: (data) =>
        `discover/movie?include_adult=false&include_video=false&language=en-US&page=${data.pageId}&sort_by=popularity.desc&with_genres=${data.id}`,
    }),
    getTrendingMovies: builder.query({
      query: (data) => `trending/movie/${data?.trending}`,
    }),

    getCastFullDetails: builder.query({
      query: (data) =>
        `person/${data?.id}?append_to_response=combined_credits,external_ids,images`,
    }),
  }),
});

export const {
  useAddFavoritesMutation,
  useGetMoviesQuery,
  useDiscoverMoviesQuery,
  useGetSearchMoviesQuery,
  useGetMovieImagesQuery,
  useGetFavoriteMoviesQuery,
  useGetGenresQuery,
  useGetGenresMoviesQuery,
  useGetMovieFullDetailsByIdQuery,
  useGetTrendingMoviesQuery,
  useGetCastFullDetailsQuery,
} = restApi;

export default restApi;
