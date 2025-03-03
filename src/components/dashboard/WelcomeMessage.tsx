
import { FC } from 'react';
import { useUser } from '@clerk/clerk-react';

const WelcomeMessage: FC = () => {
  const { user } = useUser();
  
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-muted-foreground">
        Bienvenue {user?.firstName || 'utilisateur'}, voici un aperçu de votre parcours d'apprentissage.
      </p>
    </div>
  );
};

export default WelcomeMessage;
