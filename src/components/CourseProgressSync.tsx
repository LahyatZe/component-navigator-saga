
import { useState, useEffect } from 'react';
import { UserProgress } from '@/types/course';
import { SyncControls } from './SyncControls';
import { useUser } from '@clerk/clerk-react';
import { formatStringToUuid } from '@/utils/formatUserId';

interface CourseProgressSyncProps {
  courseId: string;
  progress: UserProgress | null;
  onProgressUpdate: (updatedProgress: UserProgress) => void;
}

export function CourseProgressSync({ 
  courseId, 
  progress, 
  onProgressUpdate 
}: CourseProgressSyncProps) {
  const { user } = useUser();
  
  if (!user || !progress) {
    return null;
  }

  // Format data for Supabase upload
  const formatProgressForUpload = (progressData: UserProgress) => {
    // Ensure courseId is in UUID format for Supabase
    let formattedCourseId = progressData.courseId;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formattedCourseId)) {
      formattedCourseId = formatStringToUuid(formattedCourseId);
    }
    
    // Handle current lesson ID - ensure it's a valid UUID or null
    let currentLessonId = progressData.currentLesson;
    if (currentLessonId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentLessonId)) {
      currentLessonId = formatStringToUuid(currentLessonId);
    }
    
    // If currentLessonId is empty string, set it to null for database
    if (currentLessonId === '') {
      currentLessonId = null;
    }
    
    return {
      user_id: progress.userId,
      course_id: formattedCourseId,
      completed_lessons: progress.completedLessons,
      completed_exercises: progress.completedExercises,
      current_lesson: currentLessonId,
      started_at: progress.startedAt,
      last_accessed_at: new Date().toISOString(),
      completion_percentage: progress.completionPercentage,
      quiz_scores: progress.quizScores,
      certificate_issued: progress.certificateIssued,
      notes: progress.notes,
      bookmarks: progress.bookmarks,
      cv_downloaded: progress.cvDownloaded || false,
      unlocked_years: progress.unlockedYears || [],
      current_level: progress.currentLevel || 0,
      used_hints: progress.usedHints || {},
      achievements: progress.achievements || []
    };
  };

  // Format response from Supabase for local storage
  const formatResponseForDownload = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const dbProgress = data[0]; // Get the first matching progress
    
    return {
      userId: user.id,
      courseId: courseId,
      completedLessons: dbProgress.completed_lessons || [],
      completedExercises: dbProgress.completed_exercises || [],
      currentLesson: dbProgress.current_lesson || '',
      startedAt: dbProgress.started_at || new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completionPercentage: dbProgress.completion_percentage || 0,
      quizScores: typeof dbProgress.quiz_scores === 'object' && dbProgress.quiz_scores !== null 
        ? dbProgress.quiz_scores 
        : {},
      certificateIssued: !!dbProgress.certificate_issued,
      notes: typeof dbProgress.notes === 'object' && dbProgress.notes !== null 
        ? dbProgress.notes 
        : {},
      bookmarks: dbProgress.bookmarks || [],
      cvDownloaded: !!dbProgress.cv_downloaded,
      unlockedYears: Array.isArray(dbProgress.unlocked_years) ? dbProgress.unlocked_years : [],
      usedHints: typeof dbProgress.used_hints === 'object' && dbProgress.used_hints !== null
        ? dbProgress.used_hints
        : {},
      currentLevel: dbProgress.current_level || 0,
      achievements: Array.isArray(dbProgress.achievements) ? dbProgress.achievements : []
    };
  };

  const handleSyncComplete = (data: any) => {
    if (data && data.length > 0) {
      const formattedProgress = formatResponseForDownload(data);
      if (formattedProgress) {
        onProgressUpdate(formattedProgress);
      }
    }
  };

  return (
    <SyncControls
      tableName="user_progress"
      primaryKey={['user_id', 'course_id']}
      localData={progress}
      localStorageKey={`course_progress_${user.id}_${courseId}`}
      onSyncComplete={handleSyncComplete}
      formatDataForUpload={formatProgressForUpload}
      formatResponseForDownload={formatResponseForDownload}
    />
  );
}
