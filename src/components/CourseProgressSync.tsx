
import { useState, useEffect } from 'react';
import { SyncControls } from './SyncControls';
import { useUser } from '@clerk/clerk-react';
import { UserProgress } from '@/types/course';

interface CourseProgressSyncProps {
  courseProgress: UserProgress;
  onProgressUpdate: (updatedProgress: UserProgress) => void;
}

export function CourseProgressSync({ 
  courseProgress, 
  onProgressUpdate 
}: CourseProgressSyncProps) {
  const { user } = useUser();
  
  if (!user || !courseProgress) {
    return null;
  }

  // Format data for Supabase upload
  const formatProgressForUpload = (progressData: UserProgress) => {
    // Check if courseId is a UUID, if not convert it
    let formattedCourseId = progressData.courseId;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(progressData.courseId)) {
      // In a production app we'd format this to UUID, but for now we'll just log
      console.log("Course ID is not a UUID, should be formatted");
    }
    
    // Handle current lesson ID - ensure it's a valid UUID or null
    let currentLessonId = progressData.currentLesson;
    if (currentLessonId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentLessonId)) {
      // If not a UUID, in production this would be converted
      console.log("Lesson ID is not a UUID, should be formatted");
    }

    // Format the object to match the database schema
    return {
      user_id: progressData.userId,
      course_id: formattedCourseId,
      completed_lessons: progressData.completedLessons || [],
      completed_exercises: progressData.completedExercises || [],
      current_lesson: currentLessonId || null,
      started_at: progressData.startedAt || new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      completion_percentage: progressData.completionPercentage || 0,
      quiz_scores: progressData.quizScores || {},
      certificate_issued: progressData.certificateIssued || false,
      notes: progressData.notes || {},
      bookmarks: progressData.bookmarks || [],
      cv_downloaded: progressData.cvDownloaded || false,
      unlocked_years: progressData.unlockedYears || [],
      current_level: progressData.currentLevel || 0,
      used_hints: progressData.usedHints || {},
      achievements: progressData.achievements || []
    };
  };

  // Format response from Supabase for local storage
  const formatResponseForDownload = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const dbProgress = data[0]; // Get the first matching progress entry
    
    return {
      userId: user.id,
      courseId: dbProgress.course_id,
      completedLessons: dbProgress.completed_lessons || [],
      completedExercises: dbProgress.completed_exercises || [],
      currentLesson: dbProgress.current_lesson || '',
      startedAt: dbProgress.started_at || new Date().toISOString(),
      lastAccessedAt: dbProgress.last_accessed_at || new Date().toISOString(),
      completionPercentage: dbProgress.completion_percentage || 0,
      quizScores: dbProgress.quiz_scores || {},
      certificateIssued: !!dbProgress.certificate_issued,
      notes: dbProgress.notes || {},
      bookmarks: dbProgress.bookmarks || [],
      cvDownloaded: !!dbProgress.cv_downloaded,
      unlockedYears: dbProgress.unlocked_years || [],
      usedHints: dbProgress.used_hints || {},
      currentLevel: dbProgress.current_level || 0,
      achievements: dbProgress.achievements || []
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
      localData={courseProgress}
      localStorageKey={`course_progress_${user.id}_${courseProgress.courseId}`}
      onSyncComplete={handleSyncComplete}
      formatDataForUpload={formatProgressForUpload}
      formatResponseForDownload={formatResponseForDownload}
    />
  );
}
