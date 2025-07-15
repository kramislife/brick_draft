import React from "react";
import { useParams } from "react-router-dom";
import { Package } from "lucide-react";
import LotteryCard from "@/components/home/components/LotteryCard";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetLotteriesQuery } from "@/redux/api/lotteryApi";
import { useGetCollectionsQuery } from "@/redux/api/collectionApi";

const CollectionDetails = () => {
  const { id } = useParams();
  const { data: lotteriesData, isLoading: isLoadingLotteries } =
    useGetLotteriesQuery();
  const { data: collectionsData, isLoading: isLoadingCollections } =
    useGetCollectionsQuery();

  const collection = collectionsData?.collections?.find((c) => c._id === id);
  const lotteries = (lotteriesData?.lotteries || []).filter(
    (lottery) => lottery.collection?._id === id
  );

  if (isLoadingLotteries || isLoadingCollections) {
    return <div className="p-5">Loading...</div>;
  }

  if (!collection) {
    return (
      <div className="p-5">
        <FallbackStates
          icon={Package}
          title="Collection Not Found"
          description="The collection you're looking for doesn't exist."
          className="min-h-[300px]"
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-8">{collection.name}</h1>
      {lotteries.length === 0 ? (
        <FallbackStates
          icon={Package}
          title="No Lotteries in this Collection"
          description="Check back later for new sets in this collection."
          className="min-h-[300px]"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {lotteries.map((lottery) => (
            <LotteryCard
              key={lottery._id}
              set={{
                id: lottery._id,
                name: lottery.title,
                description: lottery.description,
                image: lottery.image?.url || "",
                theme: collection.name,
                features: lottery.tag
                  ? [
                      lottery.tag
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()),
                    ]
                  : [],
                price: lottery.ticketPrice,
                marketPrice: lottery.marketPrice,
                pieces: lottery.pieces,
                drawDate: lottery.drawDate,
                drawTime: lottery.drawTime,
                totalSlots: lottery.totalSlots,
                slotsAvailable: lottery.slotsAvailable,
                dateAdded: lottery.createdAt,
                tag: lottery.tag,
                whyCollect: lottery.whyCollect,
                parts: lottery.parts || [],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;
