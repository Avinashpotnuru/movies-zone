import { useEffect } from "react";

import {
  AiOutlineArrowRight,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

import {
  LANGUAGE_OPTIONS,
  MAX_YEAR,
  MIN_YEAR,
  SORT_OPTIONS,
  VOTE_COUNTS,
} from "./constants";

const OptionButton = ({ active, onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex min-h-[42px] items-center justify-between gap-2 border px-3 text-left text-[11px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${
      active
        ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
        : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/30 hover:text-white"
    } ${className}`}
  >
    <span className="truncate">{children}</span>
    {active && <AiOutlineCheck size={13} aria-hidden="true" className="shrink-0" />}
  </button>
);

const RatingRange = ({ min, max, onChange }) => {
  const minValue = Number(min) || 0;
  const maxValue = Number(max) || 10;
  const isCustom = minValue > 0 || maxValue < 10;

  const commit = (nextMin, nextMax) => {
    const boundedMin = Math.min(nextMin, nextMax);
    const boundedMax = Math.max(nextMax, nextMin);
    onChange({
      voteAverageGte: boundedMin > 0 ? boundedMin : null,
      voteAverageLte: boundedMax < 10 ? boundedMax : null,
    });
  };

  return (
    <div className="border border-[#F4442E]/30 bg-[#F4442E]/5 px-3 py-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F4442E]">
            Score range
          </p>
          <p className="mt-1 text-lg font-extrabold leading-none tabular-nums text-white">
            {minValue.toFixed(1)}
            <span className="mx-1 text-slate-600">—</span>
            {maxValue.toFixed(1)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => commit(0, 10)}
          disabled={!isCustom}
          className="min-h-[32px] border border-white/15 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors enabled:hover:border-[#F4442E] enabled:hover:text-[#F4442E] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="dual-range mt-4">
        <span aria-hidden="true" className="dual-range__track" />
        <span
          aria-hidden="true"
          className="dual-range__fill"
          style={{
            left: `${(minValue / 10) * 100}%`,
            right: `${((10 - maxValue) / 10) * 100}%`,
          }}
        />
        <input
          aria-label="Minimum rating"
          aria-valuetext={`${minValue.toFixed(1)} out of 10`}
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={minValue}
          onChange={(event) =>
            commit(Math.min(Number(event.target.value), maxValue), maxValue)
          }
          className="dual-range__input dual-range__input--min"
          style={{ zIndex: minValue > 8 ? 5 : 3 }}
        />
        <input
          aria-label="Maximum rating"
          aria-valuetext={`${maxValue.toFixed(1)} out of 10`}
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={maxValue}
          onChange={(event) =>
            commit(minValue, Math.max(Number(event.target.value), minValue))
          }
          className="dual-range__input dual-range__input--max"
          style={{ zIndex: maxValue < 2 ? 5 : 4 }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[9px] tabular-nums text-slate-600">
        {[0, 2, 4, 6, 8, 10].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
};

const YearRange = ({ from, to, onChange }) => {
  const fromValue = Number(from) || MIN_YEAR;
  const toValue = Number(to) || MAX_YEAR;
  const isCustom = Boolean(from || to);

  const commit = (nextFrom, nextTo) => {
    const boundedFrom = Math.min(nextFrom, nextTo);
    const boundedTo = Math.max(nextTo, nextFrom);
    onChange({
      releaseFrom: boundedFrom > MIN_YEAR ? String(boundedFrom) : "",
      releaseTo: boundedTo < MAX_YEAR ? String(boundedTo) : "",
    });
  };

  return (
    <div className="border border-[#51E5FF]/30 bg-[#51E5FF]/5 px-3 py-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#51E5FF]">
            Release window
          </p>
          <p className="mt-1 text-lg font-extrabold leading-none tabular-nums text-white">
            {from ? fromValue : "Any"}
            <span className="mx-1 text-slate-600">—</span>
            {to ? toValue : "Any"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => commit(MIN_YEAR, MAX_YEAR)}
          disabled={!isCustom}
          className="min-h-[32px] border border-white/15 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors enabled:hover:border-[#51E5FF] enabled:hover:text-[#51E5FF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="dual-range mt-4">
        <span aria-hidden="true" className="dual-range__track" />
        <span
          aria-hidden="true"
          className="dual-range__fill"
          style={{
            left: `${((fromValue - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
            right: `${((MAX_YEAR - toValue) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
          }}
        />
        <input
          aria-label="Release year from"
          aria-valuetext={from ? String(fromValue) : "Any year"}
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step="1"
          value={fromValue}
          onChange={(event) =>
            commit(Math.min(Number(event.target.value), toValue), toValue)
          }
          className="dual-range__input dual-range__input--min"
          style={{ zIndex: fromValue > MAX_YEAR - 10 ? 5 : 3 }}
        />
        <input
          aria-label="Release year to"
          aria-valuetext={to ? String(toValue) : "Any year"}
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step="1"
          value={toValue}
          onChange={(event) =>
            commit(fromValue, Math.max(Number(event.target.value), fromValue))
          }
          className="dual-range__input dual-range__input--max"
          style={{ zIndex: toValue < MIN_YEAR + 10 ? 5 : 4 }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[9px] tabular-nums text-slate-600">
        {[MIN_YEAR, 1950, 2000, MAX_YEAR].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
};

const FilterSection = ({ title, hint, children }) => (
  <section className="border-t border-white/10 px-5 py-5">
    <div className="flex items-baseline justify-between gap-2">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
        {title}
      </h3>
      {hint && (
        <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-slate-600">
          {hint}
        </span>
      )}
    </div>
    <div className="mt-3">{children}</div>
  </section>
);

export const FilterPanel = ({
  filters,
  genres,
  onChange,
  onClose,
  activeCount,
  showLanguage = true,
  languageLabel = "",
}) => {
  const toggleGenre = (id) => {
    const value = String(id);
    const next = filters.withGenres.includes(value)
      ? filters.withGenres.filter((item) => item !== value)
      : [...filters.withGenres, value];
    onChange({ withGenres: next });
  };

  return (
    <div>
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#51E5FF]">
              Curation control
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-white">
              Refine
            </h2>
          </div>
          <div className="min-w-[46px] border border-white/10 px-2 py-1.5 text-center">
            <span className="block bg-[#F4442E] text-sm font-bold leading-none tabular-nums text-white">
              {String(activeCount).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Active
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="mt-4 flex min-h-[40px] w-full items-center justify-center gap-2 border border-white/10 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-[#F4442E] hover:text-[#F4442E]"
          >
            <AiOutlineClose size={16} aria-hidden="true" />
            Close panel
          </button>
        )}
        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          Every change writes to the URL. Copy the address to share this exact
          view.
        </p>
      </div>

      <div>
        <FilterSection title="Order by" hint="Sort options">
          <div
            role="group"
            aria-label="Sort movies by"
            className="grid grid-cols-2 gap-1.5"
          >
            {SORT_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                active={filters.sortBy === option.value}
                onClick={() => onChange({ sortBy: option.value })}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Genres"
          hint={`${filters.withGenres.length} selected`}
        >
          <div
            role="group"
            aria-label="Genres"
            className="grid grid-cols-2 gap-1.5"
          >
            {genres.map((genre) => {
              const selected = filters.withGenres.includes(String(genre.id));
              return (
                <label
                  key={genre.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2 border px-2.5 transition-colors focus-within:ring-1 focus-within:ring-[#51E5FF] ${
                    selected
                      ? "border-[#51E5FF]/70 bg-[#51E5FF]/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleGenre(genre.id)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                      selected
                        ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                        : "border-white/15"
                    }`}
                  >
                    {selected && (
                      <AiOutlineCheck size={12} aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[11px] font-semibold ${
                      selected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {genre.name}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Release years" hint="Drag the handles">
          <YearRange
            from={filters.releaseFrom}
            to={filters.releaseTo}
            onChange={onChange}
          />
        </FilterSection>

        <FilterSection title="Rating" hint="Drag the handles">
          <RatingRange
            min={filters.voteAverageGte}
            max={filters.voteAverageLte}
            onChange={onChange}
          />
        </FilterSection>

        <FilterSection title="Minimum votes" hint="Popularity floor">
          <div
            role="group"
            aria-label="Minimum vote count"
            className="grid grid-cols-3 gap-1.5"
          >
            <OptionButton
              active={!filters.voteCountGte}
              onClick={() => onChange({ voteCountGte: null })}
              className="min-h-[38px] px-2 text-[10px]"
            >
              Any
            </OptionButton>
            {VOTE_COUNTS.map((count) => (
              <OptionButton
                key={count}
                active={filters.voteCountGte === count}
                onClick={() => onChange({ voteCountGte: count })}
                className="min-h-[38px] px-2 text-[10px] tabular-nums"
              >
                {count >= 1000 ? `${count / 1000}K+` : `${count}+`}
              </OptionButton>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Original language"
          hint={showLanguage ? "Audio" : "Collection"}
        >
          {showLanguage ? (
            <div
              role="group"
              aria-label="Original language"
              className="flex flex-wrap gap-1.5"
            >
              <OptionButton
                active={!filters.originalLanguage}
                onClick={() => onChange({ originalLanguage: "" })}
                className="min-h-[36px] px-2.5 text-[10px]"
              >
                Any
              </OptionButton>
              {LANGUAGE_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  active={filters.originalLanguage === option.value}
                  onClick={() => onChange({ originalLanguage: option.value })}
                  className="min-h-[36px] px-2.5 text-[10px]"
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[42px] items-center justify-between gap-3 border border-[#51E5FF]/40 bg-[#51E5FF]/10 px-3 text-xs font-bold text-[#51E5FF]">
              <span className="truncate">{languageLabel || "Collection"}</span>
              <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-[#51E5FF]/70">
                Locked
              </span>
            </div>
          )}
        </FilterSection>
      </div>
    </div>
  );
};

export const FilterActions = ({ onReset, onClose, activeCount }) => (
  <div className="border-t border-white/10 bg-[#04152d] px-5 py-4">
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#51E5FF] px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#04152d] transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
      >
        Show {activeCount > 0 ? `${activeCount} filtered ` : ""}results
        <AiOutlineArrowRight size={14} aria-hidden="true" />
      </button>
    )}
    <button
      type="button"
      onClick={onReset}
      className={`flex min-h-[40px] w-full items-center justify-center border border-[#F4442E]/50 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F4442E] transition-colors hover:bg-[#F4442E] hover:text-white ${
        onClose ? "mt-2" : ""
      }`}
    >
      Reset all filters
    </button>
    {!onClose && (
      <p className="mt-3 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
        <span className="h-1.5 w-1.5 bg-[#51E5FF]" aria-hidden="true" />
        Applied instantly
      </p>
    )}
  </div>
);

export const FilterDrawer = ({ open, onClose, panelProps, label = "Movie filters" }) => {
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Dismiss filters overlay"
        onClick={onClose}
        className="filter-backdrop fixed inset-0 z-40 bg-[#04152d]/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="filter-drawer fixed inset-y-0 left-0 z-50 flex w-[min(92vw,390px)] flex-col border-r border-white/10 bg-[#04152d] shadow-2xl"
      >
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
          <FilterPanel {...panelProps} onClose={onClose} />
        </div>
        <FilterActions {...panelProps} onClose={onClose} />
      </div>
    </div>
  );
};
