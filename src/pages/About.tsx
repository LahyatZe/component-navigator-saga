
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">À Propos de Moi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Développeur passionné spécialisé dans le développement web et les solutions d'entreprise
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-12 max-w-4xl mx-auto">
          {/* Professional Journey */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Mon Parcours</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Je suis un développeur web avec une solide expérience dans la création de solutions 
                  numériques innovantes. Mon parcours m'a permis de travailler sur des projets variés, 
                  de la gestion d'intervention en temps réel aux applications bancaires sécurisées.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Skills Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Compétences Techniques</h2>
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3">Langages & Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Angular", "TypeScript", "React.js", "Express.js", "SQL"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3">Outils & Plateformes</h3>
                  <div className="flex flex-wrap gap-2">
                    {["GitLab", "PWA", "Sage 100", "PhpMetrics", "Phpstan"].map((tool) => (
                      <Badge key={tool} variant="secondary">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Experience Highlights */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Points Forts</h2>
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                    <li>Développement de solutions PWA avec synchronisation en temps réel</li>
                    <li>Expertise en tests et optimisation de performances</li>
                    <li>Expérience dans le secteur bancaire avec focus sur la sécurité</li>
                    <li>Capacité à travailler en autonomie et en équipe</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Philosophy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Ma Philosophie</h2>
            <Card>
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
