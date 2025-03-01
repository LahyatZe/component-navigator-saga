import { FC, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { courses } from '@/data/courses';
import { Course, Lesson, Exercise } from '@/types/course';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowLeft, Book, Check, Clock, Play, User, FileText, Award, Code } from 'lucide-react';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/CodeEditor';
import { fetchCourseBySlug, getUserProgress, saveUserProgress } from '@/services/course';

const CourseDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [userCode, setUserCode] = useState('');
  const [exerciseResult, setExerciseResult] = useState<{
    passed: boolean;
    message: string;
    score?: number;
  } | null>(null);
  
  useEffect(() => {
    if (!slug) return;
    
    const foundCourse = courses.find(c => c.slug === slug);
    if (foundCourse) {
      setCourse(foundCourse);
      
      if (foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
        setSelectedLesson(foundCourse.modules[0].lessons[0]);
      }
    } else {
      navigate('/courses', { replace: true });
    }
  }, [slug, navigate]);
  
  const { progress, isLoading, markLessonAsCompleted, markExerciseAsCompleted, setCurrentLesson } = 
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
    setSelectedExercise(null);
    setExerciseResult(null);
  };
  
  const handleMarkAsCompleted = () => {
    if (!selectedLesson || !course) return;
    
    markLessonAsCompleted(selectedLesson.id, course);
    toast.success('Leçon marquée comme terminée !');
  };
  
  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };

  const isExerciseCompleted = (exerciseId: string) => {
    return progress?.completedExercises.includes(exerciseId) || false;
  };
  
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  );
  
  const completedLessons = progress?.completedLessons.length || 0;
  const completionPercentage = progress?.completionPercentage || 0;

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setUserCode(exercise.codeTemplate || '');
    setExerciseResult(null);
  };

  const handleCodeChange = (code: string) => {
    setUserCode(code);
  };

  const evaluateExercise = () => {
    if (!selectedExercise || !course) return;

    try {
      const userFunction = new Function('return ' + userCode)();
      
      let allTestsPassed = true;
      let failedMessage = '';
      let score = 0;
      
      if (selectedExercise.testCases && selectedExercise.testCases.length > 0) {
        for (const testCase of selectedExercise.testCases) {
          try {
            const input = JSON.parse(testCase.input);
            const expectedOutput = JSON.parse(testCase.expectedOutput);
            
            const actualOutput = userFunction(...input);
            
            const passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
            
            if (!passed) {
              allTestsPassed = false;
              if (testCase.isPublic) {
                failedMessage = `Échec pour l'entrée: ${testCase.input}. Attendu: ${testCase.expectedOutput}, Reçu: ${JSON.stringify(actualOutput)}`;
              }
              break;
            } else {
              score += selectedExercise.points || 10;
            }
          } catch (e) {
            allTestsPassed = false;
            failedMessage = `Erreur d'exécution: ${e.message}`;
            break;
          }
        }
      } else {
        allTestsPassed = userCode.trim() === (selectedExercise.solution || '').trim();
        if (allTestsPassed) {
          score = selectedExercise.points || 10;
        } else {
          failedMessage = 'La solution n\'est pas correcte. Réessayez.';
        }
      }

      if (allTestsPassed) {
        setExerciseResult({
          passed: true,
          message: 'Bravo ! Tous les tests sont passés.',
          score: score
        });
        
        markExerciseAsCompleted(selectedExercise.id, course);
        toast.success('Exercice réussi !');
      } else {
        setExerciseResult({
          passed: false,
          message: failedMessage || 'Des erreurs ont été détectées.',
          score: 0
        });
      }
    } catch (error) {
      setExerciseResult({
        passed: false,
        message: `Erreur de syntaxe: ${error.message}`,
        score: 0
      });
    }
  };

  const renderExerciseView = () => {
    if (!selectedExercise) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedExercise.title}</CardTitle>
                <CardDescription className="mt-2">
                  Difficulté: {
                    selectedExercise.difficulty === 'easy' ? 'Facile' :
                    selectedExercise.difficulty === 'medium' ? 'Intermédiaire' : 'Difficile'
                  }
                  {selectedExercise.points && ` • ${selectedExercise.points} points`}
                </CardDescription>
              </div>
              {isExerciseCompleted(selectedExercise.id) && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Complété <Check className="ml-1 h-3 w-3" />
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Consigne :</h3>
                <p>{selectedExercise.description}</p>
              </div>
              
              {selectedExercise.hints && selectedExercise.hints.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Indices :</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedExercise.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-2">Votre code :</h3>
                <CodeEditor 
                  code={userCode} 
                  onChange={handleCodeChange} 
                  language="javascript"
                  height="200px"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setUserCode(selectedExercise.codeTemplate || '')}
                >
                  Réinitialiser
                </Button>
                <Button onClick={evaluateExercise}>Vérifier ma réponse</Button>
              </div>
              
              {exerciseResult && (
                <Card className={`mt-4 border-2 ${exerciseResult.passed ? 'border-green-500' : 'border-red-500'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      {exerciseResult.passed ? (
                        <Check className="text-green-500" />
                      ) : (
                        <div className="text-red-500">✖</div>
                      )}
                      <p className={exerciseResult.passed ? 'text-green-600' : 'text-red-600'}>
                        {exerciseResult.message}
                      </p>
                    </div>
                    {exerciseResult.passed && exerciseResult.score && (
                      <p className="mt-2">Score: {exerciseResult.score} points</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
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
              {selectedLesson && selectedLesson.exercises.length > 0 && (
                <TabsTrigger value="exercises" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>Exercices</span>
                </TabsTrigger>
              )}
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
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Sélectionnez une leçon pour commencer.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="exercises">
              {selectedExercise ? (
                renderExerciseView()
              ) : selectedLesson && selectedLesson.exercises.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Exercices disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLesson.exercises.map((exercise) => (
                      <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExerciseSelect(exercise)}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{exercise.title}</CardTitle>
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
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">{exercise.points || 10} points</span>
                            {isExerciseCompleted(exercise.id) && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Complété <Check className="ml-1 h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Aucun exercice disponible pour cette leçon.</p>
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
