"use client";

import { AiOutlineArrowRight } from "react-icons/ai";

const BioButton = ({ name, biography, profilePath }) => {
  if (!biography) return null;

  const openBio = () => {
    window.dispatchEvent(
      new CustomEvent("movies-zone:show-bio", {
        detail: { name, biography, profilePath },
      })
    );
  };

  return (
    <button
      type="button"
      onClick={openBio}
      className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#51E5FF] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
    >
      Read full bio
      <AiOutlineArrowRight size={14} aria-hidden="true" />
    </button>
  );
};

export default BioButton;
