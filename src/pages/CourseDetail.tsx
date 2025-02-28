
import { FC, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { courses } from '@/data/courses';
import { Course, Lesson } from '@/types/course';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowLeft, Book, Check, Clock, Play, User, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';

const CourseDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Trouver le cours correspondant au slug
  useEffect(() => {
    if (!slug) return;
    
    const foundCourse = courses.find(c => c.slug === slug);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Sélectionner la première leçon par défaut
      if (foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
        setSelectedLesson(foundCourse.modules[0].lessons[0]);
      }
    } else {
      navigate('/courses', { replace: true });
    }
  }, [slug, navigate]);
  
  const { progress, isLoading, markLessonAsCompleted, setCurrentLesson } = 
    useCourseProgress(course?.id);
  
  useEffect(() => {
    if (selectedLesson && course && progress && !isLoading) {
      setCurrentLesson(selectedLesson.id);
    }
  }, [selectedLesson, course, progress, isLoading, setCurrentLesson]);
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('content');
  };
  
  const handleMarkAsCompleted = () => {
    if (!selectedLesson || !course) return;
    
    markLessonAsCompleted(selectedLesson.id, course);
    toast.success('Leçon marquée comme terminée !');
  };
  
  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };
  
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  );
  
  const completedLessons = progress?.completedLessons.length || 0;
  const completionPercentage = progress?.completionPercentage || 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux cours
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={course.level === 'beginner' ? 'secondary' : course.level === 'intermediate' ? 'default' : 'destructive'}>
                {course.level === 'beginner' ? 'Débutant' : course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </Badge>
              <Badge variant="outline">
                {course.category.toUpperCase()}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" /> 
                {Math.floor(course.duration / 60)}h{course.duration % 60 > 0 ? ` ${course.duration % 60}min` : ''}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Votre progression</CardTitle>
              </CardHeader>
              <CardContent>
                <SignedIn>
                  {!isLoading ? (
                    <>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{completedLessons} / {totalLessons} leçons</span>
                        <span>{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="mb-4" />
                      
                      <Button className="w-full" onClick={() => {
                        if (selectedLesson) {
                          setActiveTab('content');
                        } else if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                          setSelectedLesson(course.modules[0].lessons[0]);
                          setActiveTab('content');
                        }
                      }}>
                        {progress && progress.currentLesson ? 'Continuer le cours' : 'Commencer le cours'}
                      </Button>
                    </>
                  ) : (
                    <div className="py-2 flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </SignedIn>
                <SignedOut>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connectez-vous pour suivre votre progression et accéder à toutes les fonctionnalités.
                  </p>
                  <SignInButton>
                    <Button className="w-full">Se connecter</Button>
                  </SignInButton>
                </SignedOut>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
            <Accordion type="multiple" defaultValue={[course.modules[0]?.id]}>
              {course.modules.map((module) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger>{module.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <li 
                          key={lesson.id} 
                          className={`
                            p-2 rounded-md cursor-pointer flex items-center justify-between
                            ${selectedLesson?.id === lesson.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/50'}
                            ${isLessonCompleted(lesson.id) ? 'border-l-4 border-green-500' : ''}
                          `}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div className="flex items-center">
                            <Play className="w-4 h-4 mr-2" />
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          {isLessonCompleted(lesson.id) && <Check className="w-4 h-4" />}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        <div className="md:col-span-3 order-1 md:order-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Contenu</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de ce cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{course.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-2">Ce que vous apprendrez</h3>
                    <ul className="list-disc list-inside mb-4 space-y-1">
                      {course.modules.map((module) => (
                        <li key={module.id}>{module.title}</li>
                      ))}
                    </ul>
                    
                    {course.prerequisites.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Prérequis</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {course.prerequisites.map((prereq) => {
                            const prereqCourse = courses.find(c => c.id === prereq);
                            return (
                              <li key={prereq}>
                                {prereqCourse ? (
                                  <Link to={`/courses/${prereqCourse.slug}`} className="text-primary hover:underline">
                                    {prereqCourse.title}
                                  </Link>
                                ) : prereq}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Instructeur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.author}</h3>
                        <p className="text-sm text-muted-foreground">{course.authorRole}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Certification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Award className="h-10 w-10 text-primary" />
                      <div>
                        <h3 className="font-semibold">Certificat de réussite</h3>
                        <p className="text-sm text-muted-foreground">
                          Complétez tous les modules du cours pour obtenir votre certificat.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              {selectedLesson ? (
                <div className="space-y-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4 mr-1" /> {selectedLesson.duration} min
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      {selectedLesson.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    
                    <SignedIn>
                      <div className="mt-8 flex justify-end">
                        <Button onClick={handleMarkAsCompleted} disabled={isLessonCompleted(selectedLesson.id)}>
                          {isLessonCompleted(selectedLesson.id) ? 'Terminé' : 'Marquer comme terminé'}
                        </Button>
                      </div>
                    </SignedIn>
                  </div>
                  
                  {selectedLesson.exercises.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Exercices</h3>
                      <div className="space-y-4">
                        {selectedLesson.exercises.map((exercise) => (
                          <Card key={exercise.id}>
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle>{exercise.title}</CardTitle>
                                <Badge variant={
                                  exercise.difficulty === 'easy' ? 'secondary' : 
                                  exercise.difficulty === 'medium' ? 'default' : 
                                  'destructive'
                                }>
                                  {exercise.difficulty === 'easy' ? 'Facile' : 
                                   exercise.difficulty === 'medium' ? 'Moyen' : 
                                   'Difficile'}
                                </Badge>
                              </div>
                              <CardDescription>{exercise.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {exercise.codeTemplate && (
                                <div className="bg-secondary/20 p-4 rounded-md mb-4 font-mono text-sm overflow-x-auto">
                                  <pre>{exercise.codeTemplate}</pre>
                                </div>
                              )}
                              <SignedIn>
                                <Button variant="outline" className="mt-2">
                                  Commencer l'exercice
                                </Button>
                              </SignedIn>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Sélectionnez une leçon pour commencer.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
