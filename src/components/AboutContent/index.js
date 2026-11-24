import Link from "next/link";

import { useState } from "react";
import { AiOutlineArrowRight, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import { ABOUT_FAQS, ABOUT_PILLARS, ABOUT_STATS } from "@/config/about";

const Eyebrow = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#51E5FF]">
    {children}
  </p>
);

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

const AboutContent = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-[#04152d] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#04152d]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-6rem] top-[-7rem] h-72 w-72 rounded-full bg-[#F4442E]/10 blur-[110px]"
        />

        <div className="relative mx-auto max-w-[1400px] px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-12 lg:px-12 lg:pb-20 lg:pt-16">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#51E5FF]" />
                <Eyebrow>About / 001</Eyebrow>
              </div>

              <h1 className="mt-8 max-w-4xl text-[clamp(2.4rem,6vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
                A better way to find{" "}
                <span className="text-[#51E5FF]">your next film.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Movies-Zone is a focused corner of the internet for people who
                would rather be watching something than scrolling through
                endless lists.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/movies"
                  className="inline-flex min-h-[50px] items-center gap-2 bg-[#51E5FF] px-6 text-sm font-bold text-[#04152d] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
                >
                  Explore the library
                  <AiOutlineArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href="#faq"
                  className="inline-flex min-h-[50px] items-center gap-2 border border-white/25 px-6 text-sm font-semibold text-white transition duration-200 ease-out hover:border-[#51E5FF] hover:text-[#51E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51E5FF]"
                >
                  Read the FAQ
                </a>
              </div>
            </div>

            <aside className="border-l border-white/15 pl-6 sm:pl-8 lg:mb-2">
              <Eyebrow>Our premise</Eyebrow>
              <p className="mt-4 text-lg font-semibold leading-snug text-white sm:text-xl">
                Great cinema should be easy to discover, easy to share, and easy
                to come back to.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                We built the tools we wanted: real filters, regional collections,
                inline trailers and a watchlist you can reach from any page.
              </p>
              <p className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span className="h-1.5 w-1.5 bg-[#F4442E]" />
                Independent · Ad-free · Movie-first
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#061a31]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:gap-16">
            <div>
              <Eyebrow>Why we exist</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Less browsing.
                <br />
                Better watching.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="max-w-2xl text-base leading-relaxed text-slate-300">
                Most movie sites are built to keep you scrolling. Movies-Zone is
                built to get you out of the menu and into the film. Search is
                quick, filters are honest, and every result is one click from
                the details, the trailer and the artwork.
              </p>

              <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
                {ABOUT_PILLARS.map((pillar) => (
                  <div
                    key={pillar.number}
                    className="border-t border-white/15 pt-5"
                  >
                    <span className="text-[11px] font-bold tabular-nums text-[#51E5FF]">
                      {pillar.number}
                    </span>
                    <h3 className="mt-4 text-base font-extrabold leading-snug text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {pillar.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#04152d]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 px-5 sm:grid-cols-4 sm:px-8 lg:px-12">
          {ABOUT_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`border-white/10 py-8 sm:py-10 ${
                index ? "sm:border-l sm:pl-6" : "sm:pl-0"
              } ${index % 2 ? "border-l pl-4 sm:pl-6" : "pl-0"}`}
            >
              <p className="text-2xl font-black tracking-tight text-[#51E5FF] tabular-nums sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#0a1b31]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>Questions / 002</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                The useful
                <br />
                small print.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
                Short answers to the things people ask most. If something is
                missing, the GitHub link in the footer is the fastest way to
                ask.
              </p>
            </div>

            <div className="border-t border-white/15">
              {ABOUT_FAQS.map((item, index) => (
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
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#04152d]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div>
            <Eyebrow>Ready when you are</Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              There is something good waiting.
            </h2>
          </div>
          <Link
            href="/movies"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 bg-[#F4442E] px-7 text-sm font-bold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-[#04152d] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4442E]"
          >
            Open the library
            <AiOutlineArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutContent;
