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

  tagTypes: ["Movies"],

  endpoints: (builder) => ({
    addFavorites: builder.mutation({
      query: (data) => ({
        url: `account/20236627/favorite`,
        method: "POST",

        body: data,
      }),
      invalidatesTags: ["Movies"],
    }),

    getMovies: builder.query({
      query: (data) => `movie/${data.tab}?page=${data.pageId}`,
      providesTags: ["Movies"],
    }),
    getMovieById: builder.query({
      query: (data) => `movie/${data.id}`,
      providesTags: ["Movies"],
    }),

    getMovieFullDetailsById: builder.query({
      query: (data) =>
        `movie/${data.id}?append_to_response=credits,similar,videos,watch/providers `,
      providesTags: ["Movies"],
    }),

    getSearchMovies: builder.query({
      query: (data) =>
        `search/movie?query=${encodeURIComponent(
          data.searchInput || ""
        )}&include_adult=false&page=${data.pageId || 1}`,
      providesTags: ["Movies"],
    }),

    getMovieImages: builder.query({
      query: (data) => `movie/${data.id}/images`,
      providesTags: ["Movies"],
    }),

    getFavoriteMovies: builder.query({
      query: (data) => `account/20236627/favorite/movies`,
      providesTags: ["Movies"],
    }),
    getGenres: builder.query({
      query: () => `genre/movie/list`,
      providesTags: ["Movies"],
    }),
    getGenresMovies: builder.query({
      query: (data) =>
        `discover/movie?include_adult=false&include_video=false&language=en-US&page=${data.pageId}&sort_by=popularity.desc&with_genres=${data.id}`,
      providesTags: ["Movies"],
    }),
    getSpecialMovies: builder.query({
      query: (data) =>
        `discover/movie?include_adult=false&include_video=false&language=en-US&page=${data.pageId}&sort_by=popularity.desc&with_origin_country=IN&with_original_language=${data.code}`,
      providesTags: ["Movies"],
    }),
    getUpComingMovies: builder.query({
      query: () => `movie/upcoming`,
      providesTags: ["Movies"],
    }),
    getTrendingMovies: builder.query({
      query: (data) => `trending/movie/${data?.trending}`,
      providesTags: ["Movies"],
    }),

    getCastFullDetails: builder.query({
      query: (data) =>
        `person/${data?.id}?append_to_response=combined_credits,external_ids,images`,
      providesTags: ["Movies"],
    }),
  }),
});

export const {
  useAddFavoritesMutation,
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useGetSearchMoviesQuery,
  useGetMovieImagesQuery,
  useGetFavoriteMoviesQuery,
  useGetGenresQuery,
  useGetGenresMoviesQuery,
  useGetSpecialMoviesQuery,
  useGetUpComingMoviesQuery,
  useGetMovieFullDetailsByIdQuery,
  useGetTrendingMoviesQuery,
  useGetCastFullDetailsQuery,
} = restApi;

export default restApi;
