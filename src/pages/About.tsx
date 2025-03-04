
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Brain, Lightbulb, Target, Briefcase, GraduationCap, Clock } from "lucide-react";

const About: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                À Propos de Moi
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Développeur passionné spécialisé dans le développement web et les solutions d'entreprise
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Grid Layout */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-16 max-w-5xl mx-auto">
          {/* Journey Section with Icon */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Mon Parcours</h2>
            </div>
            <Card className="transform transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Je suis un développeur web avec une solide expérience dans la création de solutions 
                  numériques innovantes. Mon parcours professionnel inclut des projets variés, 
                  de la gestion d'intervention en temps réel chez Parthena Consultant aux applications 
                  bancaires sécurisées pour le Crédit Agricole via Capgemini. J'ai également travaillé 
                  sur le logiciel de supervision SAM Tool Supervisor pour le suivi des contenants 
                  automatisés intelligents.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Skills Section with Two-Column Layout */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Compétences Techniques</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="transform transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4 text-lg">Langages & Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Angular", "TypeScript", "React.js", "Express.js", "SQL", "JavaScript", "HTML/CSS"].map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="px-3 py-1 text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="transform transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4 text-lg">Outils & Plateformes</h3>
                  <div className="flex flex-wrap gap-2">
                    {["GitLab", "PWA", "Sage 100", "PhpMetrics", "Phpstan", "TeamViewer", "WYSIWYG"].map((tool) => (
                      <Badge 
                        key={tool} 
                        variant="secondary"
                        className="px-3 py-1 text-sm"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Experience Highlights Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Expériences Marquantes</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="transform transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg">Developpeur Web</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2024
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Parthena Consultant</p>
                  <p className="text-sm text-muted-foreground">
                    Développement d'un outil WYSIWYG avancé pour ICY, solution de gestion d'intervention 
                    avec synchronisation en temps réel avec Sage 100.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transform transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg">Developpeur Web</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2023
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">SAM OUTILLAGE</p>
                  <p className="text-sm text-muted-foreground">
                    Participation au développement et aux tests du logiciel SAM Tool Supervisor pour 
                    le suivi des contenants automatisés intelligents.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Strengths Section with Custom List Style */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Points Forts</h2>
            </div>
            <Card className="transform transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <ul className="grid gap-4 md:grid-cols-2">
                  {[
                    "Développement de solutions PWA avec synchronisation en temps réel",
                    "Création d'interfaces WYSIWYG et éditeurs personnalisés",
                    "Expertise en tests et optimisation de performances",
                    "Expérience dans le secteur bancaire avec focus sur la sécurité",
                    "Analyse d'infrastructure et documentation technique",
                    "Capacité à travailler en autonomie et en équipe"
                  ].map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Philosophy Section with Icon */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-full bg-primary/10">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Ma Philosophie</h2>
            </div>
            <Card className="transform transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Je crois en la création de solutions qui non seulement répondent aux besoins 
                  techniques, mais qui apportent aussi une réelle valeur ajoutée aux utilisateurs. 
                  Mon approche combine rigueur technique, focus sur l'expérience utilisateur et 
                  une attention particulière à l'innovation. J'accorde une grande importance à 
                  l'analyse des besoins et à la résolution efficace des problèmes pour développer 
                  des solutions durables et évolutives.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
