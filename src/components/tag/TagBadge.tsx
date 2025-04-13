
import React from "react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  count?: number;
  className?: string;
  onClick?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  name, 
  count, 
  className,
  onClick
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
    >
      {name}
      {count !== undefined && (
        <span className="ml-1 text-muted-foreground">×{count}</span>
      )}
    </button>
  );
};

export default TagBadge;
