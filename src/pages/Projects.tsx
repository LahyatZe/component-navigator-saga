
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, Globe, Filter, Calendar, Building, MapPin } from "lucide-react";
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
  location: string;
  period: string;
  keyAchievements?: string[];
  workType?: string; // hybride, présentiel, etc.
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
    location: "Dardilly, Auvergne-Rhône-Alpes",
    workType: "Hybride",
    period: "Février 2024 - Août 2024",
    keyAchievements: [
      "Développement d'un éditeur WYSIWYG avancé pour la création et gestion d'entités",
      "Personnalisation des onglets dans la PWA pour optimiser l'interface",
      "Sauvegarde automatique des brouillons de formulaires",
      "Fonctionnalité de suppression de masse des éléments",
      "Communications personnalisées automatiques après appel client"
    ],
    details: "ICY est une solution de gestion d'intervention hébergée en France, conçue pour fonctionner en mode connecté ou déconnecté sur tous les systèmes d'exploitation. Compatible avec smartphones, tablettes et ordinateurs, ICY garantit une expérience utilisateur fluide et un déploiement rapide. Grâce à son interface bidirectionnelle native avec Sage 100, elle offre une vision client 360° en temps réel, permettant de gérer les plannings multi-équipes, faciliter les déplacements avec la géolocalisation, et personnaliser les formulaires. L'outil WYSIWYG développé permet de créer des entités, des champs associés, des grilles personnalisées, des blocs modifiables, et des dashboards avec des graphiques."
  },
  {
    id: 2,
    title: "Sam Tool Supervisor",
    description: "Développement et tests d'un logiciel de supervision pour le suivi des contenants automatisés intelligents SAM'URAI (Unités de Rangement Automatisés Intelligents).",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["SQL", "GitLab", "PhpMetrics", "Phpstan"],
    company: "SAM OUTILLAGE",
    location: "Saint-Etienne et périphérie",
    period: "Juin 2023 - Septembre 2023",
    keyAchievements: [
      "Élaboration et exécution des plans de test pour validation des versions",
      "Maintenance et correction de la solution existante",
      "Analyse d'infrastructure et rédaction de rapports techniques",
      "Support technique aux équipes de développement et clients",
      "Élaboration de changelog et documentation technique"
    ],
    details: "SAM Outillage propose une gamme de contenants intelligents SAM'URAI. Le projet impliquait deux logiciels: STM (SAM Tool Manager) fonctionnant sur les contenants eux-mêmes, et STS (SAM Tool Supervisor) permettant aux clients de superviser l'activité des contenants. La phase de test était cruciale pour valider les montées de version et fournir des retours précis sur les problèmes. L'analyse d'infrastructure incluait la rédaction de documents techniques (SWOT, comparaisons, rapports d'audit) à l'aide d'outils comme PhpMetrics et Phpstan. Le support technique aux développeurs internes et externes ainsi qu'aux clients nécessitait l'utilisation de TeamViewer pour la maintenance à distance."
  },
  {
    id: 3,
    title: "Applications Web - Crédit Agricole",
    description: "Développement et maintenance d'applications web pour la filiale Technologies & Services du Crédit Agricole.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    technologies: ["GitLab", "Web Development"],
    company: "Capgemini",
    location: "Pérols, Occitanie",
    workType: "Hybride",
    period: "Janvier 2022 - Janvier 2023",
    details: "Mission réalisée au sein du Crédit Agricole, dans la filiale Technologies & Services. Développement et maintenance d'applications web bancaires nécessitant une attention particulière à la sécurité et aux performances. Le travail impliquait une collaboration étroite avec les équipes du client et le respect de contraintes spécifiques au secteur bancaire."
  },
  {
    id: 4,
    title: "MyPetsLife - Plateforme de gestion animalière",
    description: "Développement de nouvelles fonctionnalités pour une plateforme dédiée aux soins des animaux de compagnie.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    technologies: ["Express.js", "React.js"],
    company: "MyPetsLife",
    location: "Saint-Étienne, Auvergne-Rhône-Alpes",
    period: "Septembre 2020 - Décembre 2020",
    keyAchievements: [
      "Implication dans la chaîne de conception de nouvelles fonctionnalités",
      "Développement de fonctionnalités définies par le backlog",
      "Veille technologique pour proposer des solutions innovantes",
      "Développement en autonomie de fonctionnalités adaptées aux besoins"
    ],
    details: "Stage axé sur le développement de fonctionnalités pour une plateforme de gestion des soins animaliers. Contribution active à la conception de nouvelles idées fonctionnelles, techniques ou humaines. Développement des fonctionnalités définies par le backlog du projet. Réalisation d'une veille technologique pour identifier et implémenter des solutions innovantes répondant aux besoins spécifiés. Le travail en autonomie a permis de développer des compétences en prise de décision et en résolution de problèmes."
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
        <h1 className="text-4xl font-bold mb-4">Mes Projets Professionnels</h1>
        <p className="text-xl text-muted-foreground mb-8">Découvrez mes réalisations et expériences récentes</p>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedTech === '' ? "default" : "outline"}
            onClick={() => setSelectedTech('')}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Tous
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
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building size={16} />
                  {project.company}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {project.period.split(" - ")[0]}
                </span>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedProject.company}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{selectedProject.period}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{selectedProject.location}</span>
                </div>
                
                {selectedProject.workType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedProject.workType}</Badge>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedProject.details && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Détails du projet</h3>
                  <p className="text-muted-foreground">{selectedProject.details}</p>
                </div>
              )}
              
              {selectedProject.keyAchievements && selectedProject.keyAchievements.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Réalisations clés</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedProject.keyAchievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Github size={20} />
                    <span>Voir le code</span>
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
                    <span>Démo live</span>
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
