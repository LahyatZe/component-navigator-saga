
import { FC, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Search, Tag, ThumbsUp, Eye, MessageCircle, Filter, ArrowUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Données simulées pour les discussions
const forumTopics = [
  {
    id: '1',
    title: 'Comment structurer un projet React pour la maintenabilité ?',
    author: 'Sophie Martin',
    authorRole: 'Étudiante',
    category: 'react',
    content: 'Je commence un projet React assez conséquent et je me demande quelle serait la meilleure structure de dossiers et fichiers pour assurer une bonne maintenabilité sur le long terme. Des conseils ?',
    tags: ['react', 'architecture', 'best-practices'],
    upvotes: 24,
    replies: 8,
    views: 145,
    createdAt: '2023-06-15T10:30:00.000Z'
  },
  {
    id: '2',
    title: 'Problème avec les closures en JavaScript',
    author: 'Thomas Bernard',
    authorRole: 'Instructeur',
    category: 'javascript',
    content: 'Je n\'arrive pas à comprendre pourquoi ma variable est undefined dans ma fonction. Je pense que c\'est lié aux closures mais je ne trouve pas la solution. Voici mon code...',
    tags: ['javascript', 'closures', 'debugging'],
    upvotes: 12,
    replies: 5,
    views: 87,
    createdAt: '2023-06-10T14:20:00.000Z'
  },
  {
    id: '3',
    title: 'Ressources pour apprendre Python et le Machine Learning',
    author: 'Julie Dubois',
    authorRole: 'Étudiante',
    category: 'python',
    content: 'Je cherche des ressources de qualité pour apprendre Python spécifiquement pour le Machine Learning. Des recommandations de livres, cours en ligne ou tutoriels ?',
    tags: ['python', 'machine-learning', 'resources'],
    upvotes: 31,
    replies: 12,
    views: 203,
    createdAt: '2023-06-05T09:45:00.000Z'
  },
  {
    id: '4',
    title: 'Différence entre Flexbox et Grid en CSS',
    author: 'Alex Rodriguez',
    authorRole: 'Étudiant',
    category: 'css',
    content: 'J\'ai du mal à comprendre quand utiliser Flexbox et quand utiliser Grid pour mes layouts. Pouvez-vous m\'expliquer les cas d\'usage de chacun et leurs avantages respectifs ?',
    tags: ['css', 'flexbox', 'grid', 'layout'],
    upvotes: 18,
    replies: 7,
    views: 120,
    createdAt: '2023-06-02T16:15:00.000Z'
  },
  {
    id: '5',
    title: 'Comment optimiser les performances d\'une application React ?',
    author: 'Marie Lefebvre',
    authorRole: 'Développeuse Senior',
    category: 'react',
    content: 'Mon application React commence à être lente, surtout sur les listes avec beaucoup d\'éléments. Quelles sont les meilleures pratiques pour optimiser les performances ?',
    tags: ['react', 'performance', 'optimization'],
    upvotes: 42,
    replies: 15,
    views: 267,
    createdAt: '2023-05-28T11:30:00.000Z'
  }
];

interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: string;
  content: string;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  createdAt: string;
}

const Community: FC = () => {
  const { isSignedIn, user } = useUser();
  const [topics, setTopics] = useState<ForumTopic[]>(forumTopics);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  
  const filterTopics = (term: string) => {
    if (!term.trim()) {
      setTopics(forumTopics);
      return;
    }
    
    const filtered = forumTopics.filter(
      topic => 
        topic.title.toLowerCase().includes(term.toLowerCase()) ||
        topic.content.toLowerCase().includes(term.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
    );
    
    setTopics(filtered);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterTopics(term);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'html': return { variant: 'outline', bg: 'bg-orange-100 text-orange-700 border-orange-300' };
      case 'css': return { variant: 'outline', bg: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'javascript': return { variant: 'outline', bg: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      case 'python': return { variant: 'outline', bg: 'bg-green-100 text-green-700 border-green-300' };
      case 'react': return { variant: 'outline', bg: 'bg-cyan-100 text-cyan-700 border-cyan-300' };
      default: return { variant: 'outline', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };
  
  const handleSubmitNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast.error('Vous devez être connecté pour créer un sujet');
      return;
    }
    
    if (!newTopic.title || !newTopic.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Créer un nouveau sujet
    const newTopicData: ForumTopic = {
      id: `new-${Date.now()}`,
      title: newTopic.title,
      author: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Utilisateur',
      authorRole: 'Étudiant',
      category: newTopic.category,
      content: newTopic.content,
      tags: newTopic.tags.split(',').map(tag => tag.trim()),
      upvotes: 0,
      replies: 0,
      views: 0,
      createdAt: new Date().toISOString()
    };
    
    setTopics([newTopicData, ...forumTopics]);
    toast.success('Votre sujet a été créé avec succès !');
    
    // Réinitialiser le formulaire
    setNewTopic({
      title: '',
      content: '',
      category: 'general',
      tags: ''
    });
    setShowNewTopicForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Communauté</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Échangez avec d'autres apprenants, posez vos questions et partagez vos connaissances.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className={`w-full ${selectedTopic ? 'md:w-1/3' : 'md:w-2/3'} mx-auto`}>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans la communauté..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <SignedIn>
              <Button onClick={() => setShowNewTopicForm(true)}>
                Nouveau sujet
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>Connexion pour poster</Button>
              </SignInButton>
            </SignedOut>
          </div>
          
          {showNewTopicForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Créer un nouveau sujet</CardTitle>
                <CardDescription>Partagez votre question ou votre connaissance avec la communauté</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitNewTopic} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Titre</label>
                    <Input
                      id="title"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                      placeholder="Soyez clair et concis"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Catégorie</label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                    >
                      <option value="general">Général</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="react">React</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">Contenu</label>
                    <Textarea
                      id="content"
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                      placeholder="Décrivez votre question ou partagez votre savoir"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (séparés par des virgules)</label>
                    <Input
                      id="tags"
                      value={newTopic.tags}
                      onChange={(e) => setNewTopic({...newTopic, tags: e.target.value})}
                      placeholder="ex: javascript, react, débutant"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewTopicForm(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Publier
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="latest" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="latest" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Récents</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>Populaires</span>
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Sans réponse</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest">
              <div className="space-y-4">
                {topics.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun sujet ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  topics.map((topic) => (
                    <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTopic(topic)}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <Badge variant="outline" className={getCategoryBadge(topic.category).bg}>
                            {topic.category.toUpperCase()}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(topic.createdAt)}
                          </div>
                        </div>
                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>par {topic.author}</span>
                          <span className="mx-2">•</span>
                          <span>{topic.authorRole}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="line-clamp-2 text-muted-foreground">{topic.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {topic.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="w-full flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {topic.upvotes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {topic.replies}
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {topic.views}
                            </div>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="space-y-4">
                {topics.sort((a, b) => b.upvotes - a.upvotes).map((topic) => (
                  <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTopic(topic)}>
                    {/* Contenu identique à celui de l'onglet "latest" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="outline" className={getCategoryBadge(topic.category).bg}>
                          {topic.category.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(topic.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>par {topic.author}</span>
                        <span className="mx-2">•</span>
                        <span>{topic.authorRole}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-2 text-muted-foreground">{topic.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {topic.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {topic.upvotes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {topic.replies}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {topic.views}
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unanswered">
              <div className="space-y-4">
                {topics.filter(topic => topic.replies === 0).map((topic) => (
                  <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTopic(topic)}>
                    {/* Contenu identique à celui de l'onglet "latest" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="outline" className={getCategoryBadge(topic.category).bg}>
                          {topic.category.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(topic.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>par {topic.author}</span>
                        <span className="mx-2">•</span>
                        <span>{topic.authorRole}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-2 text-muted-foreground">{topic.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {topic.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {topic.upvotes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {topic.replies}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {topic.views}
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {selectedTopic && (
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className={getCategoryBadge(selectedTopic.category).bg}>
                      {selectedTopic.category.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-2xl mt-2">{selectedTopic.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>par {selectedTopic.author}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedTopic.authorRole}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(selectedTopic.createdAt)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="mt-0">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none mb-4">
                  {selectedTopic.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-6">
                  {selectedTopic.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-6 mt-6 border-t pt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Utile ({selectedTopic.upvotes})</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start border-t">
                <h3 className="font-semibold text-lg mb-4">Réponses ({selectedTopic.replies})</h3>
                
                {selectedTopic.replies === 0 ? (
                  <div className="text-center w-full py-6">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-muted-foreground">Aucune réponse pour le moment. Soyez le premier à répondre !</p>
                  </div>
                ) : (
                  <div className="text-center w-full py-6">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-muted-foreground">Réponses en cours de chargement...</p>
                  </div>
                )}
                
                <div className="w-full mt-6">
                  <h3 className="font-semibold text-lg mb-4">Votre réponse</h3>
                  <SignedIn>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Partagez votre réponse ou votre contribution..."
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <Button>Publier la réponse</Button>
                      </div>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div className="bg-secondary/20 rounded-lg p-4 text-center">
                      <p className="text-muted-foreground mb-4">Vous devez être connecté pour répondre</p>
                      <SignInButton>
                        <Button variant="outline">Se connecter</Button>
                      </SignInButton>
                    </div>
                  </SignedOut>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
