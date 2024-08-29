import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Eye, EyeOff, TriangleAlert } from "lucide-react";
import { SignInFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => setPending(false));
  };

  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 ">
              <TriangleAlert className="size-4" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={onPasswordSignIn} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  disabled={pending}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  disabled={pending}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              disabled={pending}
              type="submit"
              className="w-full bg-[#3F0E40] hover:bg-[#320a33] text-white"
            >
              Sign In
            </Button>
          </form>
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={pending}
              variant="outline"
              className="w-full"
              onClick={() => onProviderSignIn("google")}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              disabled={pending}
              variant="outline"
              className="w-full"
              onClick={() => onProviderSignIn("github")}
            >
              <FaGithub className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => setState("signUp")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInCard;
