
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/types/course';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: Course;
  progress?: number;
}

const CourseCard: FC<CourseCardProps> = ({ course, progress }) => {
  const { title, description, level, duration, author, imageUrl, slug, category } = course;
  
  const getBadgeVariant = (level: 'beginner' | 'intermediate' | 'advanced') => {
    switch(level) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'html': return { variant: 'outline', bg: 'bg-orange-100 text-orange-700 border-orange-300' };
      case 'css': return { variant: 'outline', bg: 'bg-blue-100 text-blue-700 border-blue-300' };
      case 'javascript': return { variant: 'outline', bg: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      case 'python': return { variant: 'outline', bg: 'bg-green-100 text-green-700 border-green-300' };
      case 'react': return { variant: 'outline', bg: 'bg-cyan-100 text-cyan-700 border-cyan-300' };
      default: return { variant: 'outline', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const categoryStyle = getCategoryBadge(category);

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative w-full h-32 sm:h-40 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2 space-y-2">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Badge variant={getBadgeVariant(level)} className="text-xs">
            {level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
          </Badge>
          <Badge variant="outline" className={`text-xs ${categoryStyle.bg}`}>
            {category.toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-lg sm:text-xl line-clamp-1">{title}</CardTitle>
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}min` : ''}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <CardDescription className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{description}</CardDescription>
        
        {progress !== undefined && (
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex gap-2 justify-between items-center">
          <div className="text-xs text-muted-foreground truncate max-w-[40%]">{author}</div>
          <Button asChild size="sm" className="touch-target">
            <Link to={`/courses/${slug}`}>
              Voir le cours
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
