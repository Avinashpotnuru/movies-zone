import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AiOutlineArrowRight,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineFavorite } from "react-icons/md";

import useDebounce from "@/hooks/useDebounce";
import {
  useGetGenresQuery,
  useGetSearchMoviesQuery,
} from "@/store/api/restApis";
import {
  closeNav,
  openNav,
  searchHandler,
  searchInputHandler,
} from "@/store/slice/tabsSlice";

import OutsideClickHandlerWrapper from "../OutsideClickHandlerWrapper";
import SearchTabComponent from "../SearchTabComponent";

export const specials = [
  { name: "Hindi movies", page: "hindi", code: "hi" },
  { name: "Telugu movies", page: "telugu", code: "te" },
  { name: "Tamil movies", page: "tamil", code: "ta" },
  { name: "Kannada movies", page: "kannada", code: "kn" },
  { name: "Malayalam movies", page: "malayalam", code: "ml" },
];

const NavDropdown = ({ index, label, links, isOpen, onToggle, onClose, active }) => (
  <OutsideClickHandlerWrapper onOutsideClick={onClose}>
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group relative flex h-11 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] ${
          active ? "text-[#51E5FF]" : "text-white"
        }`}
      >
        <span className="text-[10px] font-semibold text-[#51E5FF]/60 tabular-nums">
          {index}
        </span>
        {label}
        <IoMdArrowDropdown
          size={18}
          aria-hidden="true"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        <span
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#51E5FF] transition-transform duration-300 ${
            active || isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+22px)] z-50 w-[420px] border border-white/10 bg-[#0a1b31] p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              {label}
            </p>
            <span className="text-[10px] tracking-widest text-slate-400 tabular-nums">
              {String(links.length).padStart(2, "0")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 py-3">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={onClose}
                className="group flex items-center justify-between py-2 text-sm text-slate-200 transition-colors duration-200 hover:text-[#51E5FF]"
              >
                <span>{link.label}</span>
                <AiOutlineArrowRight
                  size={14}
                  aria-hidden="true"
                  className="-translate-x-1 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>
          <Link
            href="#movies"
            onClick={onClose}
            className="flex items-center gap-2 border-t border-white/10 pt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#51E5FF] transition-colors hover:text-white"
          >
            Explore all movies
            <AiOutlineArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  </OutsideClickHandlerWrapper>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const path = router.pathname;

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [specialsOpen, setSpecialsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const searchInput = useSelector((state) => state.tabsSlice.searchInput);
  const navOpen = useSelector((state) => state.tabsSlice.navToggle);
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: suggestionsData } = useGetSearchMoviesQuery(
    { searchInput: debouncedSearch },
    { skip: !debouncedSearch.trim() }
  );
  const { data: genresData } = useGetGenresQuery();

  const suggestions = suggestionsData?.results?.slice(0, 6) ?? [];
  const categoryLinks = (genresData?.genres ?? []).map((genre) => ({
    id: genre.id,
    label: genre.name,
    href: `/category/${genre.id}`,
  }));
  const specialLinks = specials.map((item) => ({
    id: item.page,
    label: item.name,
    href: `/special/${item.page}`,
  }));

  const closeAll = useCallback(() => {
    dispatch(closeNav());
    setCategoriesOpen(false);
    setSpecialsOpen(false);
    setSearchOpen(false);
  }, [dispatch]);

  const runSearch = () => {
    const query = searchInput.trim();
    if (!query) return;

    dispatch(searchHandler(query));
    dispatch(searchInputHandler(""));
    closeAll();
    router.push(`/search-movies/${encodeURIComponent(query)}`);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    runSearch();
  };

  const selectSuggestion = () => {
    dispatch(searchInputHandler(""));
    closeAll();
  };

  const changeSearch = (event) => {
    dispatch(searchInputHandler(event.target.value));
  };

  useEffect(() => {
    closeAll();
  }, [path, closeAll]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        closeAll();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  useEffect(() => {
    if (!searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchInputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [searchOpen]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 p-3 sm:p-4">
        <header className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-5 border border-white/10 bg-[#04152d]/95 px-4 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:h-[72px] sm:px-6">
          <Link href="/" onClick={closeAll} className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <Image
                src="/movieszone.png"
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-[#51E5FF]/60"
              />
              <span className="absolute right-0 top-0 h-2 w-2 bg-[#51E5FF]" />
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black tracking-[0.18em] text-white">
                MOVIES
              </span>
              <span className="hidden text-[15px] font-light tracking-[0.18em] text-[#51E5FF] sm:inline">
                ZONE
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <NavDropdown
              index="01"
              label="Categories"
              links={categoryLinks}
              isOpen={categoriesOpen}
              onToggle={() => {
                setCategoriesOpen((prev) => !prev);
                setSpecialsOpen(false);
              }}
              onClose={() => setCategoriesOpen(false)}
              active={path.startsWith("/category")}
            />
            <NavDropdown
              index="02"
              label="Specials"
              links={specialLinks}
              isOpen={specialsOpen}
              onToggle={() => {
                setSpecialsOpen((prev) => !prev);
                setCategoriesOpen(false);
              }}
              onClose={() => setSpecialsOpen(false)}
              active={path.startsWith("/special")}
            />
            <Link
              href="/favorite"
              onClick={closeAll}
              className={`group relative flex h-11 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] ${
                path === "/favorite" ? "text-[#51E5FF]" : "text-white"
              }`}
            >
              <span className="text-[10px] font-semibold text-[#51E5FF]/60 tabular-nums">
                03
              </span>
              Favorites
              <span
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#51E5FF] transition-transform duration-300 ${
                  path === "/favorite" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex h-10 items-center gap-3 border border-white/15 px-3 text-sm text-slate-300 transition-colors duration-200 hover:border-[#51E5FF]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
            >
              <AiOutlineSearch size={18} aria-hidden="true" />
              <span className="hidden lg:inline">Search movies</span>
              <kbd className="hidden border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 lg:inline">
                ⌘ K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => (navOpen ? dispatch(closeNav()) : dispatch(openNav()))}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
              className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition-colors duration-200 hover:border-[#51E5FF]/60 hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] lg:hidden"
            >
              {navOpen ? (
                <AiOutlineClose size={20} aria-hidden="true" />
              ) : (
                <AiOutlineMenu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <div
          aria-hidden={!navOpen}
          className={`mx-auto mt-2 max-w-[1400px] border border-white/10 bg-[#04152d]/95 px-5 py-5 backdrop-blur-xl transition duration-300 ease-out lg:hidden ${
            navOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-full items-center gap-3 border border-white/15 px-4 text-sm text-slate-300 transition-colors hover:border-[#51E5FF]/60 hover:text-white"
          >
            <AiOutlineSearch size={18} aria-hidden="true" />
            Search movies
          </button>

          <div className="mt-4 space-y-1">
            <Link
              href="/favorite"
              onClick={closeAll}
              className="flex min-h-[44px] items-center justify-between border-b border-white/10 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-[#51E5FF]"
            >
              <span className="flex items-center gap-2">
                <MdOutlineFavorite size={17} aria-hidden="true" />
                Favorites
              </span>
              <span className="text-[10px] text-[#51E5FF]/60 tabular-nums">03</span>
            </Link>

            {[
              {
                label: "Categories",
                index: "01",
                links: categoryLinks,
                open: categoriesOpen,
                toggle: () => {
                  setCategoriesOpen((prev) => !prev);
                  setSpecialsOpen(false);
                },
              },
              {
                label: "Specials",
                index: "02",
                links: specialLinks,
                open: specialsOpen,
                toggle: () => {
                  setSpecialsOpen((prev) => !prev);
                  setCategoriesOpen(false);
                },
              },
            ].map((section) => (
              <div key={section.label}>
                <button
                  type="button"
                  onClick={section.toggle}
                  aria-expanded={section.open}
                  className="flex min-h-[44px] w-full items-center justify-between border-b border-white/10 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-[#51E5FF]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-[#51E5FF]/60 tabular-nums">
                      {section.index}
                    </span>
                    {section.label}
                  </span>
                  {section.open ? (
                    <IoMdArrowDropup size={20} aria-hidden="true" />
                  ) : (
                    <IoMdArrowDropdown size={20} aria-hidden="true" />
                  )}
                </button>
                {section.open && (
                  <div className="grid grid-cols-2 gap-1 py-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={closeAll}
                        className="px-2 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-[#51E5FF]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#04152d]/90 px-4 pt-[12vh] backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="w-full max-w-2xl border border-white/15 bg-[#0a1b31] shadow-2xl">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-3 border-b border-white/10 px-5"
            >
              <AiOutlineSearch size={22} className="shrink-0 text-[#51E5FF]" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={changeSearch}
                placeholder="Search movies…"
                aria-label="Search movies"
                className="h-16 min-w-0 flex-1 bg-transparent text-lg text-white placeholder:text-slate-500 focus:outline-none"
              />
              <kbd className="hidden shrink-0 border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline">
                ESC
              </kbd>
            </form>

            <div className="max-h-[50vh] overflow-y-auto">
              {searchInput.trim() ? (
                suggestions.length ? (
                  suggestions.map((movie) => (
                    <SearchTabComponent
                      key={movie.id}
                      {...movie}
                      onSelect={selectSuggestion}
                    />
                  ))
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-slate-400">
                    No results for “{searchInput}”
                  </p>
                )
              ) : (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  Start typing to find a movie…
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>Powered by TMDB</span>
              <button
                type="button"
                onClick={runSearch}
                className="inline-flex items-center gap-2 text-[#51E5FF] transition-colors hover:text-white"
              >
                See all results
                <AiOutlineArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
