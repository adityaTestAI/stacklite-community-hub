
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

interface AuthModalProps {
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Welcome to StackLite</h2>
      <Tabs 
        defaultValue="login" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm onSuccess={onSuccess} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm onSuccess={() => setActiveTab("login")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthModal;
