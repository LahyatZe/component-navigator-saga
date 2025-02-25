
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Brain, Lightbulb, Target } from "lucide-react";

const About: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in mb-8">
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
                  numériques innovantes. Mon parcours m'a permis de travailler sur des projets variés, 
                  de la gestion d'intervention en temps réel aux applications bancaires sécurisées.
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
                    {["Angular", "TypeScript", "React.js", "Express.js", "SQL"].map((skill) => (
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
                    {["GitLab", "PWA", "Sage 100", "PhpMetrics", "Phpstan"].map((tool) => (
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
                    "Expertise en tests et optimisation de performances",
                    "Expérience dans le secteur bancaire avec focus sur la sécurité",
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
                  Mon approche combine rigueur technique et focus sur l'expérience utilisateur.
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
