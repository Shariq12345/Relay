import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <div className="mt-10 mx-6 mb-6 p-8 bg-gray-50 shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-12 mr-2 rounded-md">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="bg-purple-800 text-white w-full h-full text-lg flex justify-center items-center rounded-md">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-extrabold text-purple-800 mb-2 flex items-center">
          {name}
        </h1>
      </div>
      <p className="text-sm text-gray-600">
        This conversation is just between you and{" "}
        <span className="text-purple-800 font-bold">{name}</span>. You can share
        messages, and more.
      </p>
    </div>
  );
};
