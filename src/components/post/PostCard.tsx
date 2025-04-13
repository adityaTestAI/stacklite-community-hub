
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TagBadge from "@/components/tag/TagBadge";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import TagIcon from "@/components/tag/TagIcon";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <Link to={`/posts/${post.id}`} className="group">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {post.content}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag) => (
                <div key={tag} className="flex items-center">
                  <TagBadge
                    name={tag}
                    className="flex items-center gap-1.5"
                  >
                    <TagIcon tagName={tag} className="h-3.5 w-3.5 mr-1" />
                    {tag}
                  </TagBadge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end justify-between text-muted-foreground">
            <div className="text-xs">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
            <div className="text-sm">{post.authorName}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-secondary/30 flex justify-between border-t">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <ThumbsUp size={16} />
            <span>{post.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{post.answers.length}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
