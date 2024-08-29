import React, { useState, useEffect } from "react";
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
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  TriangleAlert,
  Check,
  X,
  User,
} from "lucide-react";
import { SignInFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
    isLongEnough: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      hasCapital: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLongEnough: password.length >= 8,
    });
  }, [password]);

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError("Password does not meet all requirements");
      return;
    }

    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Failed to create account");
      })
      .finally(() => setPending(false));
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="text-green-500" size={16} />
      ) : (
        <X className="text-red-500" size={16} />
      )}
      <span className={met ? "text-green-500" : "text-red-500"}>{text}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to create your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
              <TriangleAlert className="size-4" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={onPasswordSignUp} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  disabled={pending}
                  placeholder="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                />
              </div>
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
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  disabled={pending}
                  placeholder="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <PasswordRequirement
                met={passwordRequirements.isLongEnough}
                text="At least 8 characters long"
              />
              <PasswordRequirement
                met={passwordRequirements.hasCapital}
                text="Contains a capital letter"
              />
              <PasswordRequirement
                met={passwordRequirements.hasNumber}
                text="Contains a number"
              />
              <PasswordRequirement
                met={passwordRequirements.hasSpecial}
                text="Contains a special character"
              />
            </div>
            <Button
              disabled={
                pending || !Object.values(passwordRequirements).every(Boolean)
              }
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </form>
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={pending}
              variant="outline"
              className="w-full"
              onClick={() => onProviderSignUp("google")}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              disabled={pending}
              variant="outline"
              className="w-full"
              onClick={() => onProviderSignUp("github")}
            >
              <FaGithub className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => setState("signIn")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpCard;
