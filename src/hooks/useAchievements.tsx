
import { useState, useEffect } from 'react';
import { Trophy, Star, Code, Award, Rocket, Heart } from 'lucide-react';
import { UserProgress } from './useProgressPersistence';

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

export const useAchievements = (progress: UserProgress, userId?: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'profile_created',
      title: 'Premier Pas',
      description: 'Création de votre profil et connexion réussie',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      unlocked: false,
      rarity: 'common',
      category: 'progression'
    },
    {
      id: 'level_1',
      title: 'Apprenti',
      description: 'Vous avez débloqué le niveau 1',
      icon: <Star className="w-5 h-5 text-blue-500" />,
      unlocked: false,
      rarity: 'common',
      category: 'progression'
    },
    {
      id: 'level_2',
      title: 'Développeur',
      description: 'Vous avez débloqué le niveau 2',
      icon: <Code className="w-5 h-5 text-green-500" />,
      unlocked: false,
      rarity: 'uncommon',
      category: 'progression'
    },
    {
      id: 'level_3',
      title: 'Expert',
      description: 'Vous avez débloqué le niveau 3',
      icon: <Award className="w-5 h-5 text-purple-500" />,
      unlocked: false,
      rarity: 'rare',
      category: 'progression'
    },
    {
      id: 'level_4',
      title: 'Maître',
      description: 'Vous avez débloqué le niveau 4 (niveau maximum)',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      unlocked: false,
      rarity: 'epic',
      category: 'progression'
    },
    {
      id: 'all_sections',
      title: 'Explorateur',
      description: 'Vous avez visité toutes les sections du portfolio',
      icon: <Rocket className="w-5 h-5 text-red-500" />,
      unlocked: false,
      rarity: 'uncommon',
      category: 'exploration'
    }
  ]);

  useEffect(() => {
    if (userId) {
      const updatedAchievements = [...achievements];
      
      updatedAchievements[0].unlocked = true;
      
      if (progress.currentLevel >= 1) updatedAchievements[1].unlocked = true;
      if (progress.currentLevel >= 2) updatedAchievements[2].unlocked = true;
      if (progress.currentLevel >= 3) updatedAchievements[3].unlocked = true;
      
      const visitedAllSections = progress.currentLevel >= 4;
      updatedAchievements[4].unlocked = visitedAllSections;
      
      setAchievements(updatedAchievements);
    }
  }, [progress, userId]);

  return { achievements, setAchievements };
};
