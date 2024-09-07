import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberImage,
  memberName = "Member",
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName[0].toUpperCase();

  return (
    <div className="bg-white border-b h-[65px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-7 mr-2 rounded-md">
          <AvatarImage src={memberImage} alt={memberName} />
          <AvatarFallback className="rounded-md bg-purple-500 text-white text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
