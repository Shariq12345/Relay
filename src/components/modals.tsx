"use client";

import { useEffect, useState } from "react";
import { CreateWorkSpaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateChannelModal />
      <CreateWorkSpaceModal />
    </>
  );
};
