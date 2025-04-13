
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Tag, ArrowRight, Code, Users, BookOpen, Award, CheckSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px-72px)] flex flex-col">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 py-16 px-4"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Welcome to StackLite
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            A community-driven platform for developers to ask questions, share knowledge, and grow together.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
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
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="py-16 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            variants={item}
            className="text-3xl font-bold text-center mb-10"
          >
            How StackLite Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={item} className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Questions</h3>
              <p className="text-muted-foreground">
                Ask the community about coding problems, best practices, or technical concepts.
              </p>
            </motion.div>
            <motion.div variants={item} className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Answers</h3>
              <p className="text-muted-foreground">
                Receive solutions from experienced developers in the community.
              </p>
            </motion.div>
            <motion.div variants={item} className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Tag className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Use Tags</h3>
              <p className="text-muted-foreground">
                Find relevant content with tags categorizing questions by technology or topic.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/5 py-12 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-10">Why Developers Trust StackLite</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold mb-2">1.2M+</p>
              <p className="text-muted-foreground">Questions Asked</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">800K+</p>
              <p className="text-muted-foreground">Answers Provided</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">300K+</p>
              <p className="text-muted-foreground">Developers</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">50K+</p>
              <p className="text-muted-foreground">Topics Covered</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="py-16 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            variants={item}
            className="text-3xl font-bold text-center mb-12"
          >
            Benefits of Joining Our Community
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={item} className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                <Code className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Learn From Others</h3>
                <p className="text-muted-foreground">
                  Gain insights from experienced developers who have faced similar challenges.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item} className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                <Users className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Your Network</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded developers and expand your professional circle.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item} className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                <BookOpen className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
                <p className="text-muted-foreground">
                  Help others by sharing your expertise and solidify your understanding.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item} className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                <Award className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Earn Recognition</h3>
                <p className="text-muted-foreground">
                  Gain reputation as you contribute quality answers and help the community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/5 py-16 px-4 mt-auto"
      >
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
      </motion.section>
    </div>
  );
};

export default Index;
