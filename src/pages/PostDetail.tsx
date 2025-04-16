
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TagBadge from "@/components/tag/TagBadge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Post, Answer } from "@/types";
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Eye,
  Calendar 
} from "lucide-react";
import { getPostById, updatePost } from "@/api/posts";
import RichTextEditor from "@/components/editor/RichTextEditor";

const PostDetail = () => {
  const { currentUser } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("answers");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        const fetchedPost = await getPostById(postId);
        if (fetchedPost) {
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpvote = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to log in to upvote posts.",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    // Update local state optimistically
    setPost(prev => {
      if (!prev) return null;
      return {
        ...prev,
        upvotes: prev.upvotes + 1
      };
    });

    // In a real app, we would call an API to upvote the post
    toast({
      title: "Post upvoted",
      description: "Thank you for your contribution!",
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to log in to answer questions.",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    if (!newAnswer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create the new answer
      const answer: Answer = {
        id: `a${Math.random().toString(36).substring(7)}`,
        content: newAnswer,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        createdAt: new Date().toISOString(),
        upvotes: 0
      };

      // Update local state optimistically
      setPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: [...prev.answers, answer]
        };
      });

      // In a real app with server, this would update the database
      // This mock implementation would work with the real API when connected
      if (post && postId) {
        await updatePost(postId, { 
          answers: [...post.answers, answer]
        });
      }

      setNewAnswer("");
      setActiveTab("answers");

      toast({
        title: "Answer submitted",
        description: "Your answer has been posted successfully."
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Simple function to render markdown content
  const renderMarkdown = (content: string) => {
    // Split by paragraphs
    return content.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className="mb-4">{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-secondary rounded w-3/4"></div>
          <div className="h-4 bg-secondary rounded w-1/4"></div>
          <div className="h-32 bg-secondary rounded"></div>
          <div className="h-4 bg-secondary rounded w-1/2"></div>
          <div className="h-64 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/posts" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp size={16} />
              <span>{post.upvotes} upvotes</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{post.answers.length} answers</span>
            </div>
            <div>by {post.authorName}</div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                {renderMarkdown(post.content)}
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 bg-secondary/30 border-t flex flex-wrap gap-4 justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} to={`/posts?tag=${tag}`}>
                    <TagBadge key={tag} name={tag} />
                  </Link>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={handleUpvote}
              >
                <ThumbsUp size={16} />
                Upvote
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Tabs 
            defaultValue="answers" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="answers">
                Answers ({post.answers.length})
              </TabsTrigger>
              <TabsTrigger value="write-answer">
                Write Answer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="answers" className="py-4">
              {post.answers.length > 0 ? (
                <div className="space-y-6">
                  {post.answers.map((answer) => (
                    <Card key={answer.id}>
                      <CardContent className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          {renderMarkdown(answer.content)}
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 py-4 bg-secondary/30 border-t flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          Answered by {answer.authorName}, {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <ThumbsUp size={16} />
                          <span>{answer.upvotes}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to answer this question!
                  </p>
                  <Button onClick={() => setActiveTab("write-answer")}>
                    Write an Answer
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="write-answer" className="py-4">
              {currentUser ? (
                <div className="space-y-4">
                  <RichTextEditor
                    value={newAnswer}
                    onChange={setNewAnswer}
                    minHeight="200px"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Answer"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Authentication required</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to log in to answer questions.
                  </p>
                  <Button asChild>
                    <Link to="/login">
                      Log In to Answer
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
