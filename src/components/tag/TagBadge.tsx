
import React from "react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  count?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  name, 
  count, 
  className,
  onClick,
  children
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors overflow-hidden",
        "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
      title={typeof children === 'string' ? children : name}
    >
      <span className="inline-flex items-center truncate max-w-full">
        {children || name}
        {count !== undefined && (
          <span className="ml-1 text-muted-foreground shrink-0">×{count}</span>
        )}
      </span>
    </button>
  );
};

export default TagBadge;
