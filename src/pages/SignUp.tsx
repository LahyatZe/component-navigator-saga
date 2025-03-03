
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export default function SignUp() {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        <ClerkSignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
}
