
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createPost } from "@/api/posts";
import RichTextEditor from "@/components/editor/RichTextEditor";

const AskQuestion = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // If not logged in, redirect to login
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to ask a question.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [currentUser, navigate, toast]);

  const handleAddTag = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || tags.length === 0) {
      toast({
        title: "Validation error",
        description: "Please fill all required fields and add at least one tag.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const newPost = await createPost({
        title,
        content,
        authorId: currentUser?.uid || "anonymous",
        authorName: currentUser?.displayName || "Anonymous User",
        tags,
        upvotes: 0,
        views: 1
      });
      
      toast({
        title: "Success!",
        description: "Your question has been posted.",
      });
      
      navigate("/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 px-4"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold mb-6"
      >
        Ask a Question
      </motion.h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="What's your question? Be specific."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="content">Details</Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            minHeight="300px"
          />
          <p className="text-xs text-muted-foreground">
            Format your content using the toolbar. You can use **bold**, *italic*, `code`, and lists.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add tags (press Enter)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" onClick={handleAddTag}>Add</Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} className="flex items-center gap-1">
                  {t}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => handleRemoveTag(t)}
                  />
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Add up to 5 tags to describe what your question is about</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={submitting}
          >
            {submitting ? "Posting question..." : "Post Your Question"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AskQuestion;
