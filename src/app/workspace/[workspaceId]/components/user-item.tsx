import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
  "flex items-center gap-2 justify-start font-medium h-9 px-4 text-base rounded-lg transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-gray-300 hover:bg-purple-500 hover:text-white",
        active: "text-white bg-purple-600 hover:bg-purple-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
  id,
  image,
  label = "Member",
  variant,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button
      className={cn(userItemVariants({ variant: variant }))}
      variant={"transparent"}
      size={"sm"}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} alt={label} className="rounded-full" />
          <AvatarFallback className="rounded-full bg-sky-500 text-white text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
