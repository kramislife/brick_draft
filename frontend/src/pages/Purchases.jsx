import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Calendar, Clock, Package, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FallbackStates from "@/components/layout/fallback/FallbackStates";
import { useGetUserPurchasesQuery } from "@/redux/api/paymentApi";

const Purchases = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUserPurchasesQuery();

  const handlePurchaseClick = (purchaseId, urlFriendlySetName) => {
    navigate(`/ticket-success/${urlFriendlySetName}/${purchaseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-5 py-10">
        <div className="mb-5">
          <h1 className="text-4xl font-bold text-emerald-600 mb-3">
            Purchase History
          </h1>
          <p className="text-muted-foreground">
            Loading your purchase history...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-32 bg-muted rounded-xl"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FallbackStates
            icon={ShoppingBag}
            title="Error Loading Purchase History"
            description="Failed to load your purchase history. Please try again later."
            className="min-h-[500px]"
          />
        </div>
      </div>
    );
  }

  const purchases = data?.purchases || [];

  return (
    <div className="min-h-screen px-5 py-10">
      {/* hide header if there are no purchases */}
      {purchases.length > 0 && (
        <div className="mb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
            Purchase History
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your purchases and manage your lottery tickets
          </p>
        </div>
      )}

      {/* Purchases Grid */}
      {purchases.length === 0 ? (
        <FallbackStates
          icon={ShoppingBag}
          title="No Purchases Yet"
          description="You haven't made any purchases yet. Start by exploring our lottery sets!"
          className="min-h-[500px]"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {purchases.map((purchase) => {
            return (
              <Card
                key={purchase.purchase_id}
                onClick={() =>
                  handlePurchaseClick(
                    purchase.purchase_id,
                    purchase.lottery.urlFriendlySetName
                  )
                }
                className="p-0 cursor-pointer"
              >
                <div className="relative">
                  <div className="aspect-square border-b">
                    {purchase.lottery.image?.url ? (
                      <img
                        src={purchase.lottery.image.url}
                        alt={purchase.lottery.title}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    {/* Ticket Count Badge */}
                    <Badge
                      variant="accent"
                      className="absolute top-3 right-3"
                      title="Total Tickets"
                    >
                      {purchase.ticket_count || purchase.quantity || 1} Ticket
                      {(purchase.ticket_count || purchase.quantity || 1) > 1
                        ? "s"
                        : ""}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    {/* Set Name */}
                    <div className="font-bold text-lg mb-3 line-clamp-1">
                      {purchase.lottery.title}
                    </div>
                    {/* Purchase ID */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                        <Package className="w-4 h-4" />
                        {purchase.purchase_id}
                      </div>
                      {/* Draw Date and Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{purchase.lottery.formattedDrawDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>{purchase.lottery.formattedDrawTime}</span>
                      </div>
                    </div>
                    {/* Total Amount and Pieces Grid */}
                    <div className="flex justify-between mt-5 mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ${purchase.total_amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">
                          Pieces
                        </span>
                        <span className="text-2xl font-bold text-amber-500">
                          {purchase.lottery.pieces?.toLocaleString() || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Purchase Date */}
                    <div className="flex items-center justify-end text-xs text-muted-foreground border-t pt-3">
                      <span>Purchased: {purchase.formattedPurchaseDate}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Purchases;
