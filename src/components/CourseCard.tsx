
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
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 mobile-card">
      <div className="relative w-full h-28 sm:h-32 md:h-40 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2 pt-3 px-3 sm:px-4 space-y-1 sm:space-y-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant={getBadgeVariant(level)} className="text-xs">
            {level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
          </Badge>
          <Badge variant="outline" className={`text-xs ${categoryStyle.bg}`}>
            {category.toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-base sm:text-lg line-clamp-1">{title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" /> {Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}min` : ''}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 px-3 sm:px-4 flex-grow">
        <CardDescription className="text-xs sm:text-sm line-clamp-2">{description}</CardDescription>
        
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1 pb-3 px-3 sm:px-4">
        <div className="w-full flex gap-2 justify-between items-center">
          <div className="text-xs text-muted-foreground truncate max-w-[35%]">{author}</div>
          <Button asChild size="sm" className="mobile-touch-target h-9 rounded-lg">
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
