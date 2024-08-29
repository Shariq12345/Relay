import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import React from "react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-12 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-8 px-2
          "
        >
          <Search className="size-4 mr-2 text-white" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
