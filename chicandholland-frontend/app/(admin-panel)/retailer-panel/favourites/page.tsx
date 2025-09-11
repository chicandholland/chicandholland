import { ContentLayout } from "@/components/custom/admin-panel/contentLayout";
import ProductCard from "@/components/custom/ProductCard";
import { getFavourites } from "@/lib/data";
import { cookies } from "next/headers";
import ActionButtons from "./ActionButtons";
import Data from "./Data";

const Favourites = async () => {
  const retailerId = (await cookies()).get("retailerId")?.value;

  const favourites = await getFavourites(Number(retailerId));

  

  return (
    <ContentLayout title="Favourites">
      <Data favourites={favourites} retailerId={retailerId} />
    </ContentLayout>
  );
};

export default Favourites;
