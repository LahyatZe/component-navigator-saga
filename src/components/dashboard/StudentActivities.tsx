
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Book } from 'lucide-react';

const StudentActivities: FC = () => {
  return (
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
  );
};

export default StudentActivities;
