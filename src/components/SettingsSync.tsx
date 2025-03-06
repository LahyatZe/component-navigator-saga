
import { useState, useEffect } from 'react';
import { SyncControls } from './SyncControls';
import { useUser } from '@clerk/clerk-react';

interface UserSettings {
  userId: string;
  fullName?: string;
  bio?: string;
  preferences: {
    darkMode: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface SettingsSyncProps {
  settings: UserSettings;
  onSettingsUpdate: (updatedSettings: UserSettings) => void;
}

export function SettingsSync({ 
  settings, 
  onSettingsUpdate 
}: SettingsSyncProps) {
  const { user } = useUser();
  
  if (!user || !settings) {
    return null;
  }

  // Format data for Supabase upload
  const formatSettingsForUpload = (settingsData: UserSettings) => {
    return {
      user_id: settingsData.userId,
      full_name: settingsData.fullName || null,
      bio: settingsData.bio || null,
      preferences: settingsData.preferences || {
        darkMode: false,
        pushNotifications: true,
        emailNotifications: true
      },
      last_updated: new Date().toISOString()
    };
  };

  // Format response from Supabase for local storage
  const formatResponseForDownload = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const dbSettings = data[0]; // Get the first matching settings
    
    return {
      userId: user.id,
      fullName: dbSettings.full_name || '',
      bio: dbSettings.bio || '',
      preferences: dbSettings.preferences || {
        darkMode: false,
        pushNotifications: true,
        emailNotifications: true
      },
      lastUpdated: new Date().toISOString()
    };
  };

  const handleSyncComplete = (data: any) => {
    if (data && data.length > 0) {
      const formattedSettings = formatResponseForDownload(data);
      if (formattedSettings) {
        onSettingsUpdate(formattedSettings);
      }
    }
  };

  return (
    <SyncControls
      tableName="user_settings"
      primaryKey={['user_id']}
      localData={settings}
      localStorageKey={`user_settings_${user.id}`}
      onSyncComplete={handleSyncComplete}
      formatDataForUpload={formatSettingsForUpload}
      formatResponseForDownload={formatResponseForDownload}
    />
  );
}
