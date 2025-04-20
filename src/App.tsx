
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "@/pages/Index";
import Posts from "@/pages/Posts";
import PostDetail from "@/pages/PostDetail";
import AskQuestion from "@/pages/AskQuestion";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Tags from "@/pages/Tags";
import "./App.css";
import "./styles/theme-toggle.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/ask" element={<AskQuestion />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
