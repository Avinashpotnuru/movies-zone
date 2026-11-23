import Seo from "@/components/Seo";
import Movies from "@/components/Movies";

export default function Home() {
  return (
    <>
      <Seo
        title="Discover movies, genres & hidden gems"
        description="Browse trending films, explore genres, and build a watchlist on Movies-Zone."
        path="/"
      />
      <Movies />
    </>
  );
}
