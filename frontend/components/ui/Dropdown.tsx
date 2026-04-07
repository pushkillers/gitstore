"use client";

import { ReactNode, useEffect, useRef, useState, MouseEvent } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        type="button"
        onClick={handleClick}
        className={className}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className={`
            absolute top-full mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl z-50
            ${align === "right" ? "right-0" : "left-0"}
          `}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

interface DropdownItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  badge?: string | number;
}

export function DropdownItem({ icon, children, onClick, href, variant = "default", badge }: DropdownItemProps) {
  const baseClasses = `
    flex items-center gap-3 px-4 py-3 text-base transition-colors cursor-pointer
    ${variant === "danger" 
      ? "text-[#f85149] hover:bg-[#f851491a]" 
      : "text-[#e6edf3] hover:bg-[#21262d]"
    }
  `;

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {badge !== undefined && (
        <span className="px-2.5 py-1 text-sm font-semibold bg-[#1f6feb] text-white rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} w-full text-left`}>
      {content}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-[#30363d]" />;
}

export function DropdownHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-3 text-sm font-semibold text-[#7d8590] uppercase tracking-wider border-b border-[#30363d]">
      {children}
    </div>
  );
}
