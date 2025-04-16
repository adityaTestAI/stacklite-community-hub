
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createPost } from "@/api/posts";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the validation schema
const questionSchema = z.object({
  title: z.string().min(15, "Title must be at least 15 characters long").max(150, "Title cannot exceed 150 characters"),
  content: z.string().min(30, "Question details must be at least 30 characters long"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const AskQuestion = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hasTagsError, setHasTagsError] = useState(false);

  // Define form with validation
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Check if user is logged in
  useEffect(() => {
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
      setHasTagsError(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const onSubmit = async (data: QuestionFormValues) => {
    // Validate tags
    if (tags.length === 0) {
      setHasTagsError(true);
      return;
    }

    setSubmitting(true);

    try {
      const newPost = await createPost({
        title: data.title,
        content: data.content,
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's your question? Be specific."
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium text-destructive bg-destructive/10 rounded-md px-2 py-1 inline-block" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      minHeight="300px"
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium text-destructive bg-destructive/10 rounded-md px-2 py-1 inline-block" />
                  <p className="text-xs text-muted-foreground">
                    Format your content using the toolbar. You can use **bold**, *italic*, `code`, and lists.
                  </p>
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <FormLabel htmlFor="tags">Tags</FormLabel>
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
              
              {hasTagsError && (
                <Alert variant="destructive" className="mt-2 py-2 border border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Please add at least one tag to your question.
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-muted-foreground">Add up to 5 tags to describe what your question is about</p>
            </div>
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
      </Form>
    </motion.div>
  );
};

export default AskQuestion;
