
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CourseProgressSync } from './CourseProgressSync';
import { UserProgress } from '@/types/course';

interface CourseSyncManagerProps {
  courseId: string;
  progress: UserProgress | null;
  onProgressUpdate: (updatedProgress: UserProgress) => void;
  className?: string;
}

export function CourseSyncManager({
  courseId,
  progress,
  onProgressUpdate,
  className = ''
}: CourseSyncManagerProps) {
  if (!progress) {
    return null;
  }
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Course Progress Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <CourseProgressSync 
          courseId={courseId}
          courseProgress={progress}
          onProgressUpdate={onProgressUpdate}
        />
      </CardContent>
    </Card>
  );
}
