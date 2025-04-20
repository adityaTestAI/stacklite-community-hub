
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PostsList from "@/components/post/PostsList";
import { Post, Tag } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Plus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/api/posts";
import { getAllTags } from "@/api/tags";
import { useIsMobile } from "@/hooks/use-mobile";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type SortType = "newest" | "votes" | "unanswered";

const Posts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Sort type state
  const [sortType, setSortType] = useState<SortType>("newest");

  // Extract tag from URL if present
  const searchParams = new URLSearchParams(location.search);
  const tagFilter = searchParams.get("tag");

  // Fetch posts using react-query
  const { 
    data: posts = [], 
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts
  });

  // Fetch tags using react-query
  const { 
    data: tags = [], 
    isLoading: isLoadingTags
  } = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags
  });

  // If there's an error fetching posts, show a toast
  React.useEffect(() => {
    if (postsError) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
      console.error("Error fetching posts:", postsError);
    }
  }, [postsError, toast]);

  // Log when we're filtering by tag
  React.useEffect(() => {
    if (tagFilter) {
      console.log(`Filtering by tag: ${tagFilter}`);
    }
  }, [tagFilter]);

  const handleAskQuestion = () => {
    navigate("/posts/ask");
  };

  // Sort posts based on current sort type
  const sortedPosts = React.useMemo(() => {
    if (!posts.length) return [];
    
    const filteredPosts = tagFilter 
      ? posts.filter(post => post.tags.includes(tagFilter))
      : posts;
      
    switch (sortType) {
      case "newest":
        return [...filteredPosts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "votes":
        return [...filteredPosts].sort((a, b) => b.upvotes - a.upvotes);
      case "unanswered":
        return [...filteredPosts].filter(post => post.answers.length === 0);
      default:
        return filteredPosts;
    }
  }, [posts, sortType, tagFilter]);

  // Calculate the count of all posts
  const totalPostsCount = sortedPosts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-6 px-4 max-w-7xl"
    >
      {/* Header Section */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-1"
        >
          Questions
        </motion.h1>
        
        {!isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <p className="text-muted-foreground">
              {tagFilter 
                ? `Questions tagged with '${tagFilter}'` 
                : 'Browse questions and answers from the community'}
            </p>
            <Button 
              variant="default" 
              onClick={handleAskQuestion}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Ask Question
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Main Content Area - Responsive Layout */}
      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Posts List Section */}
        <div className="flex-1 min-w-0">
          {isLoadingPosts || isLoadingTags ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center">
                <LoaderCircle className="animate-spin h-8 w-8 text-primary mb-2" />
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <div className="flex flex-col">
                {/* Sorting Tabs */}
                <div className="border-b mb-4">
                  <div className="flex">
                    <button
                      onClick={() => setSortType("newest")}
                      className={`py-3 px-6 font-medium text-sm ${
                        sortType === "newest" 
                          ? "border-b-2 border-orange-500 text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => setSortType("votes")}
                      className={`py-3 px-6 font-medium text-sm ${
                        sortType === "votes" 
                          ? "border-b-2 border-orange-500 text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Most Votes
                    </button>
                    <button
                      onClick={() => setSortType("unanswered")}
                      className={`py-3 px-6 font-medium text-sm ${
                        sortType === "unanswered" 
                          ? "border-b-2 border-orange-500 text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Unanswered
                    </button>
                  </div>
                </div>
                
                {/* Post Count */}
                <div className="text-sm text-muted-foreground mb-4">
                  {totalPostsCount} {totalPostsCount === 1 ? 'question' : 'questions'}
                </div>
                
                {/* Mobile "Ask Question" button */}
                {isMobile && (
                  <Button 
                    variant="default" 
                    onClick={handleAskQuestion}
                    className="bg-orange-500 hover:bg-orange-600 text-white mb-4 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Ask Question
                  </Button>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={sortType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PostsList posts={sortedPosts} popularTags={tags} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Tags Sidebar - Responsive */}
        {!isMobile && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:w-80 shrink-0"
          >
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-6">
              <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/posts?tag=${tag.name}`)}
                    className={`bg-secondary/80 dark:bg-secondary/30 py-1 px-3 rounded-full cursor-pointer text-sm flex items-center gap-1 ${
                      tagFilter === tag.name ? "bg-orange-500/20 text-orange-500" : ""
                    }`}
                  >
                    {tag.name}
                    <span className="text-muted-foreground">×{tag.count}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Button variant="ghost" size="sm" onClick={() => navigate('/tags')}>
                  View all tags
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Posts;
