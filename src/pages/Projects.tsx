
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, Globe, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import './Project.css';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  company: string;
  period: string;
  keyAchievements?: string[];
  details?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "ICY - Solution de gestion d'intervention",
    description: "Développement d'une solution de gestion d'intervention avec synchronisation en temps réel avec Sage 100, permettant la gestion des plannings, la géolocalisation et la saisie de comptes rendus.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    technologies: ["Angular", "TypeScript", "PWA", "Sage 100"],
    company: "Parthena Consultant",
    period: "Février 2024 - Août 2024",
    keyAchievements: [
      "Développement d'un éditeur WYSIWYG avancé",
      "Personnalisation des onglets dans la PWA",
      "Sauvegarde automatique des brouillons",
      "Suppression de masse des éléments",
      "Communication personnalisée après appel client"
    ],
    details: "Ce projet impliquait la conception et le développement d'une plateforme PWA destinée aux techniciens et aux gestionnaires. L'outil WYSIWYG permettait de structurer dynamiquement les entités et leurs données associées, offrant une flexibilité accrue aux utilisateurs. L'intégration de la sauvegarde automatique et des fonctionnalités avancées d'édition a permis d'améliorer l'expérience utilisateur et d'optimiser la gestion des interventions."
  },
  {
    id: 2,
    title: "Sam Tool Supervisor",
    description: "Participation au développement et aux tests d'un logiciel de supervision permettant aux clients de suivre l'activité de contenants automatisés intelligents.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["SQL", "GitLab", "PhpMetrics", "Phpstan"],
    company: "SAM OUTILLAGE",
    period: "Juin 2023 - Septembre 2023",
    keyAchievements: [
      "Élaboration et exécution des plans de test",
      "Maintenance et correction des bugs",
      "Analyse et rédaction de rapports d'infrastructure",
      "Support technique aux équipes internes et externes"
    ],
    details: "La phase de test a été essentielle pour assurer la fiabilité du logiciel avant chaque montée de version. L'analyse d'infrastructure avec PhpMetrics et Phpstan a permis d'optimiser le code et d'améliorer la stabilité de l'application. Mon rôle impliquait aussi un support technique direct aux développeurs et aux équipes clients via TeamViewer."
  },
  {
    id: 3,
    title: "Crédit Agricole - Applications Web",
    description: "Travail sur le développement et la maintenance d'applications web pour la filiale Technologies & Services du Crédit Agricole.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    technologies: ["GitLab", "Web Development"],
    company: "Capgemini",
    period: "Janvier 2022 - Janvier 2023",
    details: "En tant que développeur au sein de Capgemini, j'ai travaillé sur plusieurs projets d'applications bancaires. Mon rôle consistait à développer de nouvelles fonctionnalités tout en respectant les exigences de sécurité et de performance propres au secteur bancaire."
  },
  {
    id: 4,
    title: "MyPetsLife",
    description: "Développement de nouvelles fonctionnalités pour une plateforme de gestion des soins des animaux.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    technologies: ["Express.js", "React.js"],
    company: "MyPetsLife",
    period: "Septembre 2020 - Décembre 2020",
    details: "Ce stage m'a permis de participer activement au cycle de conception et développement de nouvelles fonctionnalités, d'explorer des approches innovantes et de travailler en autonomie sur des solutions adaptées aux besoins des utilisateurs."
  }
];

const Projects: FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>(''); // Selected technology for filter
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects); // Initially show all projects

  // Get unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects based on selected technology
  useEffect(() => {
    console.log('Filtering projects with tech:', selectedTech); // Debug logging
    const filtered = selectedTech
      ? projects.filter(project => project.technologies.includes(selectedTech))
      : projects;
    console.log('Filtered projects:', filtered); // Debug logging
    setVisibleProjects(filtered);
  }, [selectedTech]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Projects</h1>
        <p className="text-xl text-gray-600 mb-8">Here are some of my recent works</p>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedTech === '' ? "default" : "outline"}
            onClick={() => setSelectedTech('')}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            All
          </Button>
          {allTechnologies.map(tech => (
            <Button
              key={tech}
              variant={selectedTech === tech ? "default" : "outline"}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </Button>
          ))}
        </div>
      </div>

      {/* Display Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project, index) => (
          <Card 
            key={project.id} 
            className="overflow-hidden hover:opacity-100 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'forwards'
            }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video overflow-hidden cursor-pointer">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="secondary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={20} />
                    <span>Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={20} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription>
                {selectedProject.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Github size={20} />
                    <span>View Code</span>
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Globe size={20} />
                    <span>Visit Site</span>
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Projects;
