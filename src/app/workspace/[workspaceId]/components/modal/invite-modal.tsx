import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, CheckIcon, Share2Icon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [copied, setCopied] = useState(false);
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm(
    "Generate new code",
    "This will invalidate the current code and generate a new one. Are you sure you want to continue?"
  );

  const inviteLink = `${window.location.origin}/join/${workspaceId}`;

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("New code generated successfully");
        },
        onError: (error) => {
          toast.error("Failed to generate new code");
        },
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${name} on our workspace`,
          text: `Use this code to join: ${joinCode}`,
          url: inviteLink,
        });
        toast.success("Invite shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("Sharing is not supported on this device");
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-w-xs mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Invite to <span className="text-purple-600">{name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Share this code or link to invite people to join this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Join Code
              </p>
              <p className="text-3xl md:text-4xl font-bold tracking-wider uppercase text-purple-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md">
                {joinCode}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Invite Link
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="flex-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 border-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className={cn(
                    "dark:text-gray-300 border-gray-300 dark:border-gray-700 bg-purple-600 text-white",
                    copied &&
                      "bg-green-500 border-green-500 hover:bg-green-600 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700"
                  )}
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleNewCode}
              disabled={isPending}
              className="flex items-center justify-center w-full sm:w-auto mt-3 sm:mt-0 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              New Code
              <RefreshCcw className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Share2Icon className="mr-2 h-4 w-4" />
              Share Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
