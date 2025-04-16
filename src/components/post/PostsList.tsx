
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import TagBadge from "@/components/tag/TagBadge";
import PostCard from "@/components/post/PostCard";
import { Post, Tag } from "@/types";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface PostsListProps {
  posts: Post[];
  popularTags: Tag[];
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const PostsList: React.FC<PostsListProps> = ({ posts, popularTags }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tag from URL query parameter on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFilter = params.get("tag");
    if (tagFilter && !selectedTags.includes(tagFilter)) {
      setSelectedTags([tagFilter]);
    }
  }, [location.search]);

  const filteredPosts = posts.filter((post) => {
    // Filter by search query
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected tags (any selected tag must be in post tags)
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      // Remove tag if already selected
      setSelectedTags(selectedTags.filter(t => t !== tagName));
      
      // Update URL without the tag parameter
      if (selectedTags.length === 1) {
        navigate("/posts");
      }
    } else {
      // Add tag if not already selected
      setSelectedTags([tagName]);
      
      // Update URL with the tag parameter
      navigate(`/posts?tag=${tagName}`);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
    navigate("/posts");
  };

  return (
    <div className="space-y-6">
      <motion.div 
        variants={item}
        className="relative"
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>
      
      {selectedTags.length > 0 ? (
        <motion.div 
          variants={item}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Selected Tags</h3>
            <button 
              onClick={clearAllTags}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => {
              const tagObj = popularTags.find(t => t.name === tag) || { id: tag, name: tag, count: 0 };
              return (
                <motion.div 
                  key={tagObj.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TagBadge
                    key={tagObj.id}
                    name={tagObj.name}
                    count={tagObj.count}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleTagClick(tagObj.name)}
                  >
                    <span className="flex items-center gap-1">
                      {tagObj.name}
                      <X size={14} />
                    </span>
                  </TagBadge>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        popularTags.length > 0 && (
          <motion.div 
            variants={item}
            className="space-y-2"
          >
            <h3 className="text-sm font-medium">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <motion.div 
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    count={tag.count}
                    className={selectedTags.includes(tag.name) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                    onClick={() => handleTagClick(tag.name)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      )}
      
      <motion.div 
        variants={item}
        className="space-y-4"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-10"
          >
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PostsList;
