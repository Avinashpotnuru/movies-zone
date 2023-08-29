"use client";
//hooks
import React, { useEffect } from "react";

//next imports
import { usePathname } from "next/navigation";

//import components
import MoviesCard from "../MoviesCard";

//import from store
import { useGetFavoriteMoviesQuery } from "@/store/api/restApis";

const Favorites = () => {
  const path = usePathname();

  const { data } = useGetFavoriteMoviesQuery();

  const delFav = (e) => {};

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      <h1 className="text-4xl text-white font-extrabold mb-3 ">
        Favorites Movies
      </h1>

      {data?.results.length ? (
        <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full  md:gap-5 my-7">
          {data?.results.map((val, idx) => (
            <MoviesCard
              addFav={() => {}}
              delFav={delFav}
              path={path}
              key={idx}
              {...val}
            />
          ))}
        </div>
      ) : (
        <h1 className="text-white text-2xl text-center h-1/2 mt-28  font-semibold">
          No movies in Favorite
        </h1>
      )}
    </div>
  );
};

export default Favorites;
