
import { FC } from 'react';
import { Trophy, Star, Code, Award, Rocket, Heart, BookOpen, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category?: 'progression' | 'exploration' | 'engagement' | 'technical' | 'social';
  unlockedAt?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: FC<AchievementsProps> = ({ achievements }) => {
  // Grouper les achievements par catégorie
  const groupedAchievements: Record<string, Achievement[]> = {};
  
  achievements.forEach((achievement) => {
    const category = achievement.category || 'progression';
    if (!groupedAchievements[category]) {
      groupedAchievements[category] = [];
    }
    groupedAchievements[category].push(achievement);
  });

  // Obtenir le nombre total d'achievements débloqués
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="bg-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">Succès débloqués</h2>
          <p className="text-muted-foreground mb-4 text-center">
            Vous avez débloqué {unlockedCount} sur {totalCount} succès ({progressPercentage}%)
          </p>
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-semibold capitalize">{category}</h3>
              <Badge variant="outline" className="ml-2">
                {categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 transition-all duration-300 hover:transform hover:-translate-y-1 ${
                    achievement.unlocked 
                      ? 'bg-card hover:shadow-md animate-fade-in' 
                      : 'opacity-50 bg-muted filter blur-[0.5px]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked ? getBadgeColorByRarity(achievement.rarity) : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      {achievement.rarity && achievement.unlocked && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.rarity}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Débloqué le {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fonction pour obtenir la couleur du badge en fonction de sa rareté
const getBadgeColorByRarity = (rarity?: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-100 dark:bg-gray-800';
    case 'uncommon': return 'bg-green-100 text-green-500 dark:bg-green-900';
    case 'rare': return 'bg-blue-100 text-blue-500 dark:bg-blue-900';
    case 'epic': return 'bg-purple-100 text-purple-500 dark:bg-purple-900';
    case 'legendary': return 'bg-amber-100 text-amber-500 dark:bg-amber-900';
    default: return 'bg-primary/10 text-primary';
  }
};

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export default Achievements;
