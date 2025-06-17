import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Box, ChevronFirst, ChevronLast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminNavigation } from "@/constant/adminNavigation";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="h-full border-r bg-background">
      <div
        className={`transition-all duration-300 ease-in-out sticky -top-2 ${
          collapsed ? "w-20" : "w-70"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b relative">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="bg-black text-white rounded-md p-2">
                <Box size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-xl whitespace-nowrap">
                  Brick Draft
                </h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <Box size={24} />
            </div>
          )}

          {/* Toggle button placed at the far right border */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              onClick={toggleSidebar}
            >
              {collapsed ? (
                <ChevronLast size={20} />
              ) : (
                <ChevronFirst size={20} />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-5">
          {adminNavigation.map((section, index) => (
            <div key={index} className="mb-5">
              {!collapsed && (
                <div className="px-3 mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.section}
                  </h2>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={itemIndex}
                      to={item.path}
                      title={item.label}
                      end={item.path === "/admin"}
                      className={({ isActive }) =>
                        `group flex items-center p-3 rounded-md text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-ring/10"
                        }`
                      }
                    >
                      <div
                        className={`flex items-center ${
                          collapsed ? "justify-center w-full" : "gap-4 flex-1"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
