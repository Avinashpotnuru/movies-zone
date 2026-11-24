import dynamic from "next/dynamic";

import ApiProvider from "@/components/ApiProvider";
import LoadingRing from "@/components/LoadingRing";
import Seo from "@/components/Seo";

const Favorites = dynamic(() => import("@/components/Favorites"), {
  ssr: false,
  loading: () => <LoadingRing label="favorites-loading" />,
});

const FavoritePage = () => {
  return (
    <>
      <Seo
        title="Your favorites"
        description="Your personal watchlist of saved movies on Movies-Zone."
        path="/favorite"
        noindex
      />
      <ApiProvider>
        <Favorites />
      </ApiProvider>
    </>
  );
};

export default FavoritePage;
