import React from "react";
import { Check } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContactFaq = ({ data }) => {
  return (
    <Card className="gap-3">
      <CardHeader className="text-xl font-semibold">{data.title}</CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {data.items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-2">
                  <Check size={17} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{item.answer}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ContactFaq;
