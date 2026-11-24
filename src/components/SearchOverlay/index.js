import { useRouter } from "next/router";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";

import useDebounce from "@/hooks/useDebounce";
import { useGetSearchMoviesQuery } from "@/store/api/restApis";
import { searchInputHandler } from "@/store/slice/tabsSlice";

import SearchTabComponent from "../SearchTabComponent";

const SearchOverlay = ({ onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef(null);

  const searchInput = useSelector((state) => state.tabsSlice.searchInput);
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data } = useGetSearchMoviesQuery(
    { searchInput: debouncedSearch },
    { skip: !debouncedSearch.trim() }
  );
  const suggestions = data?.results?.slice(0, 6) ?? [];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const runSearch = () => {
    const query = searchInput.trim();
    if (!query) return;

    dispatch(searchInputHandler(""));
    onClose();
    router.push(`/search-movies/${encodeURIComponent(query)}`);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    runSearch();
  };

  const selectSuggestion = () => {
    dispatch(searchInputHandler(""));
    onClose();
  };

  const changeSearch = (event) => {
    dispatch(searchInputHandler(event.target.value));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#04152d]/90 px-4 pt-[12vh] backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl border border-white/15 bg-[#0a1b31] shadow-2xl">
        <form
          onSubmit={submitSearch}
          className="flex items-center gap-3 border-b border-white/10 px-5"
        >
          <AiOutlineSearch
            size={22}
            className="shrink-0 text-[#51E5FF]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
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
  );
};

export default SearchOverlay;
