
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Moon, User, Shield, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { addNotification, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkModeEnabled, setDarkModeEnabled] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleDarkModeToggle = () => {
    const newDarkModeState = !darkModeEnabled;
    setDarkModeEnabled(newDarkModeState);
    localStorage.setItem('theme', newDarkModeState ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkModeState);
  };

  const handleClearAllNotifications = () => {
    clearAll();
    addNotification({
      title: 'Notifications Cleared',
      message: 'All notifications have been cleared',
      type: 'info'
    });
  };

  const handleTestNotification = () => {
    addNotification({
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1 mt-2">
                <Button 
                  variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('appearance')}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Appearance
                </Button>
                <Button 
                  variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  variant={activeTab === 'security' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    defaultValue={user?.fullName || ''} 
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    placeholder="Tell us about yourself"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}
          
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how CodeCampus looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkModeEnabled}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Notification Management</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleTestNotification}>
                      Send Test Notification
                    </Button>
                    <Button variant="destructive" onClick={handleClearAllNotifications}>
                      Clear All Notifications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm">
                      Changing password will log you out from all devices
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
