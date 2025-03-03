
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <ClerkSignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
          navigate={(to) => navigate(to)}
        />
      </div>
    </div>
  );
}
