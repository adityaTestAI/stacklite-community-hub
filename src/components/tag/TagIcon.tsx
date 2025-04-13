
import React from "react";
import { 
  Code, 
  Boxes, 
  FileType, 
  Database, 
  Server, 
  Webhook, 
  Globe, 
  PaintBucket, 
  Lightbulb, 
  Package, 
  LucideIcon,
  Puzzle,
  Atom
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TagIconProps {
  tagName: string;
  className?: string;
}

const TagIcon: React.FC<TagIconProps> = ({ tagName, className }) => {
  // Map tag names to appropriate icons
  const getIconForTag = (tag: string): React.ReactNode => {
    const tagLower = tag.toLowerCase();
    
    if (tagLower.includes("javascript") || tagLower.includes("js")) {
      return <Code className="text-yellow-500" />;
    } else if (tagLower.includes("react") || tagLower.includes("hooks")) {
      return <Atom className="text-blue-400" />;
    } else if (tagLower.includes("typescript") || tagLower.includes("ts")) {
      return <FileType className="text-blue-600" />;
    } else if (tagLower.includes("mongo") || tagLower.includes("database")) {
      return <Database className="text-green-600" />;
    } else if (tagLower.includes("node") || tagLower.includes("express")) {
      return <Server className="text-green-500" />;
    } else if (tagLower.includes("html")) {
      return <Code className="text-orange-500" />;
    } else if (tagLower.includes("css")) {
      return <PaintBucket className="text-blue-500" />;
    } else if (tagLower.includes("redux")) {
      return <Puzzle className="text-purple-500" />;
    } else if (tagLower.includes("schema") || tagLower.includes("design")) {
      return <Boxes className="text-amber-500" />;
    } else if (tagLower.includes("api") || tagLower.includes("rest")) {
      return <Webhook className="text-red-500" />;
    } else if (tagLower.includes("web") || tagLower.includes("browser")) {
      return <Globe className="text-blue-500" />;
    } else if (tagLower.includes("vue") || tagLower.includes("angular")) {
      return <Package className="text-green-500" />;
    } else {
      return <Lightbulb className="text-amber-400" />;
    }
  };

  return (
    <div className={cn("h-5 w-5", className)}>
      {getIconForTag(tagName)}
    </div>
  );
};

export default TagIcon;
