
import { FC, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserSettings } from '@/services/user/settingsApi';

const WelcomeMessage: FC = () => {
  const { user } = useUser();
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserSettings = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const settings = await getUserSettings(user.id);
          if (settings?.fullName) {
            setFullName(settings.fullName);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des paramètres utilisateur:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserSettings();
  }, [user?.id]);

  // Déterminer le nom à afficher
  const displayName = fullName || user?.firstName || 'utilisateur';
  
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-muted-foreground">
        {isLoading ? (
          <span className="inline-block w-32 h-4 bg-muted animate-pulse rounded"></span>
        ) : (
          `Bienvenue ${displayName}, voici un aperçu de votre parcours d'apprentissage.`
        )}
      </p>
    </div>
  );
};

export default WelcomeMessage;
