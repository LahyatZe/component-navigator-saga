import { FC } from 'react';
import { UserProgress as UserProgressType } from '@/hooks/useProgressPersistence';
import Timeline from '@/components/Timeline';
import Achievements, { Achievement } from '@/components/Achievements';
import ProgressGrid from '@/components/ProgressGrid';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import { BookOpen, Heart, Code, Briefcase, Rocket } from 'lucide-react';

interface UserProgressProps {
  progress: UserProgressType;
  isSignedIn: boolean;
  isLoaded: boolean;
  achievements: Achievement[];
}

export const timelineEvents = [
  {
    id: "timeline-1",
    year: "2018",
    title: "Baccalauréat ES",
    subtitle: "Lycée Jean Monnet, Saint-Étienne",
    description: "Obtention du baccalauréat économique et social avec mention, option mathématiques.",
    type: "education" as const
  },
  {
    id: "timeline-2",
    year: "2019",
    title: "Début d'études en informatique",
    subtitle: "IUT de Saint-Étienne",
    description: "Premier pas dans l'univers du développement informatique avec des projets pratiques en programmation.",
    type: "education" as const
  },
  {
    id: "timeline-3",
    year: "2020",
    title: "Stage chez MyPetsLife",
    subtitle: "Développeur web junior",
    description: "Développement d'une application web avec Express.js et React.js pour une startup de services pour animaux de compagnie.",
    type: "work" as const
  },
  {
    id: "timeline-4",
    year: "2021",
    title: "Alternance chez Capgemini",
    subtitle: "Développeur full-stack",
    description: "Participation au développement d'applications bancaires sécurisées avec des technologies modernes.",
    type: "work" as const
  },
  {
    id: "timeline-5",
    year: "2022",
    title: "Titre RNCP Niveau 5",
    subtitle: "Développeur Web",
    description: "Obtention du titre professionnel reconnu attestant de mes compétences en développement web moderne.",
    type: "certification" as const
  },
  {
    id: "timeline-6",
    year: "2023",
    title: "Projet Sam Tool Supervisor",
    subtitle: "Développeur principal",
    description: "Conception et développement d'un logiciel de supervision pour suivre l'activité de contenants automatisés intelligents.",
    type: "work" as const
  },
  {
    id: "timeline-7",
    year: "2024",
    title: "Projet ICY - Solution de gestion",
    subtitle: "Lead Developer",
    description: "Développement d'une application PWA avec Angular pour la gestion d'interventions techniques en milieu industriel.",
    type: "work" as const
  }
];

export const sections = [
  {
    id: 'hero',
    title: 'Accueil',
    level: 0,
    component: null,
    icon: <Rocket className="w-6 h-6" />,
    description: "Bienvenue dans mon univers professionnel. C'est ici que commence votre aventure."
  },
  {
    id: 'timeline',
    title: 'Parcours',
    level: 0,
    component: null,
    icon: <BookOpen className="w-6 h-6" />,
    description: "Découvrez mon évolution professionnelle et académique à travers les années."
  },
  {
    id: 'about',
    title: 'À propos',
    level: 0,
    component: <About />,
    icon: <Heart className="w-6 h-6" />,
    description: "Apprenez-en plus sur ma personnalité, mes motivations et mes centres d'intérêt."
  },
  {
    id: 'projects',
    title: 'Projets',
    level: 0,
    component: <Projects />,
    icon: <Code className="w-6 h-6" />,
    description: "Explorez mes réalisations techniques et projets professionnels."
  },
  {
    id: 'contact',
    title: 'Contact',
    level: 0,
    component: <Contact />,
    icon: <Briefcase className="w-6 h-6" />,
    description: "Comment me contacter pour des opportunités ou des collaborations."
  }
];

const UserProgress: FC<UserProgressProps> = ({ progress, isSignedIn, isLoaded, achievements }) => {
  return (
    <>
      {/* Timeline - accessible à tous */}
      <section id="timeline" className="py-16 bg-secondary/5">
        <Timeline events={timelineEvents} unlockedYears={[]} />
      </section>

      {/* Grille de progression - accessible à tous */}
      {isSignedIn && isLoaded && (
        <ProgressGrid sections={sections} currentLevel={0} />
      )}

      {/* Badges - uniquement pour les utilisateurs connectés */}
      {isSignedIn && isLoaded && (
        <Achievements achievements={achievements} />
      )}

      {/* Sections du portfolio - visible par tous */}
      {sections.map((section) => {
        if (section.id === 'timeline') return null; // La timeline est gérée séparément
        
        return (
          <section 
            key={section.id} 
            id={section.id} 
            className="py-20 transition-all duration-500 opacity-100"
          >
            {section.component}
          </section>
        );
      })}
    </>
  );
};

export default UserProgress;
