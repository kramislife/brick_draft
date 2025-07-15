import React from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserMenuItems } from "@/constant/userNavigation";

const UserDropdown = ({
  user,
  isAdmin,
  isLoading,
  onLogout,
  onProfileClick,
  onAdminClick,
  onPurchasesClick,
  getUserInitials,
}) => {
  // Get user menu items from centralized configuration
  const userMenuItems = getUserMenuItems(
    isAdmin,
    onAdminClick,
    onProfileClick,
    onPurchasesClick
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src={user?.profile_picture?.url}
              alt={user?.name || "User"}
            />
            <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {userMenuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.id}>
              <DropdownMenuItem onClick={item.onClick}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoading}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
