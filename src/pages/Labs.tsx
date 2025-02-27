
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lightbulb, Code, BookOpen, Heart, ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface LabProject {
  id: number;
  title: string;
  description: string;
  type: 'experiment' | 'article';
  tags: string[];
  date: string;
  readTime?: string;
  demoUrl?: string;
  codeUrl?: string;
  content?: string;
  image: string;
  featured?: boolean;
}

const labProjects: LabProject[] = [
  {
    id: 1,
    title: "Intégration d'un système de gamification dans un portfolio",
    description: "Comment j'ai transformé mon portfolio en une expérience ludique et immersive pour les recruteurs",
    type: 'article',
    tags: ['React', 'TypeScript', 'Gamification', 'UI/UX'],
    date: '24 mai 2024',
    readTime: '8 min',
    content: `
      # Créer une expérience immersive avec la gamification

      La gamification consiste à appliquer des éléments de jeu à des contextes non ludiques pour améliorer l'engagement des utilisateurs. Pour mon portfolio, j'ai choisi d'implémenter un système de niveaux progressifs qui débloque du contenu au fur et à mesure que l'utilisateur interagit avec le site.

      ## Les composants clés de mon système

      1. **Système de progression par niveaux** : Les visiteurs commencent au niveau 0 et peuvent progresser jusqu'au niveau 4, débloquant davantage de contenu à chaque niveau.
      
      2. **Quiz interactifs** : Pour passer d'un niveau à l'autre, les utilisateurs doivent répondre correctement à des quiz sur mon parcours et mes compétences.
      
      3. **Badges et récompenses** : Des succès sont débloqués à mesure que les utilisateurs progressent, créant un sentiment d'accomplissement.
      
      ## Défis techniques

      Le principal défi technique consistait à créer un système de sauvegarde de la progression qui fonctionne de manière fluide. J'ai utilisé une combinaison de localStorage et d'authentification pour conserver l'état de progression des utilisateurs.

      ## Impact sur l'engagement

      Les premiers résultats sont prometteurs : le temps moyen passé sur le portfolio a augmenté de 82%, et les recruteurs ont laissé des commentaires positifs sur l'originalité de l'approche.
    `,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    featured: true
  },
  {
    id: 2,
    title: "Application de visualisation de données avec D3.js et React",
    description: "Expérimentation sur l'intégration de D3.js dans une application React pour créer des visualisations de données interactives",
    type: 'experiment',
    tags: ['D3.js', 'React', 'Data Visualization', 'SVG'],
    date: '10 avril 2024',
    demoUrl: 'https://example.com/demo/d3-react',
    codeUrl: 'https://github.com/example/d3-react-experiment',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  },
  {
    id: 3,
    title: "Performance des applications React: techniques d'optimisation",
    description: "Comment j'ai amélioré les performances d'une application React avec des techniques avancées d'optimisation",
    type: 'article',
    tags: ['React', 'Performance', 'Optimization', 'Web Vitals'],
    date: '2 mars 2024',
    readTime: '12 min',
    content: `
      # Optimisation des performances dans React
      
      Les performances sont cruciales pour offrir une bonne expérience utilisateur. Dans cet article, je partage les techniques que j'ai utilisées pour optimiser une application React complexe.
      
      ## 1. Memoization avec useMemo et useCallback
      
      React propose plusieurs hooks pour éviter les calculs ou rendus inutiles. Voici comment j'ai utilisé useMemo pour optimiser un calcul coûteux :
      
      \`\`\`jsx
      // Avant optimisation
      const sortedItems = items.sort((a, b) => a.value - b.value);
      
      // Après optimisation
      const sortedItems = useMemo(() => {
        return items.sort((a, b) => a.value - b.value);
      }, [items]);
      \`\`\`
      
      ## 2. Virtualisation des listes
      
      Pour afficher de grandes listes, j'ai utilisé react-window pour ne rendre que les éléments visibles dans la fenêtre d'affichage.
      
      ## 3. Code-splitting et lazy loading
      
      J'ai implémenté le code-splitting pour diviser l'application en chunks plus petits chargés uniquement lorsque nécessaire :
      
      \`\`\`jsx
      const Dashboard = React.lazy(() => import('./Dashboard'));
      
      function App() {
        return (
          <Suspense fallback={<Spinner />}>
            <Dashboard />
          </Suspense>
        );
      }
      \`\`\`
      
      ## Résultats
      
      Ces optimisations ont réduit le temps de chargement initial de 42% et amélioré le First Input Delay de 78%, offrant une expérience beaucoup plus fluide aux utilisateurs.
    `,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  {
    id: 4,
    title: "Interface de commande vocale avec Web Speech API",
    description: "Prototype d'interface utilisateur contrôlable par commandes vocales utilisant l'API Web Speech",
    type: 'experiment',
    tags: ['JavaScript', 'Web Speech API', 'Accessibility', 'UX'],
    date: '15 janvier 2024',
    demoUrl: 'https://example.com/demo/voice-ui',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  }
];

const Labs: FC = () => {
  const [selectedProject, setSelectedProject] = useState<LabProject | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredProjects = activeTab === 'all' 
    ? labProjects 
    : labProjects.filter(project => project.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">Recherche & Expérimentations</Badge>
        <h1 className="text-4xl font-bold mb-4">Labs & Articles</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez mes expérimentations techniques, prototypes et articles sur le développement web et les technologies émergentes.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Tous
            </TabsTrigger>
            <TabsTrigger value="experiment" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Expérimentations
            </TabsTrigger>
            <TabsTrigger value="article" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          {/* Featured Project */}
          {labProjects.filter(p => p.featured).map(project => (
            <div 
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 border p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 mb-12"
            >
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Badge variant="secondary" className="mb-2 w-fit">À la une</Badge>
                <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {project.date}
                  </div>
                  {project.readTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {project.readTime} de lecture
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-2 w-fit"
                >
                  Lire l'article <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => !p.featured).map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={project.type === 'experiment' ? 'default' : 'secondary'}>
                      {project.type === 'experiment' ? 'Expérimentation' : 'Article'}
                    </Badge>
                  </div>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline">+{project.tags.length - 3}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {project.date}
                    </div>
                    {project.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {project.readTime}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  {project.type === 'experiment' ? (
                    <div className="flex gap-3">
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Demo
                          </a>
                        </Button>
                      )}
                      {project.codeUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Code className="w-4 h-4" /> Code
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center gap-2"
                    >
                      Lire l'article <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiment">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge variant="default" className="mb-2 w-fit">Expérimentation</Badge>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" /> {project.date}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex gap-3">
                    {project.demoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Demo
                        </a>
                      </Button>
                    )}
                    {project.codeUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Code className="w-4 h-4" /> Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="article">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">Article</Badge>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {project.date}
                    </div>
                    {project.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {project.readTime}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-2"
                  >
                    Lire l'article <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Article</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" /> {selectedProject.date}
                </div>
                {selectedProject.readTime && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {selectedProject.readTime}
                  </div>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
              <DialogDescription>{selectedProject.description}</DialogDescription>
              <div className="flex flex-wrap gap-2 my-4">
                {selectedProject.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </DialogHeader>
            <div className="mt-4">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              {selectedProject.content && (
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  {selectedProject.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold my-4">{paragraph.substring(2)}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold my-3">{paragraph.substring(3)}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-bold my-2">{paragraph.substring(4)}</h3>;
                    } else if (paragraph.startsWith('```')) {
                      return (
                        <pre key={index} className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
                          <code>{paragraph.replace('```jsx', '').replace('```', '')}</code>
                        </pre>
                      );
                    } else if (paragraph.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className="my-2">{paragraph}</p>;
                    }
                  })}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Labs;
