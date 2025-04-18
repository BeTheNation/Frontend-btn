"use client";

import { Sidebar } from "./base";
import { SidebarProvider, useSidebar, SidebarContext } from "./context";
import { Button } from "@/components/ui/inputs/button";
import { Input } from "@/components/ui/inputs/input";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

// Sidebar Rail (toggle button)
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

// Additional sidebar components extracted from the original file
const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      data-sidebar="trigger"
      className={cn("h-9 w-9", className)}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      {children}
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// Sidebar main components
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

// Export all components
export {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  useSidebar,
};
