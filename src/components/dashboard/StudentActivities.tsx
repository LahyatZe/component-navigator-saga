
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Book } from 'lucide-react';

const StudentActivities: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Dernières activités des étudiants</CardTitle>
        <CardDescription>Activités récentes sur vos cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-secondary/20 rounded-lg">
            <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold">15 nouveaux étudiants</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">ont rejoint "HTML & CSS pour débutants"</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">Il y a 2 jours</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-secondary/20 rounded-lg">
            <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold">5 étudiants</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">ont terminé "JavaScript: Les fondamentaux"</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">Hier</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-secondary/20 rounded-lg">
            <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
              <Book className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold">12 nouveaux exercices</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">ont été complétés en "Introduction à Python"</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">Aujourd'hui</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentActivities;
