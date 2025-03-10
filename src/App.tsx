import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useAuth, useUser } from "@clerk/clerk-react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useClerkSupabaseSync } from '@/hooks/useClerkSupabaseSync';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Labs from './pages/Labs';
import Contact from './pages/Contact';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AdminPanel from './components/AdminPanel';
import AdminDataMigration from './components/AdminDataMigration';
import SignedOutView from './components/dashboard/SignedOutView';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  
  const { isSynced, isSyncing, error: syncError, sessionVerified } = useClerkSupabaseSync();

  useEffect(() => {
    if (isLoaded && (!isSignedIn || (isSignedIn && (isSynced || sessionVerified || syncError)))) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("App loaded, auth state:", { 
          isSignedIn, 
          userId: user?.id,
          location: window.location.href,
          supabaseSynced: isSynced,
          sessionVerified: sessionVerified,
          syncError: syncError
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, user, isSynced, syncError, sessionVerified]);

  useEffect(() => {
    if (isLoaded) {
      console.log("Authentication state updated:", { 
        isSignedIn, 
        userId: user?.id,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        isLoaded,
        supabaseSynced: isSynced,
        sessionVerified: sessionVerified,
        currentPath: window.location.href
      });
    }
  }, [isLoaded, isSignedIn, user, isSynced, sessionVerified]);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  if (!isLoaded || (isSignedIn && isSyncing)) {
    console.log("Clerk is still loading or syncing with Supabase...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">
            {isSyncing ? "Synchronizing authentication..." : "Loading authentication..."}
          </p>
          {syncError && (
            <p className="text-sm text-red-500 mt-2 max-w-md text-center">
              {syncError} <br /> Please wait, retrying automatically...
            </p>
          )}
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Chargement du portfolio...</p>
          </div>
        </div>
      );
    }
    
    return isSignedIn ? children : <SignedOutView />;
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotificationProvider>
        <HashRouter>
          <Navbar onAdminClick={toggleAdmin} />
          
          <Routes>
            <Route 
              path="/" 
              element={
                isSignedIn ? <Home /> : <SignedOutView />
              } 
            />
            
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><Project /></ProtectedRoute>} />
            <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>
          
          {isAdminOpen && (
            <AdminPanel
              isOpen={isAdminOpen}
              onClose={() => setIsAdminOpen(false)}
            >
              <AdminDataMigration />
            </AdminPanel>
          )}
          
          <Toaster />
        </HashRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
