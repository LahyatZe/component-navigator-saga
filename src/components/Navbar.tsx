
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface NavbarProps {
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  // Check if user has admin role (for demonstration, checking email domain)
  // In a real app, you'd check for a proper admin flag or role
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress?.endsWith('@admin.com');

  // Get the app URL with hash-based routing - using the exact same format as in main.tsx
  const redirectUrl = `${window.location.origin}/#/dashboard`;
  console.log("Navbar redirect URL:", redirectUrl);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Enhanced console logging to debug authentication state
  React.useEffect(() => {
    console.log("Navbar auth state:", { 
      isSignedIn, 
      userId: user?.id,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userFullName: user?.fullName 
    });
  }, [isSignedIn, user]);

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              CodeCampus
            </Link>
            {isSignedIn && (
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    Home
                  </Link>
                  <Link to="/courses" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    Courses
                  </Link>
                  <Link to="/labs" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    Labs
                  </Link>
                  <Link to="/community" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    Community
                  </Link>
                  <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    About
                  </Link>
                  <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                    Contact
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
                  Dashboard
                </Link>
                <Link to="/settings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Link>
                {isAdmin && onAdminClick && (
                  <button 
                    onClick={onAdminClick}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10"
                  >
                    Admin
                  </button>
                )}
                <NotificationCenter />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* ModeToggle is outside the main menu items as it's always available */}
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
