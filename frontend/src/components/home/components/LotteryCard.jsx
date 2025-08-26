import React from "react";
import { AlarmClockCheck, Box, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LotteryDialogParts from "@/pages/LotteryDialogParts";

const LotteryCard = ({
  id,
  name,
  image,
  theme,
  features,
  pieces,
  price,
  drawDate,
  drawTime,
  totalSlots,
  slotsAvailable,
  onCardClick,
  onViewPartsClick,
}) => {
  return (
    <Card
      className="group hover:shadow-lg overflow-hidden p-0 gap-2 cursor-pointer dark:border-none gradient-blue"
      onClick={onCardClick}
    >
      <div className="relative aspect-square border-b overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 p-1"
        />
        <div className="absolute top-4 left-4">
          <Badge>{theme}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          {features.map((feature) => (
            <Badge key={feature} variant="accent">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Box className="w-4 h-4" />
            <span>{pieces} pieces</span>
          </div>
          <span className="text-emerald-500 font-bold text-xl">${price}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <AlarmClockCheck className="w-4 h-4" />
          <span>
            {drawDate} at {drawTime}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="w-4 h-4" />
          <span>
            {slotsAvailable} of {totalSlots} slots left
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-2 pb-3 grid grid-cols-2 gap-2">
        <Dialog key={id}>
          <DialogTrigger asChild>
            <Button onClick={onViewPartsClick}>View Parts</Button>
          </DialogTrigger>
          <LotteryDialogParts
            setName={name}
            drawDate={drawDate}
            lotteryId={id}
          />
        </Dialog>
        <Button variant="accent" onClick={onCardClick}>
          Buy Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LotteryCard;
