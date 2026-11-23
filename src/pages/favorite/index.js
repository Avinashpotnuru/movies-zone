import Seo from "@/components/Seo";
import Favorites from "@/components/Favorites";

const FavoritePage = () => {
  return (
    <>
      <Seo
        title="Your favorites"
        description="Your personal watchlist of saved movies on Movies-Zone."
        path="/favorite"
        noindex
      />
      <Favorites />
    </>
  );
};

export default FavoritePage;
