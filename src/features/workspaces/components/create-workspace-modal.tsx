"use client";
import React, { useState } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();
  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement workspace creation logic
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace Created!");
          router.push(`/workspace/${id}`);
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
            Create Workspace
          </DialogTitle>
          <DialogDescription>
            Give your new workspace a name. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium text-gray-700"
            >
              Workspace Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              placeholder="e.g. My Awesome Team"
              required
              autoFocus
              minLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={false}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[#3F0E40] text-white hover:bg-[#320a33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isPending}
            >
              {false ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

{
  /* <Dialog open={open} onOpenChange={handleClose}>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Create Workspace</DialogTitle>
  </DialogHeader>
  <form className="space-y-4">
    <Input
      value=""
      disabled={false}
      placeholder="Workspace Name (e.g. My Workspace)"
      required
      autoFocus
      minLength={3}
    />
    <div className="flex justify-end">
      <Button disabled={false}>Create</Button>
    </div>
  </form>
</DialogContent>
</Dialog> */
}
