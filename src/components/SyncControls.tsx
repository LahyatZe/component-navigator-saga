
import { useState } from 'react';
import { Button } from './ui/button';
import { useSyncManager } from '@/hooks/useSyncManager';
import { Cloud, Download, Upload, RefreshCw } from 'lucide-react';

type ValidTableName = 'user_settings' | 'user_progress' | 'user_portfolio_progress' | 'user_achievements';

interface SyncControlsProps {
  tableName: ValidTableName;
  primaryKey: string[];
  localData: any;
  localStorageKey?: string;
  onSyncComplete?: (data: any) => void;
  formatDataForUpload?: (data: any) => any;
  formatResponseForDownload?: (data: any) => any;
}

export function SyncControls({
  tableName,
  primaryKey,
  localData,
  localStorageKey,
  onSyncComplete,
  formatDataForUpload = (data) => data,
  formatResponseForDownload = (data) => data
}: SyncControlsProps) {
  const { 
    syncToDatabase, 
    syncFromDatabase, 
    isSyncing,
    lastSynced,
    error
  } = useSyncManager();
  
  const [syncDirection, setSyncDirection] = useState<'to' | 'from' | null>(null);

  const handlePushToCloud = async () => {
    setSyncDirection('to');
    try {
      await syncToDatabase({
        tableName,
        primaryKey,
        localData,
        formatDataForUpload,
        onSyncComplete
      });
    } finally {
      setSyncDirection(null);
    }
  };

  const handlePullFromCloud = async () => {
    setSyncDirection('from');
    try {
      await syncFromDatabase({
        tableName,
        primaryKey,
        localData, // Make sure to pass localData for the user_id value
        onSyncComplete,
        localStorageKey
      });
    } finally {
      setSyncDirection(null);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Cloud className="h-4 w-4" />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1"
        onClick={handlePushToCloud}
        disabled={isSyncing}
      >
        {syncDirection === 'to' ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        Save
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1"
        onClick={handlePullFromCloud}
        disabled={isSyncing}
      >
        {syncDirection === 'from' ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        Load
      </Button>
      
      {error && (
        <span className="text-destructive text-xs">Error: {error}</span>
      )}
      
      {lastSynced && !error && (
        <span className="text-xs">
          Last synced: {lastSynced.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
