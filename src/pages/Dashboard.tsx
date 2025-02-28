
import { FC, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { courses } from '@/data/courses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Book, Clock, GraduationCap, Users, Trophy, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données simulées pour les statistiques
const studentData = [
  { name: 'HTML', value: 45 },
  { name: 'CSS', value: 32 },
  { name: 'JavaScript', value: 28 },
  { name: 'Python', value: 18 },
  { name: 'React', value: 15 }
];

const Dashboard: FC = () => {
  const { isSignedIn, user } = useUser();
  const [activeRole, setActiveRole] = useState<'student' | 'instructor'>('student');
  
  // Simuler les données de progression de l'utilisateur
  const userCourseProgress = courses.map(course => ({
    id: course.id,
    title: course.title,
    progress: Math.floor(Math.random() * 100)
  })).slice(0, 3);
  
  const renderStudentDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cours suivis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCourseProgress.length}</div>
            <p className="text-sm text-muted-foreground">sur {courses.length} disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Temps total d'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12h 30m</div>
            <p className="text-sm text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Exercices complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">sur 45 disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Badges gagnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">sur 12 disponibles</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Votre progression</CardTitle>
          <CardDescription>Suivez votre avancement dans vos cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userCourseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link to="/courses">
              <Button variant="outline">Voir tous mes cours</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Répartition de votre apprentissage</CardTitle>
            <CardDescription>Temps passé par catégorie de cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prochaines certifications</CardTitle>
            <CardDescription>Objectifs à atteindre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
                <Trophy className="text-yellow-500 h-10 w-10" />
                <div>
                  <h4 className="font-semibold">HTML & CSS</h4>
                  <p className="text-sm text-muted-foreground">2 cours restants</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
                <Award className="text-blue-500 h-10 w-10" />
                <div>
                  <h4 className="font-semibold">JavaScript Fondamentaux</h4>
                  <p className="text-sm text-muted-foreground">1 cours restant</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderInstructorDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Étudiants actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
            <p className="text-sm text-muted-foreground">+12% depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cours publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">sur la plateforme</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-sm text-muted-foreground">en moyenne</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Questions en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-sm text-muted-foreground">à répondre</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performances des cours</CardTitle>
            <CardDescription>Nombre d'étudiants par cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Gérer vos cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Créer un nouveau cours
              </Button>
              
              <Button variant="outline" className="w-full flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Gérer les cours existants
              </Button>
              
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voir les étudiants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dernières activités des étudiants</CardTitle>
          <CardDescription>Activités récentes sur vos cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
              <div className="bg-primary/10 rounded-full p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">15 nouveaux étudiants</h4>
                <p className="text-sm text-muted-foreground">ont rejoint "HTML & CSS pour débutants"</p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 2 jours</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
              <div className="bg-primary/10 rounded-full p-2">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">5 étudiants</h4>
                <p className="text-sm text-muted-foreground">ont terminé "JavaScript: Les fondamentaux"</p>
              </div>
              <p className="text-sm text-muted-foreground">Hier</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg">
              <div className="bg-primary/10 rounded-full p-2">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">12 nouveaux exercices</h4>
                <p className="text-sm text-muted-foreground">ont été complétés en "Introduction à Python"</p>
              </div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-12">
      <SignedIn>
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue {user?.firstName || 'utilisateur'}, voici un aperçu de votre parcours d'apprentissage.
          </p>
        </div>
        
        <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as 'student' | 'instructor')} className="mb-8">
          <TabsList>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Étudiant</span>
            </TabsTrigger>
            <TabsTrigger value="instructor" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span>Instructeur</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="mt-6">
            {renderStudentDashboard()}
          </TabsContent>
          
          <TabsContent value="instructor" className="mt-6">
            {renderInstructorDashboard()}
          </TabsContent>
        </Tabs>
      </SignedIn>
      
      <SignedOut>
        <div className="text-center py-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Connectez-vous pour accéder à votre tableau de bord</h2>
          <p className="text-muted-foreground mb-8">
            Suivez votre progression, consultez vos cours et accédez à toutes les fonctionnalités
            en créant un compte ou en vous connectant.
          </p>
          <SignInButton>
            <Button size="lg">Se connecter</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default Dashboard;
