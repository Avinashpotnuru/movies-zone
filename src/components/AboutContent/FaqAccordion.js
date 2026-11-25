"use client";

import { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const FaqItem = ({ item, index, open, onToggle }) => (
  <div className="border-b border-white/15">
    <h3>
      <button
        type="button"
        id={`faq-trigger-${index}`}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="group flex min-h-[64px] w-full items-start gap-3 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#51E5FF] sm:items-center sm:gap-4"
      >
        <span className="mt-1 text-[11px] font-bold tabular-nums text-[#51E5FF]/70 sm:mt-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-[15px] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#51E5FF] sm:text-lg">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-colors duration-200 sm:mt-0 ${
            open
              ? "border-[#51E5FF] text-[#51E5FF]"
              : "border-white/20 text-slate-400 group-hover:border-white/50"
          }`}
        >
          {open ? <AiOutlineMinus size={15} /> : <AiOutlinePlus size={15} />}
        </span>
      </button>
    </h3>
    <div
      id={`faq-panel-${index}`}
      role="region"
      aria-labelledby={`faq-trigger-${index}`}
      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <p className="max-w-2xl pb-6 pl-8 pr-2 text-sm leading-relaxed text-slate-400 sm:pl-10">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

const FaqAccordion = ({ items = [] }) => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="border-t border-white/15">
      {items.map((item, index) => (
        <FaqItem
          key={item.question}
          item={item}
          index={index}
          open={openFaq === index}
          onToggle={() =>
            setOpenFaq((current) => (current === index ? -1 : index))
          }
        />
      ))}
    </div>
  );
};

export default FaqAccordion;
