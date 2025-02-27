
import { FC } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Briefcase, GraduationCap } from 'lucide-react';

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
  unlockedYears: string[];
}

const Timeline: FC<TimelineProps> = ({ events, unlockedYears }) => {
  // Trier les événements par année
  const sortedEvents = [...events].sort((a, b) => {
    return parseInt(a.year) - parseInt(b.year);
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Mon Parcours</h2>
      
      <div className="relative">
        {/* Ligne horizontale */}
        <div className="absolute top-24 left-0 right-0 h-0.5 bg-primary/20"></div>
        
        <div className="flex overflow-x-auto pb-8 space-x-8 px-4">
          {sortedEvents.map((event, index) => {
            const isUnlocked = unlockedYears.includes(event.year);
            
            return (
              <div 
                key={event.id}
                className={`flex-none w-80 transition-all duration-300 ${
                  isUnlocked 
                    ? 'opacity-100' 
                    : 'opacity-40 filter blur-[1px] pointer-events-none'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Badge className="mb-4">
                    {event.year}
                  </Badge>
                  
                  <div className="w-6 h-6 rounded-full bg-primary z-10 mb-4"></div>
                  
                  <Card className="w-full">
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
