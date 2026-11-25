import { Suspense } from "react";

import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

import { DiscoverHero } from "@/components/DiscoverShell";
import { COLLECTIONS, getCollection } from "@/config/collections";

import LoadingRing from "../LoadingRing";
import HeroFeatured from "./HeroFeatured";
import HeroStats from "./HeroStats";
import SpecialsClient from "./SpecialsClient";

const FeaturedFallback = () => (
  <div
    className="aspect-[16/10] animate-pulse border border-white/10 bg-[#0a1b31]"
    aria-hidden="true"
  />
);

const SpecialsComponent = ({ page }) => {
  const collection = getCollection(page);

  if (!collection) {
    return <LoadingRing label="collection-loading" />;
  }

  return (
    <div className="bg-[#04152d] text-white">
      <DiscoverHero
        breadcrumb={[
          {
            label: "Home",
            href: "/",
            icon: <AiOutlineArrowLeft size={14} aria-hidden="true" />,
          },
          { label: "Collections" },
          { label: collection.label, active: true },
        ]}
        eyebrow="Regional spotlight"
        title={collection.name}
        description={`A curated feed of ${collection.label} cinema — refine by genre, year, rating and more. Every view is shareable through the URL.`}
        featuredSlot={
          <Suspense fallback={<FeaturedFallback />}>
            <HeroFeatured page={page} />
          </Suspense>
        }
        statsSlot={
          <Suspense fallback={null}>
            <HeroStats page={page} />
          </Suspense>
        }
        titleSize="clamp(2rem, 4.6vw, 3.5rem)"
        gridClassName="lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        statsVariant="inline"
      />

      <nav className="sticky top-[92px] z-30 border-y border-white/10 bg-[#04152d]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12">
          {COLLECTIONS.map((item) => {
            const active = item.page === collection.page;
            return (
              <Link
                key={item.page}
                href={`/special/${item.page}`}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-[#51E5FF] bg-[#51E5FF] text-[#04152d]"
                    : "border-white/15 text-slate-300 hover:border-[#51E5FF] hover:text-[#51E5FF]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Suspense fallback={<LoadingRing label="collection-loading" />}>
        <SpecialsClient page={page} />
      </Suspense>
    </div>
  );
};

export default SpecialsComponent;
