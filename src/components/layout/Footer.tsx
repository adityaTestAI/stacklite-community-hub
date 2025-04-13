
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} StackLite. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link to="/posts" className="text-sm text-muted-foreground hover:text-foreground">
              Posts
            </Link>
            <Link to="/tags" className="text-sm text-muted-foreground hover:text-foreground">
              Tags
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
