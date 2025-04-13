
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import TagBadge from "@/components/tag/TagBadge";
import PostCard from "@/components/post/PostCard";
import { Post, Tag } from "@/types";
import { Search } from "lucide-react";

interface PostsListProps {
  posts: Post[];
  popularTags: Tag[];
}

const PostsList: React.FC<PostsListProps> = ({ posts, popularTags }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    // Filter by search query
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected tag
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    
    return matchesQuery && matchesTag;
  });

  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null); // Deselect if already selected
    } else {
      setSelectedTag(tagName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {popularTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                count={tag.count}
                className={selectedTag === tag.name ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                onClick={() => handleTagClick(tag.name)}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
