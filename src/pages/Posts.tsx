
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PostsList from "@/components/post/PostsList";
import { Post, Tag } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Plus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/api/posts";
import { getAllTags } from "@/api/tags";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Posts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-6 px-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold">
            {tagFilter ? `Posts tagged '${tagFilter}'` : 'Posts'}
          </h1>
          <p className="text-muted-foreground">
            {tagFilter 
              ? `Viewing all questions with the '${tagFilter}' tag` 
              : 'Browse questions and answers from the community'}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="default" 
            onClick={handleAskQuestion}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Ask a Question
          </Button>
        </motion.div>
      </div>
      
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
        >
          <PostsList posts={posts} popularTags={tags} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Posts;
