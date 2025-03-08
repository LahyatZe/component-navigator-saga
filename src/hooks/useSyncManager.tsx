
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { formatUserId } from '@/utils/formatUserId';

// Define valid table names explicitly as a union type
type ValidTableName = 'user_settings' | 'user_progress' | 'user_portfolio_progress' | 'user_achievements';

interface SyncOptions {
  tableName: ValidTableName;
  primaryKey: string[];
  localData: any;
  formatDataForUpload?: (data: any) => any;
  onSyncComplete?: (data: any) => void;
  localStorageKey?: string;
}

export const useSyncManager = () => {
  const { user } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncToDatabase = useCallback(async ({
    tableName,
    primaryKey,
    localData,
    formatDataForUpload = (data) => data,
    onSyncComplete
  }: SyncOptions) => {
    if (!user || !localData) return;

    setIsSyncing(true);
    setError(null);

    try {
      const formattedUserId = formatUserId(user.id);
      const formattedData = formatDataForUpload(localData);
      
      console.log(`Syncing data to ${tableName}:`, formattedData);
      
      // Check if a record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq(primaryKey[0], formattedUserId);
        
      if (fetchError) {
        throw new Error(`Error checking existing data: ${fetchError.message}`);
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        console.log(`Updating existing record in ${tableName}`);
        
        // Create an object for the condition
        const conditions: Record<string, any> = {};
        primaryKey.forEach(key => {
          conditions[key] = key === 'user_id' ? formattedUserId : formattedData[key];
        });
        
        const { data, error: updateError } = await supabase
          .from(tableName)
          .update(formattedData)
          .match(conditions);
          
        if (updateError) throw new Error(`Error updating data: ${updateError.message}`);
        result = data;
      } else {
        // Insert new record
        console.log(`Inserting new record into ${tableName}`);
        const { data, error: insertError } = await supabase
          .from(tableName)
          .insert([formattedData]);
          
        if (insertError) throw new Error(`Error inserting data: ${insertError.message}`);
        result = data;
      }
      
      setLastSynced(new Date());
      
      if (onSyncComplete) {
        onSyncComplete(result);
      }
      
      toast.success('Data synced successfully');
      return result;
    } catch (err) {
      console.error('Error syncing data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while syncing data';
      setError(errorMessage);
      toast.error(`Sync failed: ${errorMessage}`);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  const syncFromDatabase = useCallback(async ({
    tableName,
    primaryKey,
    localData, // Required to extract user information
    onSyncComplete,
    localStorageKey
  }: SyncOptions) => {
    if (!user) return null;
    
    setIsSyncing(true);
    setError(null);
    
    try {
      const formattedUserId = formatUserId(user.id);
      
      console.log(`Fetching data from ${tableName} for user ID:`, formattedUserId);
      
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq(primaryKey[0], formattedUserId);
        
      if (fetchError) {
        throw new Error(`Error fetching data: ${fetchError.message}`);
      }
      
      console.log(`Data fetched from ${tableName}:`, data);
      
      setLastSynced(new Date());
      
      if (onSyncComplete) {
        onSyncComplete(data);
      }
      
      if (localStorageKey && data && data.length > 0) {
        localStorage.setItem(localStorageKey, JSON.stringify(data[0]));
      }
      
      toast.success('Data loaded successfully');
      return data;
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while fetching data';
      setError(errorMessage);
      toast.error(`Fetch failed: ${errorMessage}`);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  return {
    syncToDatabase,
    syncFromDatabase,
    isSyncing,
    lastSynced,
    error
  };
};
