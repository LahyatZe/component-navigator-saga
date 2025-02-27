
import { FC } from 'react';
import { Trophy, Star, Code, Award, Rocket } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="bg-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Succès débloqués</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border rounded-lg p-4 transition-all ${
                achievement.unlocked 
                  ? 'bg-card hover:shadow-md' 
                  : 'opacity-50 bg-muted'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  {achievement.icon}
                </div>
                <h3 className="font-medium">{achievement.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
