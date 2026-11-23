import Image from "next/image";
import Link from "next/link";

import { imagePath } from "@/utilities";

const SearchTabComponent = ({
  title,
  poster_path,
  release_date,
  id,
  onSelect,
}) => {
  return (
    <Link
      href={`/movies/${id}`}
      onClick={onSelect}
      className="group flex items-center gap-3 border-b border-white/10 px-4 py-2.5 transition-colors duration-200 hover:bg-white/5"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden bg-[#04152d]">
        <Image
          src={poster_path ? `${imagePath}${poster_path}` : "/noimage.png"}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#51E5FF]">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-slate-300 tabular-nums">
          {release_date?.slice(0, 4) ?? "—"}
        </p>
      </div>
    </Link>
  );
};

export default SearchTabComponent;
