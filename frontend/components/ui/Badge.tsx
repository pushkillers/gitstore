import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
          "transition-all duration-200",
          {
            "bg-[#30363d]/50 text-[#7d8590] border border-[#30363d]":
              variant === "default",
            "bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/20":
              variant === "primary",
            "bg-[#238636]/10 text-[#3fb950] border border-[#238636]/20":
              variant === "success",
            "bg-[#d29922]/10 text-[#d29922] border border-[#d29922]/20":
              variant === "warning",
            "bg-[#da3633]/10 text-[#f85149] border border-[#da3633]/20":
              variant === "danger",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
