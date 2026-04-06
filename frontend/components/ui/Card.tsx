import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          {
            // Default variant
            "bg-[#161b22] border border-[#30363d]": variant === "default",
            
            // Elevated variant
            "bg-[#161b22] border border-[#30363d] shadow-xl shadow-black/20":
              variant === "elevated",
            
            // Glass variant
            "glass-effect": variant === "glass",
            
            // Hover effect
            "hover-lift hover:border-[#58a6ff]/50 hover:glow-accent cursor-pointer":
              hover,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
