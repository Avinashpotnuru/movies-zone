import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";

import { imagePath } from "@/utilities";

const getInitials = (name) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "";

const CastCard = ({
  person,
  role,
  name,
  character,
  profile_path,
  job,
  crew_name,
  id,
  index,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const data = person ?? { name, character, profile_path, job, id };
  const personId = data?.id ?? id;
  const displayName = data?.name?.trim() || "Unknown name";
  const displayRole = crew_name
    ? data?.job || job || "Crew"
    : role || data?.character || character || "Cast";

  const hasProfile =
    personId !== undefined &&
    personId !== null &&
    Number.isFinite(Number(personId)) &&
    Number(personId) > 0;

  const showImage = Boolean(data?.profile_path) && !imageFailed;
  const initials = getInitials(data?.name);

  const Wrapper = hasProfile ? Link : "div";
  const wrapperProps = hasProfile ? { href: `/cast/${personId}` } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group block w-[140px] shrink-0 sm:w-[160px] ${
        hasProfile ? "" : "cursor-default"
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[#0a1b31] transition-colors duration-300 group-hover:border-[#51E5FF]/60">
        {showImage ? (
          <Image
            src={`${imagePath}${data.profile_path}`}
            alt={displayName === "Unknown name" ? "" : `${displayName} profile`}
            fill
            sizes="(max-width: 640px) 140px, 160px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0a1b31] via-[#04152d] to-[#123a52] px-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              {initials ? (
                <span className="text-base font-black text-slate-300">
                  {initials}
                </span>
              ) : (
                <AiOutlineUser size={22} aria-hidden="true" className="text-slate-500" />
              )}
            </span>
            {!hasProfile && (
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Profile unavailable
              </span>
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/10 to-transparent" aria-hidden="true" />

        {typeof index === "number" && (
          <span className="absolute left-2 top-2 border border-white/20 bg-[#04152d]/85 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.14em] text-[#F4442E] tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p
            title={displayName}
            className="truncate text-xs font-bold text-white transition-colors group-hover:text-[#51E5FF]"
          >
            {displayName}
          </p>
          <p title={displayRole} className="mt-0.5 truncate text-[10px] text-slate-400">
            {displayRole}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#51E5FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {hasProfile ? (
              <>
                View profile
                <AiOutlineArrowRight size={10} aria-hidden="true" />
              </>
            ) : (
              "No profile linked"
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CastCard;
