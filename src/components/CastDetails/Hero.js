import Image from "next/image";
import Link from "next/link";

import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

import { imagePath } from "@/utilities";

const CastDetailsHero = ({ id, meta, bioSlot, bioToggleSlot, statsSlot }) => {
  const name = meta?.name || "Unknown";
  const profileSrc = meta?.profile_path
    ? `${imagePath}${meta.profile_path}`
    : "/noimage.png";
  const department = meta?.known_for_department || "Cast";
  const aliases = (meta?.also_known_as ?? [])
    .filter((item) => item && item !== name)
    .slice(0, 6);

  const socialLinks = [
    {
      label: "Instagram",
      href: meta?.external_ids?.instagram_id
        ? `https://www.instagram.com/${meta.external_ids.instagram_id}/`
        : null,
      Icon: BsInstagram,
    },
    {
      label: "Facebook",
      href: meta?.external_ids?.facebook_id
        ? `https://www.facebook.com/${meta.external_ids.facebook_id}`
        : null,
      Icon: BsFacebook,
    },
    {
      label: "Twitter",
      href: meta?.external_ids?.twitter_id
        ? `https://twitter.com/${meta.external_ids.twitter_id}`
        : null,
      Icon: BsTwitter,
    },
  ].filter((item) => item.href);

  const externalLinks = [
    meta?.external_ids?.imdb_id && {
      label: "IMDb",
      href: `https://www.imdb.com/name/${meta.external_ids.imdb_id}/`,
    },
    meta?.external_ids?.wikidata_id && {
      label: "Wikidata",
      href: `https://www.wikidata.org/wiki/${meta.external_ids.wikidata_id}`,
    },
    meta?.external_ids?.youtube_id && {
      label: "YouTube",
      href: `https://www.youtube.com/channel/${meta.external_ids.youtube_id}`,
    },
    meta?.external_ids?.tiktok_id && {
      label: "TikTok",
      href: `https://www.tiktok.com/@${meta.external_ids.tiktok_id}`,
    },
    meta?.homepage && { label: "Website", href: meta.homepage },
    { label: "TMDB", href: `https://www.themoviedb.org/person/${id}` },
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {meta?.profile_path && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={`${imagePath}${meta.profile_path}`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover object-top opacity-10 blur-2xl"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[#04152d]/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-12 pt-10 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#51E5FF]"
          >
            <AiOutlineArrowLeft size={14} aria-hidden="true" />
            Back
          </Link>
          <span className="text-white/20">/</span>
          <span>Cast</span>
          <span className="text-white/20">/</span>
          <span className="truncate text-[#51E5FF]">{name}</span>
        </div>

        <div className="mt-7 sm:mt-8">
          <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-3 sm:hidden">
            <div className="relative aspect-[3/4] w-[88px] shrink-0 overflow-hidden border border-white/20 bg-[#0a1b31] shadow-2xl shadow-black/50">
              <Image
                src={profileSrc}
                alt={meta?.name ? `${meta.name} profile` : "Profile"}
                fill
                priority
                sizes="88px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-0 left-0 bg-[#F4442E] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white">
                Profile
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
                {department} · Filmography
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <h1 className="w-full text-[clamp(1.75rem,7vw,2.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
                  {name}
                </h1>
                {aliases.length > 0 &&
                  aliases.map((alias) => (
                    <span
                      key={alias}
                      title="Also known as"
                      aria-label={`Also known as ${alias}`}
                      className="border border-white/15 px-2.5 py-1 text-[11px] font-normal leading-none text-slate-400"
                    >
                      {alias}
                    </span>
                  ))}
              </div>
            </div>

            <div className="col-span-2 mt-3 min-w-0">
              {meta?.biography && (
                <div className="mt-3 max-w-2xl">
                  <p className="line-clamp-3 text-[13px] leading-relaxed text-slate-300">
                    {meta.biography}
                  </p>
                  {bioSlot}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-11 w-full items-center justify-center border border-white/20 text-slate-300 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {externalLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 border border-white/15 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
                  >
                    {label}
                    <AiOutlineArrowRight size={12} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-9 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-end lg:gap-12">
            <div className="relative aspect-[3/4] overflow-hidden border border-white/20 bg-[#0a1b31] shadow-2xl shadow-black/50">
              <Image
                src={profileSrc}
                alt={meta?.name ? `${meta.name} profile` : "Profile"}
                fill
                priority
                sizes="(max-width: 1024px) 180px, 300px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-0 left-0 bg-[#F4442E] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white">
                Profile
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#51E5FF]">
                {department} · Filmography
              </p>
              <h1
                className="mt-4 font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.75rem)" }}
              >
                {name}
              </h1>

              {aliases.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {aliases.map((alias) => (
                    <span
                      key={alias}
                      className="border border-white/15 px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              )}

              {bioToggleSlot}

              {socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center border border-white/20 text-slate-300 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {externalLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-2 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
                  >
                    {label}
                    <AiOutlineArrowRight size={12} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {statsSlot ? (
          <div className="mt-10 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-4 lg:grid-cols-7">
            {statsSlot}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CastDetailsHero;
