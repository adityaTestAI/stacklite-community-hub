
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageSquare, Tag, Users, Code, LightbulbIcon, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px-72px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-slate-900 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Developer <span className="text-orange-500">Q&A</span> <br />
                Platform for <br />
                Everyone
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                A community-driven platform for asking programming questions, sharing knowledge, and building your developer reputation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link to="/posts/ask" className="flex items-center gap-2">
                    Ask a Question
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/posts" className="flex items-center gap-2">
                    Browse Questions
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-md"
            >
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-60 h-40 bg-orange-500/20 rounded-lg transform rotate-6"></div>
                <div className="absolute top-10 -right-5 w-60 h-40 bg-orange-500/10 rounded-lg transform -rotate-3"></div>
                <div className="relative bg-gray-800/70 backdrop-blur p-6 rounded-lg border border-gray-700 shadow-xl">
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-3 bg-orange-500/80 rounded-full"></div>
                    <div className="w-3/4 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-5/6 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-2/3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-32 -right-10 bg-gray-800/70 backdrop-blur p-4 rounded-lg border border-gray-700 shadow-xl">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-2 bg-orange-500/80 rounded-full"></div>
                  <div className="w-3/4 h-2 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-gray-800/70 backdrop-blur p-5 rounded-lg border border-gray-700 shadow-xl">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-2 bg-orange-500/80 rounded-full"></div>
                  <div className="w-full h-2 bg-gray-600 rounded-full"></div>
                  <div className="w-3/4 h-2 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Our platform connects developers to share knowledge and build better solutions together.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Ask Questions",
                description: "Post your programming questions and get help"
              },
              {
                icon: Code,
                title: "Share Knowledge",
                description: "Answer questions and help fellow developers"
              },
              {
                icon: Users,
                title: "Join Community",
                description: "Connect with other developers and build your network"
              },
              {
                icon: Tag,
                title: "Browse by Tags",
                description: "Find content that matters to you by filtering tags"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-background rounded-lg p-6 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <item.icon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to join the community?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Start asking questions, providing answers, and connecting with developers worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link to={currentUser ? "/posts" : "/login"} className="flex items-center gap-2">
                {currentUser ? "Browse Questions" : "Join Now"}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
