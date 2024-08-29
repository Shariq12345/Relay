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
            "group toast group-[.toaster]:bg-[#2C0B2C] group-[.toaster]:text-white group-[.toaster]:border-[#3F0E40] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-[#611f69] group-[.toast]:text-white group-[.toast]:hover:bg-[#7C3085]",
          cancelButton:
            "group-[.toast]:bg-[#421f42] group-[.toast]:text-gray-300 group-[.toast]:hover:bg-[#522d52]",
          closeButton:
            "group-[.toast]:text-gray-400 group-[.toast]:hover:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
