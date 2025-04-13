
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tag } from "@/types";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import TagIcon from "@/components/tag/TagIcon";
import { getAllTags } from "@/api/tags";
import { useToast } from "@/hooks/use-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const tagsData = await getAllTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast({
          title: "Error",
          description: "Failed to load tags. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [toast]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-6"
      >
        Tags
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Filter tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="animate-pulse h-24 bg-secondary rounded"
            ></motion.div>
          ))}
        </div>
      ) : filteredTags.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredTags.map((tag) => (
            <motion.div key={tag.id} variants={item}>
              <Link
                to={`/posts?tag=${tag.name}`}
                className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-start"
              >
                <TagIcon tagName={tag.name} className="mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-1">{tag.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tag.count} {tag.count === 1 ? "post" : "posts"}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <h3 className="text-lg font-medium mb-2">No tags found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search to find what you're looking for.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tags;
