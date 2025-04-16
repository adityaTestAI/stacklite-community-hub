
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StackLite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
