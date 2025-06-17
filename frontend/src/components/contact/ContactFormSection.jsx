import React from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const ContactFormSection = ({ data, animations }) => {
  return (
    <motion.div className="lg:col-span-2" {...animations}>
      <Card>
        <CardHeader className="text-xl font-semibold">
          {data.title}
          <p className="text-sm text-muted-foreground font-normal">
            {data.subtitle}
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.fields.map((field) => (
                <div key={field.id} className={`space-y-2 ${field.gridSpan}`}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ))}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor={data.messageField.id}>
                {data.messageField.label}
              </Label>
              <Textarea
                id={data.messageField.id}
                placeholder={data.messageField.placeholder}
                className="min-h-[200px]"
                required={data.messageField.required}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="accent" className="w-full">
              <Send />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactFormSection;