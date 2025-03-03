
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
        <CardTitle>Votre progression</CardTitle>
        <CardDescription>Suivez votre avancement dans vos cours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.map((course) => (
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
  );
};

export default CourseProgress;
