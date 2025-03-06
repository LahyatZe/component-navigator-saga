
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { formatUserId } from '@/utils/formatUserId';

export type SyncableData = {
  userId: string;
  courseId?: string;
  [key: string]: any;
};

// Define valid table names based on Supabase types
export type ValidTableName = 
  | 'achievements'
  | 'courses'
  | 'exercises'
  | 'lessons'
  | 'modules' 
  | 'quizzes'
  | 'resources'
  | 'test_cases'
  | 'user_achievements'
  | 'user_portfolio_progress'
  | 'user_progress'
  | 'user_settings';

interface SyncOptions {
  tableName: ValidTableName;
  primaryKey: string[];
  formatData?: (data: any) => any;
  formatResponse?: (data: any) => any;
}

interface SyncResult {
  success: boolean;
  data?: any;
  error?: any;
}

export const useSyncManager = () => {
  const { user } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncToCloud = useCallback(async (
    localData: SyncableData | SyncableData[],
    options: SyncOptions
  ): Promise<SyncResult> => {
    if (!user) {
      toast.error("You must be signed in to sync data");
      return { success: false, error: "Authentication required" };
    }

    const dataArray = Array.isArray(localData) ? localData : [localData];
    if (dataArray.length === 0) {
      toast.info("No data to sync");
      return { success: true, data: [] };
    }

    setIsSyncing(true);
    const { tableName, primaryKey, formatData } = options;

    try {
      console.log(`Starting sync to cloud for ${tableName}...`);
      const formattedUserId = formatUserId(user.id);
      
      // Check session before attempting sync
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active Supabase session");
      }

      // Process data batch and prepare for upsert
      const formattedData = dataArray.map(item => {
        const processedItem = formatData ? formatData(item) : item;
        return {
          ...processedItem,
          user_id: formattedUserId, // Ensure correct user_id format
          last_synced_at: new Date().toISOString()
        };
      });

      // Perform upsert operation with explicit typing for tableName
      const tableName_typed = tableName as ValidTableName;
      const { data, error } = await supabase
        .from(tableName_typed)
        .upsert(formattedData, { 
          onConflict: primaryKey.join(',') 
        })
        .select();

      if (error) {
        console.error(`Error syncing to ${tableName}:`, error);
        throw error;
      }

      const syncTime = new Date();
      setLastSyncTime(syncTime);
      localStorage.setItem(`last_sync_${tableName}`, syncTime.toISOString());
      
      toast.success(`Successfully synced data to cloud`);
      console.log(`Sync to ${tableName} completed successfully:`, data);
      
      return { success: true, data };
    } catch (error) {
      console.error("Sync to cloud failed:", error);
      toast.error(error.message || "Failed to sync data to cloud");
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // Define return type explicitly to prevent infinite type instantiation
  const syncFromCloud = useCallback(async (
    options: SyncOptions,
    localStorageKey?: string
  ): Promise<SyncResult> => {
    if (!user) {
      toast.error("You must be signed in to sync data");
      return { success: false, error: "Authentication required" };
    }

    setIsSyncing(true);
    const { tableName, formatResponse } = options;

    try {
      console.log(`Starting sync from cloud for ${tableName}...`);
      const formattedUserId = formatUserId(user.id);
      
      // Check session before attempting sync
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active Supabase session");
      }

      // Explicitly type the tableName to help TypeScript
      const tableName_typed = tableName as ValidTableName;
      
      // Fetch data from Supabase with explicit typing
      const { data, error } = await supabase
        .from(tableName_typed)
        .select('*')
        .eq('user_id', formattedUserId);

      if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        throw error;
      }

      if (!data || data.length === 0) {
        toast.info("No data found in cloud to sync");
        return { success: true, data: [] };
      }

      // Process and store the cloud data
      const processedData = formatResponse ? formatResponse(data) : data;
      
      // If localStorageKey is provided, update localStorage
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, JSON.stringify(processedData));
      }

      const syncTime = new Date();
      setLastSyncTime(syncTime);
      localStorage.setItem(`last_sync_${tableName}`, syncTime.toISOString());
      
      toast.success(`Successfully synced data from cloud`);
      console.log(`Sync from ${tableName} completed successfully:`, processedData);
      
      return { success: true, data: processedData };
    } catch (error) {
      console.error("Sync from cloud failed:", error);
      toast.error(error.message || "Failed to sync data from cloud");
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // Get last sync time for a specific table
  const getLastSyncTime = useCallback((tableName: ValidTableName) => {
    const syncTimeStr = localStorage.getItem(`last_sync_${tableName}`);
    return syncTimeStr ? new Date(syncTimeStr) : null;
  }, []);

  return {
    syncToCloud,
    syncFromCloud,
    isSyncing,
    lastSyncTime,
    getLastSyncTime
  };
};
