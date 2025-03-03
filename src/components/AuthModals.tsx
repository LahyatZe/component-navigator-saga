
import { useState, useEffect } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthModalType = "signIn" | "signUp" | null;

interface AuthModalsProps {
  isOpen: boolean;
  type: AuthModalType;
  onClose: () => void;
}

const AuthModals = ({ isOpen, type, onClose }: AuthModalsProps) => {
  const [activeType, setActiveType] = useState<AuthModalType>(type);
  
  // Update activeType when type prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveType(type);
    }
  }, [isOpen, type]);

  // Switch between sign-in and sign-up
  const handleSignInLink = () => {
    setActiveType("signIn");
  };

  const handleSignUpLink = () => {
    setActiveType("signUp");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeType === "signIn" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {activeType === "signIn"
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {activeType === "signIn" ? (
            <SignIn 
              routing="path" 
              path="/sign-in"
              signUpUrl="https://steady-starling-83.accounts.dev/sign-up"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none p-0",
                  navbar: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footer: {
                    display: "none",
                  },
                  footerAction: {
                    display: "none",
                  }
                }
              }}
            />
          ) : (
            <SignUp 
              routing="path" 
              path="/sign-up"
              signInUrl="https://steady-starling-83.accounts.dev/sign-in"
              afterSignUpUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none p-0",
                  navbar: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footer: {
                    display: "none",
                  },
                  footerAction: {
                    display: "none",
                  }
                }
              }}
            />
          )}
          
          <div className="mt-4 text-center text-sm">
            {activeType === "signIn" ? (
              <p>
                Don't have an account?{" "}
                <a 
                  href="https://steady-starling-83.accounts.dev/sign-up"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a 
                  href="https://steady-starling-83.accounts.dev/sign-in"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals;
