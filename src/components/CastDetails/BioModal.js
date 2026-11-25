"use client";

import Image from "next/image";

import { useCallback, useEffect, useState } from "react";

import { AiOutlineClose } from "react-icons/ai";

import { imagePath } from "@/utilities";

const BioModal = () => {
  const [detail, setDetail] = useState(null);
  const close = useCallback(() => setDetail(null), []);

  useEffect(() => {
    const onShow = (event) => setDetail(event.detail ?? null);
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("movies-zone:show-bio", onShow);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("movies-zone:show-bio", onShow);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  useEffect(() => {
    if (!detail) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [detail]);

  if (!detail) return null;

  const profileSrc = detail.profilePath
    ? `${imagePath}${detail.profilePath}`
    : "/noimage.png";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020a16]/95 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cast-bio-title"
      onClick={close}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-white/15 bg-[#04152d] p-5 shadow-2xl shadow-black/60 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close biography"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-[#04152d]/85 text-white transition-colors hover:border-[#51E5FF] hover:text-[#51E5FF]"
        >
          <AiOutlineClose size={18} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-4 pr-12">
          <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden border border-white/20 bg-[#0a1b31] sm:w-20">
            <Image
              src={profileSrc}
              alt=""
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#51E5FF]">
              Biography
            </p>
            <h2
              id="cast-bio-title"
              className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            >
              {detail.name || "Unknown"}
            </h2>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300 sm:text-base">
            {detail.biography}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BioModal;
