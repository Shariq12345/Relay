import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xl h-9 w-9 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ease-in-out">
          {workspaceLoading ? (
            <Loader className="animate-spin h-5 w-5 text-slate-800" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem
          className="font-medium"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground text-sm font-medium">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            {workspace?.name}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Other workspaces
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-secondary-foreground text-sm font-medium">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              {workspace.name}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create a new workspace
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           className="w-full justify-between px-3 py-2 h-auto text-left font-normal"
//         >
//           <div className="flex items-center gap-2">
//             {workspaceLoading ? (
//               <Loader className="h-4 w-4 animate-spin" />
//             ) : (
//               <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground text-sm font-medium">
//                 {workspace?.name.charAt(0).toUpperCase()}
//               </div>
//             )}
//             <span className="truncate">{workspace?.name}</span>
//           </div>
//           <ChevronDown className="h-4 w-4 opacity-50" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="start">
//         <DropdownMenuItem
//           className="font-medium"
//           onClick={() => router.push(`/workspace/${workspaceId}`)}
//         >
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground text-sm font-medium">
//               {workspace?.name.charAt(0).toUpperCase()}
//             </div>
//             {workspace?.name}
//           </div>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem disabled className="text-xs text-muted-foreground">
//           Other workspaces
//         </DropdownMenuItem>
//         {filteredWorkspaces?.map((workspace) => (
//           <DropdownMenuItem
//             key={workspace._id}
//             onClick={() => router.push(`/workspace/${workspace._id}`)}
//           >
//             <div className="flex items-center gap-2">
//               <div className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-secondary-foreground text-sm font-medium">
//                 {workspace.name.charAt(0).toUpperCase()}
//               </div>
//               {workspace.name}
//             </div>
//           </DropdownMenuItem>
//         ))}
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => setOpen(true)}>
//           <div className="flex items-center gap-2">
//             <Plus className="h-4 w-4" />
//             Create a new workspace
//           </div>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
