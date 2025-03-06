
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentStats: FC<{ 
  coursesCount: number, 
  totalCourses: number 
}> = ({ coursesCount, totalCourses }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Cours suivis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">{coursesCount}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">sur {totalCourses} disponibles</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Temps total d'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">12h 30m</div>
          <p className="text-xs sm:text-sm text-muted-foreground">cette semaine</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Exercices complétés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">24</div>
          <p className="text-xs sm:text-sm text-muted-foreground">sur 45 disponibles</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg">Badges gagnés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-3xl font-bold">5</div>
          <p className="text-xs sm:text-sm text-muted-foreground">sur 12 disponibles</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStats;
