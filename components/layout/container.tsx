import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({
  children,
  className,
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container mx-auto px-4", className)} {...props}>
      {children}
    </div>
  );
}
