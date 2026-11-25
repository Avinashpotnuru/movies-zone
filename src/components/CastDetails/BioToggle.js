"use client";

import { useState } from "react";

import { AiOutlineArrowRight } from "react-icons/ai";

const BioToggle = ({ biography }) => {
  const [expanded, setExpanded] = useState(false);

  if (!biography) return null;

  return (
    <div className="mt-6 max-w-2xl">
      <p
        className={`text-sm leading-relaxed text-slate-300 sm:text-base ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {biography}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#51E5FF] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
      >
        {expanded ? "Show less" : "Read full bio"}
        <AiOutlineArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
};

export default BioToggle;
