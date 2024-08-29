import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer group">
      <Button
        variant="ghost"
        className={cn(
          "p-2 rounded-lg bg-transparent group-hover:bg-purple-700/10 transition-colors duration-200",
          isActive && "bg-purple-700/20"
        )}
      >
        <Icon className="h-5 w-5 text-white group-hover:text-purple-500 group-hover:scale-110 transition-transform duration-200" />
      </Button>
      <span
        className={cn(
          "text-[11px] text-white font-medium transition-colors duration-200",
          isActive ? "text-purple-500" : "group-hover:text-purple-500"
        )}
      >
        {label}
      </span>
    </div>
  );
};
