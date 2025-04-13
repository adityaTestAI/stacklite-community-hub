
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostsList from "@/components/post/PostsList";
import { Post, Tag } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";

// Mock data for demonstration
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "How to optimize React performance with useCallback?",
    content: "I'm trying to understand the best practices for optimizing React components using useCallback. When should I use it and when is it unnecessary?",
    authorId: "user1",
    authorName: "John Doe",
    createdAt: "2023-05-15T10:30:00Z",
    tags: ["react", "javascript", "hooks"],
    upvotes: 24,
    views: 156,
    answers: [
      {
        id: "a1",
        content: "useCallback is best used when you have functions that are passed as props to child components that rely on referential equality...",
        authorId: "user2",
        authorName: "Jane Smith",
        createdAt: "2023-05-15T11:20:00Z",
        upvotes: 12
      }
    ]
  },
  {
    id: "2",
    title: "Understanding TypeScript generics with multiple constraints",
    content: "I'm trying to define a TypeScript generic that has multiple constraints. How can I define a type that extends multiple interfaces?",
    authorId: "user3",
    authorName: "Robert Johnson",
    createdAt: "2023-05-14T15:45:00Z",
    tags: ["typescript", "generics"],
    upvotes: 18,
    views: 123,
    answers: []
  },
  {
    id: "3",
    title: "Best practices for MongoDB schema design",
    content: "I'm designing a MongoDB schema for a blogging platform. Should I use embedded documents or references for comments and likes?",
    authorId: "user4",
    authorName: "Emily Clark",
    createdAt: "2023-05-13T09:15:00Z",
    tags: ["mongodb", "database", "schema-design"],
    upvotes: 32,
    views: 210,
    answers: [
      {
        id: "a2",
        content: "For a blogging platform, I would recommend using references for comments...",
        authorId: "user5",
        authorName: "Michael Brown",
        createdAt: "2023-05-13T10:05:00Z",
        upvotes: 8
      },
      {
        id: "a3",
        content: "It depends on your read/write patterns. If you read posts with comments frequently...",
        authorId: "user1",
        authorName: "John Doe",
        createdAt: "2023-05-13T11:30:00Z",
        upvotes: 15
      }
    ]
  }
];

const MOCK_TAGS: Tag[] = [
  { id: "1", name: "javascript", count: 352 },
  { id: "2", name: "react", count: 245 },
  { id: "3", name: "typescript", count: 187 },
  { id: "4", name: "mongodb", count: 112 },
  { id: "5", name: "database", count: 89 },
  { id: "6", name: "hooks", count: 56 },
  { id: "7", name: "schema-design", count: 43 },
  { id: "8", name: "generics", count: 31 }
];

const Posts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch posts from an API
    // For now, we'll use mock data
    const fetchPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setPosts(MOCK_POSTS);
        setPopularTags(MOCK_TAGS);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Check if we're coming from a tag page with a filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFilter = params.get("tag");
    if (tagFilter) {
      // In a real app, we would filter posts by tag
      // For the mock, we already have all posts, so we don't need to fetch again
      console.log(`Filtering by tag: ${tagFilter}`);
    }
  }, [location.search]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Browse questions and answers from the community</p>
        </div>
        
        <Button 
          onClick={() => navigate(currentUser ? "/posts/ask" : "/login")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Ask a Question
        </Button>
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
        <PostsList posts={posts} popularTags={popularTags} />
      )}
    </div>
  );
};

export default Posts;
