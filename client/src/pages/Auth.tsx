import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Chrome, Github, Facebook, User } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Auth = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  const handleGuestSignIn = () => {
    localStorage.setItem("user", JSON.stringify({ email: "guest@example.com", name: "Guest User" }));
    toast.success("Welcome! You're now signed in as a Guest.");
    navigate(isMobile ? "/dashboard" : "/game");
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div
        className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-gradient-to-br from-[#ff7e5f] to-[#feb47b] p-12 text-white"
      >
        <div className="text-center">
          <div className="inline-block bg-white/20 p-6 rounded-full mb-6">
            <Search className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">ImageSearch</h1>
          <p className="text-xl">Discover. Search. Inspire.</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-balance text-muted-foreground">
              Choose your preferred login method to continue
            </p>
          </div>
          <div className="grid gap-4">
            <Button onClick={handleGoogleSignIn} className="w-full h-12 text-base font-semibold bg-white text-black hover:bg-primary/90 " variant="outline">
              <Chrome className="mr-2 h-5 w-5" />
              Login with Google
            </Button>
            <Button onClick={() => (window.location.href = "http://localhost:8080/api/auth/github")} variant="outline" className="w-full h-12 text-base font-semibold hover:shadow-md transition-shadow hover:bg-primary/90 ">
              <Github className="mr-2 h-5 w-5" />
              Login with Github
            </Button>
            <Button onClick={() => (window.location.href = "http://localhost:8080/api/auth/facebook")} variant="outline" className="w-full h-12 text-base font-semibold hover:shadow-md transition-shadow hover:bg-primary/90 ">
              <Facebook className="mr-2 h-5 w-5" />
              Login with Facebook
            </Button>
            <Button onClick={handleGuestSignIn} variant="outline" className="w-full h-12 text-base font-semibold hover:shadow-md transition-shadow">
              <User className="mr-2 h-5 w-5" />
              Login as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
