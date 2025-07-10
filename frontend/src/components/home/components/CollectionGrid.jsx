import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import CollectionCard from "./CollectionCard";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetCollectionsQuery } from "@/redux/api/collectionApi";
import { useGetLotteriesQuery } from "@/redux/api/lotteryApi";

const CollectionGrid = ({
  title = "Browse by Collection",
  limit = 8,
  showViewAll = false,
}) => {
  const navigate = useNavigate();
  const { data: collectionsData, isLoading, error } = useGetCollectionsQuery();
  const { data: lotteriesData } = useGetLotteriesQuery();
  const collections = collectionsData?.collections || [];
  const lotteries = lotteriesData?.lotteries || [];

  // Map collectionId to set count
  const setCounts = {};
  lotteries.forEach((lottery) => {
    const colId = lottery.collection?._id;
    if (colId) setCounts[colId] = (setCounts[colId] || 0) + 1;
  });

  const limitedCollections = limit ? collections.slice(0, limit) : collections;
  const hasMore = limit && collections.length > limit;

  if (isLoading) {
    return (
      <section className="py-10 px-5">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing LEGO® sets organized by your favorite themes and
          collections
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-80 rounded-2xl"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-5">
        <FallbackStates
          icon={Package}
          title="Error Loading Collections"
          description="Failed to load collections. Please try again later."
          className="min-h-[300px]"
        />
      </section>
    );
  }

  if (!collections.length) {
    return null;
  }

  return (
    <section className="py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Discover amazing LEGO® sets organized by your favorite themes and
        collections
      </p>
      <div className="flex justify-end mb-5">
        {showViewAll && hasMore && (
          <Button
            variant="link"
            className="gap-1 inline-flex items-center [&_svg:not([class*='size-'])]:size-4 hover:text-accent hover:no-underline"
            onClick={() => navigate("/collections")}
          >
            View All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {limitedCollections.map((collection) => (
          <CollectionCard
            key={collection._id}
            collection={collection}
            setCount={setCounts[collection._id] || 0}
            onClick={() => navigate(`/collections/${collection._id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default CollectionGrid;
