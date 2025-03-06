
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseProgressItem {
  id: string;
  title: string;
  progress: number;
}

const CourseProgress: FC<{ courses: CourseProgressItem[] }> = ({ courses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Votre progression</CardTitle>
        <CardDescription>Suivez votre avancement dans vos cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium truncate max-w-[70%]">{course.title}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2 sm:h-2.5" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 sm:mt-6">
          <Link to="/courses">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">Voir tous mes cours</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
