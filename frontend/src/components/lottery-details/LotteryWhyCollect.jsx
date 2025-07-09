import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const LotteryWhyCollect = ({ set }) => {
  return (
    <Card className="dark:border-none gap-2">
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          Why collect this set?
        </h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {set.whyCollect.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-muted-foreground text-sm"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LotteryWhyCollect;