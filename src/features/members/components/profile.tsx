import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member?"
  );
  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Update Member Role",
    "Are you sure you want to update this member role?"
  );

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You have left the workspace!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave workspace");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();

    if (!ok) {
      return;
    }
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Member role updated!");
        },
        onError: () => {
          toast.error("Failed to update member role");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <p className="text-lg font-semibold">Member Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-4 h-full items-center justify-center p-4">
          <Loader className="size-6 text-gray-500" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <p className="text-lg font-semibold">Member Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-4 h-full items-center justify-center p-4">
          <AlertTriangle className="size-6 text-gray-500" />
          <p className="text-sm text-gray-600">Member not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.charAt(0).toUpperCase() ?? "M";

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <p className="text-lg font-semibold">Member Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-6">
          <Avatar className="w-32 h-32 rounded-full shadow-md">
            <AvatarImage
              src={member.user.image}
              alt={"Thread Avatar"}
              className="rounded-full"
            />
            <AvatarFallback className="bg-purple-600 text-white text-4xl flex items-center justify-center rounded-full shadow-sm">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <p className="text-xl font-bold mt-4">{member.user.name}</p>
        </div>
        <div className="flex flex-col p-6 border-t border-gray-200">
          {currentMember?.role === "admin" &&
            currentMember?._id !== member._id && (
              <div className="flex flex-col gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-full capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        onUpdate(role as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={onRemove}
                  variant={"destructive"}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            )}
          {currentMember?._id === member._id &&
            currentMember?.role !== "admin" && (
              <div className="mt-4">
                <Button
                  onClick={onLeave}
                  variant={"destructive"}
                  className="w-full"
                >
                  Leave
                </Button>
              </div>
            )}
        </div>
        <Separator />
        <div className="flex flex-col p-6">
          <p className="text-sm font-semibold mb-4">Contact Info</p>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gray-200 flex items-center justify-center">
              <MailIcon className="size-5 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-gray-500">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-purple-700 hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
