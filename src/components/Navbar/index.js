"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

import {
  AiOutlineArrowRight,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineFavorite } from "react-icons/md";

import { COLLECTION_LINKS } from "@/config/collections";
import { POPULAR_GENRES } from "@/config/genres";

import OutsideClickHandlerWrapper from "../OutsideClickHandlerWrapper";

const SearchOverlay = dynamic(() => import("../SearchOverlay"), {
  ssr: false,
});

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
            href="/movies"
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
  const router = useRouter();
  const path = usePathname();

  const [navOpen, setNavOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [specialsOpen, setSpecialsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categoryLinks = POPULAR_GENRES.map((genre) => ({
    id: genre.id,
    label: genre.name,
    href: `/category/${genre.id}`,
  }));
  const specialLinks = COLLECTION_LINKS.map((item) => ({
    id: item.href,
    label: `${item.label} movies`,
    href: item.href,
  }));

  const closeAll = useCallback(() => {
    setNavOpen(false);
    setCategoriesOpen(false);
    setSpecialsOpen(false);
    setSearchOpen(false);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Start navigation before closing so the mobile panel never unmounts its
  // links mid-click. The path effect is a fallback close after routing.
  const navigateAndClose = useCallback(
    (href) => {
      router.push(href);
      closeAll();
    },
    [router, closeAll]
  );

  const openSearch = useCallback(() => {
    setNavOpen(false);
    setCategoriesOpen(false);
    setSpecialsOpen(false);
    setSearchOpen(true);
  }, []);

  useEffect(() => {
    closeAll();
  }, [path, closeAll]);

  useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

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

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 p-3 sm:p-4">
        <header className="pointer-events-auto mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-5 border border-white/10 bg-[#04152d]/95 px-4 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:h-[72px] sm:px-6">
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

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
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
            <Link
              href="/about"
              onClick={closeAll}
              className={`group relative flex h-11 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] ${
                path === "/about" ? "text-[#51E5FF]" : "text-white"
              }`}
            >
              <span className="text-[10px] font-semibold text-[#51E5FF]/60 tabular-nums">
                04
              </span>
              About
              <span
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#51E5FF] transition-transform duration-300 ${
                  path === "/about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              aria-keyshortcuts="Meta+K Control+K"
              className="group flex h-10 w-10 items-center justify-center border border-white/15 bg-white/[0.03] text-slate-300 transition-colors duration-200 hover:border-[#51E5FF]/60 hover:bg-[#51E5FF]/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] lg:h-11 lg:w-[180px] lg:justify-start lg:gap-2.5 lg:px-3 xl:w-[240px]"
            >
              <AiOutlineSearch
                size={18}
                aria-hidden="true"
                className="shrink-0 text-[#51E5FF] transition-transform duration-200 group-hover:scale-110"
              />
              <span className="hidden flex-1 text-left text-sm text-slate-400 lg:inline">
                Search movies…
              </span>
              <kbd className="hidden border border-white/15 bg-[#04152d] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 xl:inline">
                ⌘ K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setNavOpen((prev) => !prev)}
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

      </div>

      {navOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-[#04152d]/60 backdrop-blur-[2px] lg:hidden"
            onClick={closeAll}
            aria-hidden="true"
          />
          <div
            data-outside-click-ignore=""
            className="fixed inset-x-0 top-[84px] z-40 px-3 sm:top-[96px] sm:px-4 lg:hidden"
          >
            <div
              role="dialog"
              aria-label="Mobile navigation"
              className="nav-enter mx-auto max-h-[calc(100vh-100px)] max-w-[1400px] overflow-y-auto overscroll-contain border border-white/10 bg-[#04152d] px-5 py-5 shadow-2xl"
            >
              <button
                type="button"
                onClick={openSearch}
                className="flex h-12 w-full items-center gap-3 border border-white/15 bg-white/[0.04] px-4 text-left text-sm text-slate-400 transition-colors hover:border-[#51E5FF]/60 hover:bg-[#51E5FF]/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
              >
                <AiOutlineSearch size={18} aria-hidden="true" className="shrink-0 text-[#51E5FF]" />
                <span className="flex-1">Search movies…</span>
                <kbd className="border border-white/15 bg-[#04152d] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  ⌘ K
                </kbd>
              </button>

              <div className="mt-4 space-y-1">
                <Link
                  href="/favorite"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateAndClose("/favorite");
                  }}
                  className="flex min-h-[44px] items-center justify-between border-b border-white/10 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-[#51E5FF]"
                >
                  <span className="flex items-center gap-2">
                    <MdOutlineFavorite size={17} aria-hidden="true" />
                    Favorites
                  </span>
                  <span className="text-[10px] text-[#51E5FF]/60 tabular-nums">
                    03
                  </span>
                </Link>

                <Link
                  href="/about"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateAndClose("/about");
                  }}
                  className="flex min-h-[44px] items-center justify-between border-b border-white/10 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-[#51E5FF]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-[#51E5FF]/60 tabular-nums">
                      04
                    </span>
                    About &amp; FAQ
                  </span>
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
                            onClick={(event) => {
                              event.preventDefault();
                              navigateAndClose(link.href);
                            }}
                            className="flex min-h-[44px] items-center px-3 text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-[#51E5FF]"
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
        </>
      )}

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
};

export default Navbar;
