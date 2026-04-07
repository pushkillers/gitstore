import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, children, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    
    return (
      <Comp
        ref={asChild ? undefined : ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.98]",
          {
            // Primary variant
            "bg-[#238636] text-white hover:bg-[#2ea043] shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/40 focus-visible:ring-[#238636]":
              variant === "primary",
            
            // Secondary variant
            "bg-[#21262d] text-[#e6edf3] border border-[#30363d] hover:bg-[#30363d] hover:border-[#484f58] shadow-md hover:shadow-lg focus-visible:ring-[#30363d]":
              variant === "secondary",
            
            // Ghost variant
            "text-[#e6edf3] hover:bg-[#30363d]/50 focus-visible:ring-[#30363d]":
              variant === "ghost",
            
            // Success variant
            "bg-gradient-to-r from-[#238636] to-[#2ea043] text-white shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/50 hover:scale-[1.02] focus-visible:ring-[#238636]":
              variant === "success",
            
            // Danger variant
            "bg-[#da3633] text-white hover:bg-[#f85149] shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 focus-visible:ring-[#da3633]":
              variant === "danger",
            
            // Sizes
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-base": size === "md",
            "px-7 py-3.5 text-lg": size === "lg",
          },
          className
        )}
        {...(asChild ? {} : props)}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
