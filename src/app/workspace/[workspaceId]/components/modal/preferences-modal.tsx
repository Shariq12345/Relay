import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success("Workspace Updated!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Update Failed!");
        },
      }
    );
    setEditOpen(false);
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace Deleted!");
          router.replace("/");
        },
        onError: () => {
          toast.error("Delete Failed!");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white dark:bg-gray-800">
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Preferences
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Workspace Name
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {value}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-gray-50 dark:bg-gray-900 rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Rename Workspace
                  </DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="Workspace Name e.g. Marketing, Design, Engineering"
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingWorkspace}
                        className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white dark:bg-gray-800 rounded-lg border border-rose-600 dark:border-rose-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-rose-600 dark:text-rose-500"
            >
              <TrashIcon className="h-5 w-5" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
