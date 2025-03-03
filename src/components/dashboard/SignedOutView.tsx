
import { FC } from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";

const SignedOutView: FC = () => {
  return (
    <div className="text-center py-16 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Connectez-vous pour accéder à votre tableau de bord</h2>
      <p className="text-muted-foreground mb-8">
        Suivez votre progression, consultez vos cours et accédez à toutes les fonctionnalités
        en créant un compte ou en vous connectant.
      </p>
      <SignInButton>
        <Button size="lg">Se connecter</Button>
      </SignInButton>
    </div>
  );
};

export default SignedOutView;
