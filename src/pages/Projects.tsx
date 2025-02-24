
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, Globe, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform built with React and Node.js",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Personal portfolio website showcasing my projects and skills",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A collaborative task management application",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    technologies: ["React", "Firebase", "Material-UI"],
    githubUrl: "https://github.com",
  }
];

const Projects: FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);

  // Get unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects based on selected technology
  useEffect(() => {
    const filtered = selectedTech
      ? projects.filter(project => project.technologies.includes(selectedTech))
      : projects;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project, index) => (
          <Card 
            key={project.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in"
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
