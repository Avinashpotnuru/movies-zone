import { useRouter } from "next/router";

import { useEffect, useRef, useState } from "react";

import {
  AiOutlineArrowRight,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";

import useDebounce from "@/hooks/useDebounce";
import { useGetSearchMoviesQuery } from "@/store/api/restApis";

import ApiProvider from "../ApiProvider";
import SearchTabComponent from "../SearchTabComponent";

const QUICK_SEARCHES = ["Oppenheimer", "Inception", "The Dark Knight", "Parasite"];

const iconButtonClasses =
  "flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-slate-300 transition-colors duration-200 hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]";

const SearchOverlayContent = ({ onClose }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const hasQuery = Boolean(searchInput.trim());

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

  const focusInput = () => inputRef.current?.focus();

  const runSearch = () => {
    const query = searchInput.trim();
    if (!query) return;

    setSearchInput("");
    onClose();
    router.push(`/search-movies/${encodeURIComponent(query)}`);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    runSearch();
  };

  const selectSuggestion = () => {
    setSearchInput("");
    onClose();
  };

  return (
    <div
      className="filter-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#020c1b]/95 px-3 py-6 backdrop-blur-xl sm:px-6 sm:py-[10vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search movies"
        className="nav-enter relative w-full max-w-3xl border border-white/15 bg-[#061a31] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)]"
      >
        <span
          className="absolute inset-x-0 top-0 h-[3px] bg-[#51E5FF]"
          aria-hidden="true"
        />
        <span
          className="absolute left-0 top-0 h-[3px] w-20 bg-[#F4442E]"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-4 px-5 pb-5 pt-6 sm:px-8 sm:pt-7">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
              <span className="h-px w-7 bg-[#F4442E]" aria-hidden="true" />
              Search / Archive
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Find a film.
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <kbd className="hidden border border-white/15 bg-[#04152d] px-2 py-1 text-[10px] font-semibold tracking-widest text-slate-400 sm:inline">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className={iconButtonClasses}
            >
              <AiOutlineClose size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="px-5 sm:px-8">
          <div className="flex items-center gap-2 border-y border-white/10 py-2.5 transition-colors duration-200 focus-within:border-[#51E5FF]/60 sm:gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#51E5FF]/40 bg-[#51E5FF]/10 text-[#51E5FF] sm:h-11 sm:w-11"
              aria-hidden="true"
            >
              <AiOutlineSearch size={20} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by title…"
              aria-label="Search movies"
              className="h-11 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden sm:h-12 sm:text-lg"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  focusInput();
                }}
                aria-label="Clear search"
                className={iconButtonClasses}
              >
                <AiOutlineClose size={14} aria-hidden="true" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit search"
              disabled={!hasQuery}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[#51E5FF] text-[#04152d] transition duration-200 ease-out hover:bg-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] sm:h-11 sm:w-auto sm:gap-2 sm:px-5"
            >
              <span className="hidden text-sm font-bold sm:inline">Search</span>
              <AiOutlineArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="max-h-[46vh] min-h-[180px] overflow-y-auto" aria-live="polite">
          {hasQuery ? (
            suggestions.length ? (
              <>
                <p className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:px-8">
                  <span>Matches</span>
                  <span className="text-[#51E5FF] tabular-nums">
                    {String(suggestions.length).padStart(2, "0")}
                  </span>
                </p>
                {suggestions.map((movie) => (
                  <SearchTabComponent
                    key={movie.id}
                    {...movie}
                    onSelect={selectSuggestion}
                  />
                ))}
              </>
            ) : (
              <div className="px-5 py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center border border-white/15 text-slate-500">
                  <AiOutlineSearch size={20} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-bold text-white">
                  No matches for “{searchInput}”
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Try a shorter title or a different spelling.
                </p>
              </div>
            )
          ) : (
            <div className="px-5 py-8 sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Popular searches
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchInput(term);
                      focusInput();
                    }}
                    className="min-h-[38px] border border-white/15 px-3 text-xs font-semibold text-slate-300 transition-colors duration-200 hover:border-[#51E5FF]/60 hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-500">
                Start typing to see live suggestions from the movie library.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Powered by TMDB</span>
          <button
            type="button"
            onClick={runSearch}
            disabled={!hasQuery}
            className="inline-flex items-center gap-2 text-[#51E5FF] transition-colors duration-200 hover:text-white disabled:cursor-not-allowed disabled:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
          >
            See all results
            <AiOutlineArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchOverlay = ({ onClose }) => (
  <ApiProvider>
    <SearchOverlayContent onClose={onClose} />
  </ApiProvider>
);

export default SearchOverlay;
