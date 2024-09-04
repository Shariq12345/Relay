import React from "react";
import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mt-10 mx-6 mb-6 p-8 bg-gray-50 shadow-md rounded-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold text-purple-800 mb-2 flex items-center">
        # {name}
      </h1>
      <p className="text-sm text-gray-600">
        Created on{" "}
        <span className="font-semibold text-purple-800">
          {format(new Date(creationTime), "MMMM do, yyyy")}
        </span>
        . This is the very beginning of the{" "}
        <span className="font-semibold text-purple-800">{name}</span> channel.
      </p>
    </div>
  );
};
