
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Tag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px-72px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to StackLite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A community-driven platform for developers to ask questions, share knowledge, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/posts">
                Browse Questions
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={currentUser ? "/posts/ask" : "/login"}>
                Ask a Question
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            How StackLite Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Questions</h3>
              <p className="text-muted-foreground">
                Ask the community about coding problems, best practices, or technical concepts.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Answers</h3>
              <p className="text-muted-foreground">
                Receive solutions from experienced developers in the community.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Tag className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Use Tags</h3>
              <p className="text-muted-foreground">
                Find relevant content with tags categorizing questions by technology or topic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to join the community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start asking questions, providing answers, and connecting with developers worldwide.
          </p>
          <Button asChild size="lg">
            <Link to={currentUser ? "/posts" : "/login"} className="flex items-center gap-2">
              {currentUser ? "Browse Questions" : "Join Now"}
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
