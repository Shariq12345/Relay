"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useJoin } from "@/features/workspaces/api/use-join";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
      toast.info("You are already a member of this workspace.");
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="w-12 h-12 animate-spin text-gray-600" />
      </div>
    );
  }

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined.");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center gap-y-6">
          <Image src={"/logo.svg"} alt="Logo" width={60} height={60} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Join <span className="text-purple-600">{data?.name}</span>
            </h1>
            <p className="text-md text-gray-600 mt-2">
              Enter the workspace code to join
            </p>
          </div>
          <VerificationInput
            onComplete={handleComplete}
            length={6}
            classNames={{
              container: cn(
                "flex gap-x-2 mt-4",
                isPending && "opacity-50 cursor-not-allowed"
              ),
              character:
                "w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600",
              characterInactive: "bg-gray-200",
              characterSelected: "bg-white text-gray-800",
              characterFilled: "bg-white text-gray-800",
            }}
            autoFocus
          />
          <div className="flex gap-x-4 mt-6">
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/"}>Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
