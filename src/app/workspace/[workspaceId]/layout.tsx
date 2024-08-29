"use client";
import React from "react";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./components/workspace-sidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-48px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="relay-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            className="bg-[#5e2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={50} className="bg-gray-100 dark:bg-gray-900">
            <div className="h-full p-4">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
