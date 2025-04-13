
import React from "react";
import { motion } from "framer-motion";
import AuthModal from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="max-w-md mx-auto bg-card rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login or Register</h1>
        <AuthModal onSuccess={() => navigate(-1)} />
      </div>
    </motion.div>
  );
};

export default Login;
