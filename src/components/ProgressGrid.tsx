
import { FC } from 'react';
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Rocket, BookOpen, Code, Briefcase, Heart } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  level: number;
  component: React.ReactNode | null;
  icon: React.ReactNode;
  description: string;
}

interface ProgressGridProps {
  sections: Section[];
  currentLevel: number;
}

const ProgressGrid: FC<ProgressGridProps> = ({ sections, currentLevel }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Votre progression</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`border rounded-lg p-6 transition-all duration-500 ${
              currentLevel >= section.level 
                ? 'bg-card hover:shadow-md cursor-pointer' 
                : 'opacity-40 filter blur-[1px] pointer-events-none bg-gray-100 dark:bg-gray-800'
            }`}
            onClick={() => scrollToSection(section.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${
                currentLevel >= section.level ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">Niveau {section.level}</p>
              </div>
            </div>
            <p className="text-muted-foreground">{section.description}</p>
            {currentLevel < section.level && (
              <Badge variant="outline" className="mt-4">
                Débloqué au niveau {section.level}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressGrid;
