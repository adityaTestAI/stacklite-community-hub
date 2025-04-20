
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import TagBadge from "@/components/tag/TagBadge";
import TagIcon from "@/components/tag/TagIcon";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="border-b py-6 flex gap-6">
      {/* Stats */}
      <div className="flex flex-col items-center gap-3 min-w-[70px]">
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{post.upvotes}</div>
          <div className="text-xs text-muted-foreground">votes</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{post.answers.length}</div>
          <div className="text-xs text-muted-foreground">answers</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{post.views}</div>
          <div className="text-xs text-muted-foreground">views</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <Link to={`/posts/${post.id}`} className="group">
          <h2 className="text-xl font-semibold group-hover:text-orange-500 transition-colors mb-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge
                key={tag}
                name={tag}
                className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                <TagIcon tagName={tag} className="h-3 w-3 mr-1" />
                {tag}
              </TagBadge>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span>Asked by {post.authorName} </span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
