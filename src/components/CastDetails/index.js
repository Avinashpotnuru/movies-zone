import { Suspense } from "react";

import LoadingRing from "../LoadingRing";
import BioButton from "./BioButton";
import BioModal from "./BioModal";
import BioToggle from "./BioToggle";
import CastDetailsClient from "./CastDetailsClient";
import CastDetailsHero from "./Hero";
import HeroStats from "./HeroStats";

const CastDetails = ({ id, meta }) => {
  const name = meta?.name || "Unknown";
  const biography = meta?.biography || "";
  const profilePath = meta?.profile_path || "";

  return (
    <div className="bg-[#04152d] text-white">
      <CastDetailsHero
        id={id}
        meta={meta}
        bioSlot={
          <BioButton
            name={name}
            biography={biography}
            profilePath={profilePath}
          />
        }
        bioToggleSlot={<BioToggle biography={biography} />}
        statsSlot={
          <Suspense fallback={null}>
            <HeroStats id={id} meta={meta} />
          </Suspense>
        }
      />

      <BioModal />

      <Suspense fallback={<LoadingRing label="cast-loading" />}>
        <CastDetailsClient id={id} />
      </Suspense>
    </div>
  );
};

export default CastDetails;
