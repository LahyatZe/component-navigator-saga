
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useSyncManager, SyncableData } from '@/hooks/useSyncManager';
import { Loader2, Upload, Download, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface SyncControlsProps {
  tableName: string;
  primaryKey: string[];
  localData: SyncableData | SyncableData[];
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
  formatDataForUpload,
  formatResponseForDownload
}: SyncControlsProps) {
  const { syncToCloud, syncFromCloud, isSyncing, getLastSyncTime } = useSyncManager();
  const [isSyncingUp, setIsSyncingUp] = useState(false);
  const [isSyncingDown, setIsSyncingDown] = useState(false);
  
  const lastSyncTime = getLastSyncTime(tableName);
  const lastSyncDisplay = lastSyncTime 
    ? formatDistanceToNow(lastSyncTime, { addSuffix: true }) 
    : 'Never';

  const handleSyncToCloud = async () => {
    if (!localData || (Array.isArray(localData) && localData.length === 0)) {
      toast.warning("No data to upload");
      return;
    }

    setIsSyncingUp(true);
    try {
      const result = await syncToCloud(localData, {
        tableName,
        primaryKey,
        formatData: formatDataForUpload
      });
      
      if (result.success && onSyncComplete) {
        onSyncComplete(result.data);
      }
    } finally {
      setIsSyncingUp(false);
    }
  };

  const handleSyncFromCloud = async () => {
    setIsSyncingDown(true);
    try {
      const result = await syncFromCloud(
        {
          tableName,
          primaryKey,
          formatResponse: formatResponseForDownload
        },
        localStorageKey
      );
      
      if (result.success && onSyncComplete) {
        onSyncComplete(result.data);
      }
    } finally {
      setIsSyncingDown(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Last synced: {lastSyncDisplay}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncToCloud}
            disabled={isSyncingUp || isSyncingDown}
          >
            {isSyncingUp ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload to Cloud
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncFromCloud}
            disabled={isSyncingUp || isSyncingDown}
          >
            {isSyncingDown ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Sync from Cloud
          </Button>
        </div>
      </div>
    </div>
  );
}
