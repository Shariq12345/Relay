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

export const CreateChannelModal = () => {
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
          // TODO: Redirect to the new channel
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Channel
          </DialogTitle>
          <DialogDescription>
            Create a new channel for your team to collaborate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name" className="text-sm font-medium">
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
              className="w-full"
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
              className="w-full sm:w-auto"
            >
              {isPending ? "Creating..." : "Create Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
