import React from "react";
import { useNavigate } from "react-router-dom";
import { AlarmClockCheck, Box, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LotteryDialogParts from "@/pages/LotteryDialogParts";

const LotteryCard = ({ set }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/lottery/${set.id}`);
  };

  return (
    <Card
      className="group hover:shadow-lg overflow-hidden p-0 gap-2 cursor-pointer dark:border-none gradient-blue"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square border-b overflow-hidden">
        <img
          src={set.image || "/placeholder-image.jpg"}
          alt={set.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 p-1"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge>{set.theme}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          {set.features.map((feature) => (
            <Badge key={feature} variant="accent">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="text-xl font-semibold line-clamp-1">{set.name}</h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Box className="w-4 h-4" />
            <span>{set.pieces} pieces</span>
          </div>
          <span className="text-emerald-500 font-bold text-xl">
            ${Number(set.price).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <AlarmClockCheck className="w-4 h-4" />
          <span>
            {set.drawDate} at {set.drawTime}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="w-4 h-4" />
          <span>
            {set.slotsAvailable} of {set.totalSlots} slots left
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-2 pb-3 grid grid-cols-2 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={(e) => e.stopPropagation()}>View Parts</Button>
          </DialogTrigger>
          <LotteryDialogParts
            parts={set.parts}
            setName={set.name}
            drawDate={set.drawDate}
          />
        </Dialog>
        <Button
          variant="accent"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/lottery/${set.id}`);
          }}
        >
          Buy Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LotteryCard;
