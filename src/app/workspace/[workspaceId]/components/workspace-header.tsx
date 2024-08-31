import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../../convex/_generated/dataModel";
import {
  ChevronDown,
  Users,
  Settings,
  SquarePen,
  ListFilter,
} from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./modal/preferences-modal";
import { InviteModal } from "./modal/invite-modal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-16">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="font-semibold text-lg w-auto p-2 text-white hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center rounded-md"
              variant="ghost"
              size="lg"
            >
              <span className="truncate max-w-[200px]">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0 text-white opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-xl rounded-xl border-0"
          >
            <DropdownMenuItem className="cursor-pointer capitalize hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center p-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xl rounded-lg flex items-center justify-center mr-3 shadow-md">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem
                  className="cursor-pointer py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                  onClick={() => setInviteOpen(true)}
                >
                  <Users className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Invite to workspace</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem
                  className="cursor-pointer py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                  onClick={() => setPreferencesOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
          <div className="flex items-center gap-0.5">
            <Hint label="Filter" side="bottom">
              <Button variant={"transparent"} size={"iconSm"}>
                <ListFilter className="size-5" />
              </Button>
            </Hint>
            <Hint label="New Message" side="bottom">
              <Button variant={"transparent"} size={"iconSm"}>
                <SquarePen className="size-5" />
              </Button>
            </Hint>
          </div>
        </DropdownMenu>
      </div>
    </>
  );
};
