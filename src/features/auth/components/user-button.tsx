"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { name, image, email } = data;
  const avatarFallback = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full transition-all duration-300 ease-in-out">
        <Avatar className="size-10 hover:opacity-90 transition-opacity">
          <AvatarImage alt={name || "User"} src={image} />
          <AvatarFallback className="bg-blue-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-64 p-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="size-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="size-4 mr-2" />
          Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
