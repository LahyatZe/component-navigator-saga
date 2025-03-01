import { FC, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { courses } from '@/data/courses';
import { Course as CourseType } from '@/types/course';
import CourseCard from '@/components/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Code, GraduationCap } from 'lucide-react';

const Courses: FC = () => {
  const { isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>(courses);
  
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      const progress: Record<string, number> = {};
      
      courses.forEach(course => {
        const savedProgress = localStorage.getItem(`course_progress_${userId}_${course.id}`);
        if (savedProgress) {
          try {
            const parsed = JSON.parse(savedProgress);
            progress[course.id] = parsed.completionPercentage;
          } catch (error) {
            console.error(`Erreur lors du chargement de la progression pour ${course.id}:`, error);
          }
        }
      });
      
      setUserProgress(progress);
    }
  }, [isSignedIn, user]);
  
  useEffect(() => {
    let result = courses;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term)
      );
    }
    
    if (levelFilter !== 'all') {
      result = result.filter(course => course.level === levelFilter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(course => course.category === categoryFilter);
    }
    
    setFilteredCourses(result);
  }, [searchTerm, levelFilter, categoryFilter]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Nos Cours de Programmation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Développez vos compétences en programmation avec nos cours structurés, conçus pour les débutants comme pour les développeurs avancés.
        </p>
      </div>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="other">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Tous les cours</span>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Recommandés</span>
          </TabsTrigger>
          <TabsTrigger value="inprogress" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span>En cours</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Aucun cours ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={userProgress[course.id]}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended">
          {isSignedIn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(course => course.level === 'beginner')
                .map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    progress={userProgress[course.id]}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Connectez-vous pour voir des recommandations personnalisées.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inprogress">
          {isSignedIn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(userProgress).length > 0 ? (
                courses
                  .filter(course => userProgress[course.id] > 0 && userProgress[course.id] < 100)
                  .map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      progress={userProgress[course.id]}
                    />
                  ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-muted-foreground">Vous n'avez pas encore commencé de cours.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Connectez-vous pour voir vos cours en cours.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
