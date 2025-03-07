
import { useState, useCallback } from 'react';
import { supabase, FromStringLiteral } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { formatUserId } from '@/utils/formatUserId';

export type SyncableData = {
  userId: string;
  courseId?: string;
  [key: string]: any;
};

// Define valid table names explicitly as a union type
export type ValidTableName = FromStringLiteral<string>;

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
      
      // Simplified session check
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("No active Supabase session");
      }

      const formattedData = dataArray.map(item => ({
        ...formatData ? formatData(item) : item,
        user_id: formattedUserId,
        last_synced_at: new Date().toISOString()
      }));

      // Use explicit type casting to work with the correct table type
      // Create a strongly-typed query with the specific table type
      const { data: resultData, error } = await supabase
        .from(tableName)
        .upsert(formattedData, { 
          onConflict: primaryKey.join(',') 
        });
      
      if (error) throw error;

      const syncTime = new Date();
      setLastSyncTime(syncTime);
      localStorage.setItem(`last_sync_${tableName}`, syncTime.toISOString());
      
      toast.success(`Successfully synced data to cloud`);
      return { success: true, data: resultData };
    } catch (error: any) {
      console.error("Sync to cloud failed:", error);
      toast.error(error.message || "Failed to sync data to cloud");
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

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
      
      // Simplified session check
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("No active Supabase session");
      }

      const userId = formatUserId(user.id);
      
      // Use the table name directly without casting
      // This works because we're now using proper typing
      const { data: resultData, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!resultData?.length) {
        toast.info("No data found in cloud to sync");
        return { success: true, data: [] };
      }

      const processedData = formatResponse ? formatResponse(resultData) : resultData;
      
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, JSON.stringify(processedData));
      }

      const syncTime = new Date();
      setLastSyncTime(syncTime);
      localStorage.setItem(`last_sync_${tableName}`, syncTime.toISOString());
      
      toast.success(`Successfully synced data from cloud`);
      return { success: true, data: processedData };
    } catch (error: any) {
      console.error("Sync from cloud failed:", error);
      toast.error(error.message || "Failed to sync data from cloud");
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

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
