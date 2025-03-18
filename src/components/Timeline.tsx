
import { FC, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Briefcase, GraduationCap, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'education' | 'work' | 'certification';
}

interface TimelineProps {
  events: TimelineEvent[];
  unlockedYears?: string[];
}

const Timeline: FC<TimelineProps> = ({ events, unlockedYears = [] }) => {
  // État pour gérer les événements débloqués
  const [unlocked, setUnlocked] = useState<string[]>(unlockedYears.length ? unlockedYears : events.map(e => e.year));
  // État pour suivre l'événement actif/sélectionné
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  
  // Trier les événements par année
  const sortedEvents = [...events].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year); // Ordre décroissant
  });

  // Gérer le clic sur un événement chronologique
  const handleUnlock = (year: string) => {
    if (unlocked.includes(year)) return; // Déjà débloqué
    
    setUnlocked(prev => [...prev, year]);
    toast.success(`Événement de ${year} débloqué !`);
  };

  // Navigation dans la timeline
  const handlePrevious = () => {
    setActiveEventIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveEventIndex(prev => (prev < sortedEvents.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Mon Parcours</h2>
      
      {/* Vue Mobile: Carrousel avec navigation */}
      <div className="block md:hidden relative">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious}
            disabled={activeEventIndex === 0}
            className="z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Badge className="px-3 py-1">
            {sortedEvents[activeEventIndex].year}
          </Badge>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext}
            disabled={activeEventIndex === sortedEvents.length - 1}
            className="z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="transition-all duration-300">
          <Card className={`w-full ${unlocked.includes(sortedEvents[activeEventIndex].year) ? 'opacity-100' : 'opacity-60 filter blur-[1px]'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{sortedEvents[activeEventIndex].title}</CardTitle>
                <div>
                  {sortedEvents[activeEventIndex].type === 'education' && <GraduationCap className="w-5 h-5 text-blue-500" />}
                  {sortedEvents[activeEventIndex].type === 'work' && <Briefcase className="w-5 h-5 text-green-500" />}
                  {sortedEvents[activeEventIndex].type === 'certification' && <CalendarDays className="w-5 h-5 text-purple-500" />}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{sortedEvents[activeEventIndex].subtitle}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{sortedEvents[activeEventIndex].description}</p>
              
              {!unlocked.includes(sortedEvents[activeEventIndex].year) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUnlock(sortedEvents[activeEventIndex].year)}
                  className="w-full flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" /> Débloquer cet événement
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Vue Desktop: Timeline horizontale */}
      <div className="hidden md:block relative">
        {/* Ligne horizontale */}
        <div className="absolute top-24 left-0 right-0 h-0.5 bg-primary/20"></div>
        
        <div className="flex overflow-x-auto pb-8 space-x-8 px-4">
          {sortedEvents.map((event, index) => {
            const isUnlocked = unlocked.includes(event.year);
            
            return (
              <div 
                key={event.id}
                className={`flex-none w-80 transition-all duration-300 ${
                  isUnlocked 
                    ? 'opacity-100 cursor-pointer' 
                    : 'opacity-40 filter blur-[1px]'
                }`}
                onClick={() => !isUnlocked && handleUnlock(event.year)}
              >
                <div className="flex flex-col items-center">
                  <Badge className="mb-4">
                    {event.year}
                  </Badge>
                  
                  <div className="w-6 h-6 rounded-full bg-primary z-10 mb-4">
                    {!isUnlocked && <Lock className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                  </div>
                  
                  <Card className="w-full hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div>
                          {event.type === 'education' && <GraduationCap className="w-5 h-5 text-blue-500" />}
                          {event.type === 'work' && <Briefcase className="w-5 h-5 text-green-500" />}
                          {event.type === 'certification' && <CalendarDays className="w-5 h-5 text-purple-500" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{event.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      
                      {!isUnlocked && (
                        <div className="mt-4 flex justify-center">
                          <Badge variant="outline" className="flex gap-1 cursor-pointer">
                            <Lock className="w-3 h-3" /> Verrouillé
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
