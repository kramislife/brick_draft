import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { socialLinks } from "@/constant/userNavigation";

const ContactSocials = ({ data }) => {
  return (
    <Card>
      <CardHeader className="text-xl font-semibold">
        {data.title}
        <p className="text-sm text-muted-foreground font-normal">
          {data.subtitle}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row space-x-5">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-accent transition-colors group"
              >
                <div className="p-2 rounded-md group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{link.name}</span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSocials;
