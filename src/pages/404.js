import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";

import Seo from "@/components/Seo";

const detours = [
  {
    number: "01",
    href: "/movies",
    label: "Movie library",
    meta: "Every list, filter and genre",
  },
  {
    number: "02",
    href: "/category/28",
    label: "Action collection",
    meta: "A curated genre detour",
  },
  {
    number: "03",
    href: "/special/hindi",
    label: "Regional specials",
    meta: "Hindi, Telugu, Tamil and more",
  },
  {
    number: "04",
    href: "/about",
    label: "About & FAQ",
    meta: "How Movies-Zone works",
  },
];

const NotFound = () => {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    router.push(`/search-movies/${encodeURIComponent(query)}`);
  };

  return (
    <>
      <Seo
        title="Page not found"
        description="That Movies-Zone page is not in the archive. Search the library or take a curated detour."
        path="/404"
        noindex
      />

      <section className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden border-b border-white/10 bg-[#04152d] sm:min-h-[calc(100vh-88px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[#51E5FF]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#F4442E]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
          <div className="hero-enter">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
              <span className="h-px w-8 bg-[#51E5FF]" aria-hidden="true" />
              Error 404
            </div>

            <h1 className="mt-6 font-extrabold leading-[0.78] tracking-[-0.07em] text-white tabular-nums text-[clamp(6.5rem,20vw,13rem)]">
              404
            </h1>

            <div className="mt-8 max-w-xl border-l-2 border-[#F4442E] pl-5">
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
                This scene is missing.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                The page you tried to open is not in the archive. It may have
                moved, or the link may be out of date. Search the library or
                take one of the detours below.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center gap-2 bg-[#51E5FF] px-5 text-xs font-black uppercase tracking-[0.16em] text-[#04152d] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
              >
                <AiOutlineArrowLeft size={16} aria-hidden="true" />
                Back home
              </Link>
              <Link
                href="/movies"
                className="inline-flex min-h-[48px] items-center gap-2 border border-white/20 px-5 text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
              >
                Browse movies
                <AiOutlineArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="border border-white/10 bg-[#0a1b31]/80 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
                Find your way
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Search / Detours
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              role="search"
              className="mt-5 flex min-h-[52px] items-center border border-white/15 bg-[#04152d] transition-colors focus-within:border-[#51E5FF]"
            >
              <AiOutlineSearch
                size={18}
                aria-hidden="true"
                className="ml-4 shrink-0 text-slate-500"
              />
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                aria-label="Search Movies-Zone"
                placeholder="Search a title, person, genre…"
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                aria-label="Search"
                className="mr-1.5 flex h-10 w-10 shrink-0 items-center justify-center bg-[#F4442E] text-white transition-colors hover:bg-[#ff5c45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
              >
                <AiOutlineArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {detours.map(({ number, href, label, meta }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex min-h-[92px] items-center gap-3 bg-[#04152d] px-4 py-3 transition-colors hover:bg-[#0d2340] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#51E5FF]"
                >
                  <span className="font-extrabold leading-none tracking-[-0.04em] text-[#51E5FF] tabular-nums text-sm">
                    {number}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-white">
                      {label}
                    </span>
                    <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      {meta}
                    </span>
                  </span>
                  <AiOutlineArrowRight
                    size={14}
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-[#51E5FF]"
                  />
                </Link>
              ))}
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
              Tip: every filter, sort option and page on Movies-Zone lives in
              the URL. Copy an address from a friend to land on the same view.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
