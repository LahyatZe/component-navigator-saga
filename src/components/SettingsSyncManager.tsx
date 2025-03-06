
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SettingsSync } from './SettingsSync';

interface SettingsSyncManagerProps {
  settings: any;
  onSettingsUpdate: (updatedSettings: any) => void;
  className?: string;
}

export function SettingsSyncManager({
  settings,
  onSettingsUpdate,
  className = ''
}: SettingsSyncManagerProps) {
  if (!settings) {
    return null;
  }
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Settings Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsSync 
          settings={settings}
          onSettingsUpdate={onSettingsUpdate}
        />
      </CardContent>
    </Card>
  );
}
