import Link from "next/link";
import { usePathname } from "next/navigation";

//react imports
import React, { useEffect, useRef, useState } from "react";
import {
  useGetSearchMoviesQuery,
  useGetGenresQuery,
} from "@/store/api/restApis";

import { useDispatch, useSelector } from "react-redux";

import {
  searchHandler,
  searchInputHandler,
  openNav,
  closeNav,
} from "@/store/slice/tabsSlice";
import { AiOutlineSearch, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import OutsideClickHandlerWrapper from "../OutsideClickHandlerWrapper";

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

//import components
import SearchTabComponent from "../SearchTabComponent";
import Image from "next/image";
import useDebounce from "../../hooks/useDebounce"; 

export const specials = [
  { name: "Hindi movies", page: "hindi", code: "hi" },
  { name: "Telugu movies", page: "telugu", code: "te" },
  { name: "Tamil movies", page: "tamil", code: "ta" },
  { name: "Kannada movies", page: "kannada", code: "kn" },
  { name: "Malayalam movies", page: "malayalam", code: "ml" },
];

const Navbar = () => {
  const dispatch = useDispatch();

  const menuRef = useRef(null);

  const [dropDown, setDropDown] = useState(false);

  const [splDropDown, setSplDropDown] = useState(false);

  // const [searchInput, setInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [tabToggle, setToggle] = useState(false);
  const [dropDownCard, setDropDownCard] = useState(false);
  const [splDropDownCard, setSplDropDownCard] = useState(false);
  const path = usePathname();

  const searchInput = useSelector((state) => state.tabsSlice.searchInput);
   const debouncedSearchInput = useDebounce(searchInput, 1000);

   useEffect(() => {
     if (debouncedSearchInput) {
       setToggle(true);
       dispatch(searchInputHandler(debouncedSearchInput));
     } else {
       setToggle(false);
     }
   }, [debouncedSearchInput, dispatch]);

  const open = useSelector((state) => state.tabsSlice.navToggle);

  // console.log(searchInput);

  const submitHandler = () => {
    setSearchResult(searchInput);
    dispatch(searchHandler(searchInput));

    dispatch(closeNav());
    setToggle(false);
    // setInput("");
    dispatch(searchInputHandler(""));
  };

  const clearInput = () => {
    // setInput("");
  };

  const { data } = useGetSearchMoviesQuery({
    searchInput: debouncedSearchInput,
  });

  const searchData = data?.results;

  const { data: moviesList } = useGetGenresQuery();

  return (
    <div className=" bg-slate-600 w-full fixed z-30 ">
      <div className=" bg-slate-600 px-5 py-3 flex justify-between items-center fixed top-0 left-0 right-0 w-full z-30  ">
        <Link href={"/"}>
          <Image
            height={100}
            width={100}
            className="h-[40px] w-[40px] rounded-full"
            src="/movieszone.png"
            alt="logo"
          />
        </Link>
        <div className="md:hidden transition-all  duration-500 ">
          {!open ? (
            <AiOutlineMenu onClick={() => dispatch(openNav())} />
          ) : (
            <AiOutlineClose
              onClick={() => {
                setDropDown(false);
                dispatch(closeNav(false));
              }}
            />
          )}
        </div>

        <div className=" md:flex   w-[75%] justify-evenly items-center hidden">
          <div className="space-x-4 flex flex-col sm:flex-row items-center order-2 sm:order-1">
            <div className="relative">
              <h1
                onClick={() => {
                  setDropDownCard((prev) => !prev);
                  setSplDropDownCard(false);
                }}
                className={`ml-4 text-white font-bold mb-3 sm:mb-0  `}
              >
                Categories
              </h1>
              <OutsideClickHandlerWrapper
                onOutsideClick={() => setDropDownCard(false)}
              >
                {dropDownCard && (
                  <div className="bg-white w-[500px] rounded-lg absolute top-12 p-4 hidden  md:grid grid-cols-3 gap-5 ">
                    {moviesList?.genres?.map((item, idx) => (
                      <Link
                        className="hover:bg-slate-100"
                        onClick={() => {
                          // setOpen(false);
                          dispatch(closeNav());
                          setDropDownCard(false);
                        }}
                        href={`/category/${item?.id}`}
                        key={idx}
                      >
                        {item?.name}
                      </Link>
                    ))}
                  </div>
                )}
              </OutsideClickHandlerWrapper>
            </div>

            <div className="relative">
              <h1
                onClick={() => {
                  setDropDownCard(false);
                  setSplDropDownCard((prev) => !prev);
                }}
                className={`ml-4 text-white font-bold mb-3 sm:mb-0  `}
              >
                Specials
              </h1>
              <OutsideClickHandlerWrapper
                onOutsideClick={() => setSplDropDownCard(false)}
              >
                {splDropDownCard && (
                  <div className="bg-white w-[190px]  rounded-lg absolute top-12 p-4 hidden  md:grid grid-cols-1 gap-3 ">
                    {specials.map((item, idx) => (
                      <Link
                        className="hover:bg-slate-100"
                        onClick={() => {
                          dispatch(closeNav());
                          setSplDropDownCard(false);
                        }}
                        href={`/special/${item?.page}`}
                        key={idx}
                      >
                        {item?.name}
                      </Link>
                    ))}
                  </div>
                )}
              </OutsideClickHandlerWrapper>
            </div>

            <Link href={"/favorite"}>
              <h1
                onClick={() => {
                  setDropDownCard(false);
                  setSplDropDownCard(false);
                }}
                className={`ml-4 text-white font-bold mb-3 sm:mb-0 ${
                  path === "/favorite" ? "underline" : ""
                } `}
              >
                Favorite
              </h1>
            </Link>
          </div>
          <div className="flex space-x-2 sm:space-y-0  justify-center items-center sm:flex-row order-1 sm:order-2">
            <div className="relative flex">
              <input
                type="text"
                placeholder={"Search Movie Name"}
                onChange={(e) => {
                  setToggle(true);
                  dispatch(searchInputHandler(e.target.value));
                }}
                value={searchInput}
                className="py-2 px-4 border border-gray-300  focus:outline-none focus:ring focus:border-blue-300"
              />
              {tabToggle && (
                  <OutsideClickHandlerWrapper
                    onOutsideClick={() => setToggle(false)}
                  >
                    <div
                      className="bg-gray-800 md:left-0   absolute w-[90%] md:w-full h-[200px] overflow-hidden overflow-y-auto -bottom-52"
                    >
                      {searchData.length ? (
                        searchData.map((e, idx) => (
                          <SearchTabComponent
                            tabHandler={() => setToggle()}
                            key={idx}
                            {...e}
                          />
                        ))
                      ) : (
                        <h1 className="text-red-500 text-center mt-[80px] my-auto">
                          no results{" "}
                        </h1>
                      )}
                    </div>
                  </OutsideClickHandlerWrapper>
              )}
            </div>
            <Link href={`/search-movies/${searchInput}`}>
              <button
                onClick={submitHandler}
                className=" text-white border-2 font-semibold py-2 px-3 rounded-lg flex items-center"
              >
                <AiOutlineSearch size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <OutsideClickHandlerWrapper onOutsideClick={() => dispatch(closeNav())}>
        <div
          className={` w-full   flex flex-col md:items-center bg-slate-600  md:pb-0 py-8 md:hidden absolute md:static   md:z-auto left-0  md:w-auto md:pl-0  transition-all duration-500 z-20 ease-in ${
            open ? "top-16 " : "top-[-490px]"
          }`}
        >
          <div className="   ">
            <div className="flex  w-full py-4   ">
              <div className="relative flex justify-between items-center px-3  w-full ">
                <input
                  type="text"
                  onChange={(e) => {
                    // setInput(e.target.value);
                    setToggle(true);
                    dispatch(searchInputHandler(e.target.value));
                  }}
                  value={searchInput}
                  className="py-2 w-[70%]  border border-gray-300  focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Search Movie Name"
                />
                <Link className="" href={`/search-movies/${searchInput}`}>
                  <button
                    onClick={submitHandler}
                    className=" text-white mr-5 border-2 font-semibold py-2 px-3 rounded-lg flex items-center"
                  >
                    <AiOutlineSearch size={20} />
                  </button>
                </Link>
                {tabToggle && (
                  <div
                    ref={menuRef}
                    className="bg-gray-800    absolute w-[90%] h-[200px] overflow-hidden overflow-y-auto -bottom-52"
                  >
                    {searchData.length ? (
                      searchData.map((e, idx) => (
                        <SearchTabComponent
                          tabHandler={() => setToggle()}
                          clearInput={clearInput}
                          key={idx}
                          {...e}
                        />
                      ))
                    ) : (
                      <h1 className="text-red-500 text-center mt-[80px] my-auto">
                        no results{" "}
                      </h1>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Link href={"/favorite"}>
              <h1
                onClick={() => {
                  dispatch(closeNav());
                }}
                className={`ml-4 text-white font-bold mb-3 sm:mb-0 ${
                  path === "/favorite" ? "" : ""
                } `}
              >
                Favorite
              </h1>
            </Link>
            <div className="flex justify-between items-center my-3">
              <h1 className={`ml-4 text-white font-bold  `}>Categories</h1>

              <div
                onClick={() => setDropDown((prev) => !prev)}
                className="mr-5 text-white"
              >
                {!dropDown ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
              </div>
            </div>
            {dropDown && (
              <div
                className={`flex flex-col  overflow-y-auto    space-y-1 items-center  divide-y-2  ${
                  dropDown && "h-[400px]"
                }  `}
              >
                {moviesList?.genres?.map((item, idx) => (
                  <Link
                    className="w-full mx-auto px-5 py-2 text-white font-semibold"
                    onClick={() => {
                      dispatch(closeNav());
                      setDropDown(false);
                    }}
                    href={`/category/${item?.id}`}
                    key={idx}
                  >
                    {item?.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <h1 className={`ml-4 text-white font-bold  `}>Specials</h1>

              <div
                onClick={() => setSplDropDown((prev) => !prev)}
                className="mr-5 text-white"
              >
                {!splDropDown ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
              </div>
            </div>
            {splDropDown && (
              <div
                className={`flex flex-col  overflow-y-auto    space-y-1 items-center  divide-y-2  ${
                  splDropDown && "h-[300px]"
                }  `}
              >
                {specials?.map((item, idx) => (
                  <Link
                    className="w-full mx-auto px-5 py-2 text-white font-semibold"
                    onClick={() => {
                      dispatch(closeNav());
                      setSplDropDown(false);
                    }}
                    href={`/special/${item?.page}`}
                    key={idx}
                  >
                    {item?.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandlerWrapper>
    </div>
  );
};

export default Navbar;
