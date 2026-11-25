"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";

const NotFoundSearch = () => {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    router.push(`/search-movies/${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mt-5 flex min-h-[52px] items-center border border-white/15 bg-[#04152d] transition-colors focus-within:border-[#51E5FF]"
    >
      <AiOutlineSearch
        size={18}
        aria-hidden="true"
        className="ml-4 shrink-0 text-slate-500"
      />
      <input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        aria-label="Search Movies-Zone"
        placeholder="Search a title, person, genre…"
        className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600"
      />
      <button
        type="submit"
        aria-label="Search"
        className="mr-1.5 flex h-10 w-10 shrink-0 items-center justify-center bg-[#F4442E] text-white transition-colors hover:bg-[#ff5c45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#51E5FF]"
      >
        <AiOutlineArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
};

export default NotFoundSearch;
