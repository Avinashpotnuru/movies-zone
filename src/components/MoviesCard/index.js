/* eslint-disable @next/next/no-img-element */
//next imports
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
//react imports
import { useEffect, useState } from "react";

import CircleRating from "../CircleRating";

import {
  useAddFavoritesMutation,
  useGetFavoriteMoviesQuery,
} from "@/store/api/restApis";

import { imagePath } from "@/utilities";

//third party packages
import { RxCross2 } from "react-icons/rx";
import { MdOutlineFavorite } from "react-icons/md";

function MoviesCard({
  title,
  poster_path,
  id,

  vote_average,

  overview,
}) {
  const rate = Math.floor(vote_average);

  // console.log(rate);

  const [toggle, setToggle] = useState(false);

  const [addFavorite] = useAddFavoritesMutation();

  const path = usePathname();

  useEffect(() => {}, [addFavorite]);

  return (
    <div className="bg-white h-[540px] w-[310px] md:h-auto mx-auto sm:mx-0 sm:w-auto lg:h-[430px]  shadow-md rounded m-3  transition duration-700 ease-in-out  overflow-hidden">
      <Link href={`/movies/${id}`}>
        <div className="h-[75%] lg:h-[70%] w-full relative overflow-hidden">
          <img
            className="w-full h-full  rounded-t hover:border-[6px] hover:border-white  transition duration-700 ease-in-out hover:scale-110"
            src={`${
              poster_path ? `${imagePath}${poster_path}` : "/noimage.png"
            }`}
            alt={`image${id}`}
          />
          <div className="h-[50px] w-[50px] absolute font-bold hover:text-green-400 bg-white top-4 right-4 rounded-full flex justify-center items-center hover:scale-125 transition duration-700 ease-in-out ">
            <CircleRating rating={vote_average.toFixed(1)} />
          </div>
        </div>
      </Link>

      <div className="w-full h-[25%] lg:h-[35%]  px-2 py-3">
        <div className="flex justify-between  items-center w-full">
          <h1 className=" hover:text-yellow-600 text-gray-700">
            <span className="text-base font-semibold uppercase tracking-wide ">
              {title}
            </span>
          </h1>

          {path !== "/favorite" && (
            <div
              className=""
              onClick={() => {
                // addFav(id);
                setToggle(id);
                addFavorite({
                  media_type: "movie",
                  media_id: id,
                  favorite: true,
                });
              }}
            >
              {id === toggle ? (
                <MdOutlineFavorite size={20} className="text-red-500 " />
              ) : (
                <MdOutlineFavorite
                  // onClick={() => delFav(id)}
                  size={20}
                  className=""
                />
              )}
            </div>
          )}

          {path === "/favorite" && (
            <div
              className=""
              onClick={() => {
                addFavorite({
                  media_type: "movie",
                  media_id: id,
                  favorite: false,
                });
              }}
            >
              <RxCross2 />
            </div>
          )}
        </div>

        <p className="text-gray-600 md:hidden lg:block text-sm leading-5 mt-1 ">
          {`${overview.slice(0, 80)}....`}
        </p>

        <p className="text-gray-600 text-sm leading-5 mt-1 hidden md:block lg:hidden ">
          {`${overview}`}
        </p>
      </div>
    </div>
  );
}

export default MoviesCard;
