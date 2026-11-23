import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const pad = (value) => String(value ?? 0).padStart(2, "0");

const getPageItems = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items = [1];

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  if (start > 2) items.push("start-gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("end-gap");

  items.push(total);

  return items;
};

const Pagination = ({ pages, current, onChange }) => {
  const total = Math.max(1, Number(pages) || 1);
  const active = Math.min(Math.max(Number(current) || 1, 1), total);

  if (total <= 1) return null;

  const pageItems = getPageItems(active, total);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 border border-white/10 bg-[#061a31]"
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-[3px] bg-[#F4442E]" aria-hidden="true" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Page
            </p>
            <p className="mt-1 text-lg font-black leading-none text-white tabular-nums">
              {pad(active)}
              <span className="mx-1 text-slate-700">/</span>
              <span className="text-slate-500">{pad(total)}</span>
            </p>
          </div>
        </div>

        <div className="no-scrollbar flex min-w-0 flex-1 items-center justify-start gap-1.5 overflow-x-auto sm:justify-center">
          {pageItems.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === active ? "page" : undefined}
                aria-label={`Go to page ${item}`}
                className={`flex h-11 w-11 shrink-0 items-center justify-center border text-sm font-bold tabular-nums transition-colors duration-300 ${
                  item === active
                    ? "border-[#F4442E] bg-[#F4442E] text-[#04152d]"
                    : "border-white/10 text-slate-400 hover:border-[#51E5FF]/60 hover:text-white"
                }`}
              >
                {pad(item)}
              </button>
            ) : (
              <span
                key={item}
                aria-hidden="true"
                className="flex h-11 w-5 shrink-0 items-center justify-center text-[10px] font-bold tracking-[0.2em] text-slate-700"
              >
                •••
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(active - 1)}
            disabled={active <= 1}
            aria-label="Previous page"
            className="group flex h-11 items-center gap-2 border border-white/15 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors duration-300 hover:border-[#51E5FF]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <AiOutlineLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            type="button"
            onClick={() => onChange(active + 1)}
            disabled={active >= total}
            aria-label="Next page"
            className="group flex h-11 items-center gap-2 border border-white/15 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors duration-300 hover:border-[#51E5FF]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="hidden sm:inline">Next</span>
            <AiOutlineRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <div className="h-[3px] bg-white/5" aria-hidden="true">
        <div
          className="h-full w-full origin-left bg-[#F4442E] transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${active / total})` }}
        />
      </div>
    </nav>
  );
};

export default Pagination;
