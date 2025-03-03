
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

export default function SignIn() {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <ClerkSignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}
