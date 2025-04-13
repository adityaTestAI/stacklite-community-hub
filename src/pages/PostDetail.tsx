
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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

// Mock data (in a real app, this would come from an API)
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "How to optimize React performance with useCallback?",
    content: "I'm trying to understand the best practices for optimizing React components using useCallback. When should I use it and when is it unnecessary?\n\nI have a component with multiple functions, and I'm not sure if I should wrap all of them with useCallback or only specific ones. Also, I'm curious about the performance impact of using useCallback vs not using it.\n\nHere's a simplified example of my component:\n\n```jsx\nfunction MyComponent({ data, onItemSelect }) {\n  const handleClick = () => {\n    console.log('Button clicked');\n  };\n\n  const processData = () => {\n    return data.map(item => ({ ...item, processed: true }));\n  };\n\n  const filteredData = processData();\n\n  return (\n    <div>\n      <button onClick={handleClick}>Click me</button>\n      <ItemList items={filteredData} onItemSelect={onItemSelect} />\n    </div>\n  );\n}\n```\n\nShould I wrap `handleClick` and `processData` with useCallback? Are there any other optimizations I should consider?",
    authorId: "user1",
    authorName: "John Doe",
    createdAt: "2023-05-15T10:30:00Z",
    tags: ["react", "javascript", "hooks"],
    upvotes: 24,
    views: 156,
    answers: [
      {
        id: "a1",
        content: "useCallback is best used when you have functions that are passed as props to child components that rely on referential equality to prevent unnecessary re-renders.\n\nIn your example, you should use useCallback for `handleClick` only if the `button` component is memoized (using React.memo) and it depends on the reference equality of the onClick prop.\n\nFor `processData`, it's a better practice to use `useMemo` rather than `useCallback` since you're returning data, not a function. This would look like:\n\n```jsx\nconst processData = useMemo(() => {\n  return data.map(item => ({ ...item, processed: true }));\n}, [data]);\n```\n\nThis way, `processData` will only be recalculated when `data` changes, which can improve performance if the data processing is expensive.\n\nRemember, premature optimization can make your code more complex without measurable benefits. I recommend using the React DevTools Profiler to identify actual performance bottlenecks before applying these optimizations.",
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
  }
];

const PostDetail = () => {
  const { currentUser } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("answers");

  useEffect(() => {
    // In a real app, we would fetch the post from an API
    // For now, we'll use mock data
    const fetchPost = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundPost = MOCK_POSTS.find(p => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
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

    // In a real app, we would call an API to upvote the post
    toast({
      title: "Post upvoted",
      description: "Thank you for your contribution!",
    });
  };

  const handleSubmitAnswer = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to log in to answer questions.",
        variant: "destructive",
      });
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would call an API to submit the answer
    const answer: Answer = {
      id: `a${Math.random().toString(36).substring(7)}`,
      content: newAnswer,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || "Anonymous",
      createdAt: new Date().toISOString(),
      upvotes: 0
    };

    setPost(prev => {
      if (!prev) return null;
      return {
        ...prev,
        answers: [...prev.answers, answer]
      };
    });

    setNewAnswer("");
    setActiveTab("answers");

    toast({
      title: "Answer submitted",
      description: "Your answer has been posted successfully."
    });
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
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 bg-secondary/30 border-t flex flex-wrap gap-4 justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} name={tag} />
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
                          {answer.content.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
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
                  <Textarea
                    placeholder="Write your answer here..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={8}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSubmitAnswer}>
                      Submit Answer
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
