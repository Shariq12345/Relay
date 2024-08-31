"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-purple-700 group-[.toaster]:to-purple-900 group-[.toaster]:text-white group-[.toaster]:border-none group-[.toaster]:shadow-lg group-[.toaster]:p-4 group-[.toaster]:rounded-lg group-[.toaster]:transition group-[.toaster]:duration-300 group-[.toaster]:ease-in-out",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-[#611f69] group-[.toast]:text-white group-[.toast]:hover:bg-[#7C3085] group-[.toast]:transition group-[.toast]:duration-200 group-[.toast]:ease-in-out group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-[#421f42] group-[.toast]:text-gray-300 group-[.toast]:hover:bg-[#522d52] group-[.toast]:transition group-[.toast]:duration-200 group-[.toast]:ease-in-out group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded-md",
          closeButton:
            "group-[.toast]:text-gray-400 group-[.toast]:hover:text-white group-[.toast]:transition group-[.toast]:duration-200 group-[.toast]:ease-in-out",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
