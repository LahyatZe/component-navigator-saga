
import { useRef, useCallback } from 'react';
import { UserProgress } from '@/types/course';

export const useProgressUpdater = (
  progress: UserProgress | null,
  saveProgressToStorage: (progress: UserProgress) => void
) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    if (!progress) return;
    
    // Don't update if nothing has changed
    let hasChanged = false;
    for (const key in updates) {
      if (JSON.stringify(updates[key]) !== JSON.stringify(progress[key])) {
        hasChanged = true;
        break;
      }
    }
    
    if (!hasChanged) {
      console.log("No changes detected, skipping update");
      return;
    }
    
    const updatedProgress = {
      ...progress,
      ...updates,
      lastAccessedAt: new Date().toISOString()
    };
    
    // Clear any existing timeout to prevent multiple saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce the save operation to prevent excessive API calls
    saveTimeoutRef.current = setTimeout(() => {
      saveProgressToStorage(updatedProgress);
      saveTimeoutRef.current = null;
    }, 2000); // 2 second debounce
    
    return updatedProgress;
  }, [progress, saveProgressToStorage]);

  return { updateProgress };
};
