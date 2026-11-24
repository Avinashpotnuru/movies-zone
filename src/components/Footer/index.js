import Image from "next/image";
import Link from "next/link";

import { AiOutlineArrowRight } from "react-icons/ai";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";

import { COLLECTION_LINKS } from "@/config/collections";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Science Fiction" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Avinashpotnuru",
    Icon: BsGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/avinash-potnuru/",
    Icon: BsLinkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/potnuru_avinash/",
    Icon: BsInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/avinash.potnuru.18",
    Icon: BsFacebook,
  },
];

const linkClasses =
  "group inline-flex min-h-[44px] w-full items-center justify-between gap-2 py-2 text-[13px] text-slate-400 transition-colors duration-200 hover:text-[#51E5FF] sm:min-h-0 sm:w-auto sm:gap-3 sm:text-sm";

const LinkArrow = () => (
  <AiOutlineArrowRight
    size={14}
    aria-hidden="true"
    className="-translate-x-1 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
  />
);

const FooterLink = ({ href, children, external }) =>
  external ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={linkClasses}
    >
      {children}
      <LinkArrow />
    </a>
  ) : (
    <Link href={href} className={linkClasses}>
      {children}
      <LinkArrow />
    </Link>
  );

const FooterHeading = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
    {children}
  </p>
);

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a1b31] text-white">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#51E5FF]/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap text-[17vw] font-black leading-none text-white/[0.025] sm:block"
        aria-hidden="true"
      >
        MOVIES ZONE
      </span>

      <div className="relative mx-auto max-w-[1400px] px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pt-12">
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden border border-white/15 bg-[#04152d] sm:h-10 sm:w-10">
                <Image
                  src="/moviesZoneLogo.png"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </span>
              <span className="text-xl font-black uppercase leading-none tracking-[-0.03em] sm:text-lg">
                Movies<span className="text-[#51E5FF]">Zone</span>
              </span>
            </Link>

            <span
              className="mt-4 block h-0.5 w-10 bg-[#51E5FF] sm:hidden"
              aria-hidden="true"
            />

            <p className="mt-4 line-clamp-1 max-w-xs text-[13px] leading-relaxed text-slate-400 sm:mt-6 sm:line-clamp-none sm:text-sm">
              A curated corner for the films worth your time. Discover what’s
              trending, explore by genre, and save the ones you love.
            </p>

            <Link
              href="/movies"
              className="mt-5 inline-flex min-h-[46px] items-center gap-2 bg-[#51E5FF] px-5 text-sm font-bold text-[#04152d] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF] sm:mt-7"
            >
              Explore the collection
              <AiOutlineArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div>
            <FooterHeading>Discover</FooterHeading>
            <div className="mt-4 flex flex-col items-start sm:mt-5">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/movies">All movies</FooterLink>
              <FooterLink href="/about">About &amp; FAQ</FooterLink>
              <FooterLink href="/favorite">My favorites</FooterLink>
              <FooterLink href="/special/hindi">Regional picks</FooterLink>
            </div>
          </div>

          <div>
            <FooterHeading>Genres</FooterHeading>
            <div className="mt-4 flex flex-col items-start sm:mt-5">
              {genres.length ? (
                genres.map((genre) => (
                  <FooterLink key={genre.id} href={`/category/${genre.id}`}>
                    {genre.name}
                  </FooterLink>
                ))
              ) : (
                Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={`genre-skeleton-${index}`}
                    className="mt-2 h-3 w-24 animate-pulse bg-white/10"
                    aria-hidden="true"
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>Connect</FooterHeading>
            <p className="mt-4 line-clamp-2 max-w-md text-[13px] leading-relaxed text-slate-400 sm:mt-5 sm:line-clamp-none sm:max-w-none sm:text-sm">
              Follow along for new releases, hidden gems and the stories behind
              the films.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-5 sm:justify-start">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-white/15 text-slate-300 transition-colors duration-200 hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF] sm:h-10 sm:w-10"
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0">
              {COLLECTION_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[36px] shrink-0 items-center border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:border-[#F4442E]/50 hover:text-[#F4442E] sm:min-h-0 sm:px-2.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 py-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Movies-Zone. Built by{" "}
            <a
              href="https://avinashpotnuruportfolio.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-300 underline decoration-white/20 underline-offset-2 transition-colors hover:text-[#51E5FF] hover:decoration-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
            >
              Avinash Potnuru
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span>Movie data by TMDB</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#F4442E]" />
            <span>Made for movie people</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
