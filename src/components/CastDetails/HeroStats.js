"use client";

import { useGetCastFullDetailsQuery } from "@/store/api/restApis";

import Stat from "./Stat";

const GENDER_LABELS = { 1: "Female", 2: "Male", 3: "Non-binary" };

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getAge = (birthday, deathday) => {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) return null;

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

const HeroStats = ({ id, meta }) => {
  const { data } = useGetCastFullDetailsQuery({ id }, { skip: !id });

  const birthday = data?.birthday || meta?.birthday;
  const deathday = data?.deathday || meta?.deathday;
  const age = getAge(birthday, deathday);
  const credits =
    (data?.combined_credits?.cast?.length ?? 0) +
    (data?.combined_credits?.crew?.length ?? 0);
  const popularity = data?.popularity ?? meta?.popularity ?? 0;
  const gender = data?.gender ?? meta?.gender;

  return (
    <>
      <Stat
        label="Known for"
        value={data?.known_for_department || meta?.known_for_department || "—"}
      />
      <Stat label="Born" value={formatDate(birthday)} />
      <Stat
        label={deathday ? "Died" : "Age"}
        value={
          deathday
            ? formatDate(deathday)
            : age !== null
            ? `${age} yrs`
            : "—"
        }
      />
      <Stat
        label="Birthplace"
        value={data?.place_of_birth || meta?.place_of_birth || "—"}
      />
      <Stat label="Gender" value={GENDER_LABELS[gender] || "—"} />
      <Stat label="Popularity" value={Math.round(popularity).toLocaleString()} />
      <Stat
        label="Credits"
        value={String(credits).padStart(2, "0")}
        accent
      />
    </>
  );
};

export default HeroStats;
