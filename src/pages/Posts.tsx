
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PostsList from "@/components/post/PostsList";
import { Post, Tag } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/api/posts";
import { getAllTags } from "@/api/tags";
import { useToast } from "@/hooks/use-toast";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts and tags in parallel
        const [postsData, tagsData] = await Promise.all([
          getAllPosts(),
          getAllTags()
        ]);
        
        setPosts(postsData);
        setPopularTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Check if we're coming from a tag page with a filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFilter = params.get("tag");
    if (tagFilter) {
      console.log(`Filtering by tag: ${tagFilter}`);
      // The filtering is handled in the PostsList component
    }
  }, [location.search]);

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
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Browse questions and answers from the community</p>
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
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse space-y-4 w-full max-w-3xl">
            <div className="h-12 bg-secondary rounded"></div>
            <div className="h-6 bg-secondary rounded w-48"></div>
            <div className="h-32 bg-secondary rounded"></div>
            <div className="h-32 bg-secondary rounded"></div>
            <div className="h-32 bg-secondary rounded"></div>
          </div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <PostsList posts={posts} popularTags={popularTags} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Posts;
