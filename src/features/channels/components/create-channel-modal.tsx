import React, { useState } from "react";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateChannel();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
    setError("");
  };

  const handleClose = () => {
    setName("");
    setError("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: (id) => {
          toast.success("Channel Created");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create channel");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Channel
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Create a new channel for your team to collaborate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="channel-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Channel Name
            </Label>
            <Input
              id="channel-name"
              value={name}
              onChange={handleChange}
              disabled={isPending}
              required
              autoFocus
              minLength={3}
              maxLength={80}
              placeholder="e.g. general"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
            />
            {error && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || name.length < 3}
              className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all"
            >
              {isPending ? "Creating..." : "Create Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
