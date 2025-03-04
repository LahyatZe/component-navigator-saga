
import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useAuth, useUser } from "@clerk/clerk-react";
import { NotificationProvider } from "@/contexts/NotificationContext";
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

  useEffect(() => {
    // Only set loading to false once Clerk has loaded
    if (isLoaded) {
      // Add a small delay to ensure authentication state is properly synced
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("App loaded, auth state:", { 
          isSignedIn, 
          userId: user?.id,
          location: window.location.href
        });
      }, 1500); // Increased timeout to ensure auth state is fully resolved
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, user]);

  // Log authentication state for debugging
  useEffect(() => {
    if (isLoaded) {
      console.log("Authentication state updated:", { 
        isSignedIn, 
        userId: user?.id,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        isLoaded,
        currentPath: window.location.href
      });
    }
  }, [isLoaded, isSignedIn, user]);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  // If Clerk hasn't loaded yet, show loading spinner
  if (!isLoaded) {
    console.log("Clerk is still loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Create a protected route component
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
            {/* Public root route with SignedOutView for non-authenticated users */}
            <Route 
              path="/" 
              element={
                isSignedIn ? <Home /> : <SignedOutView />
              } 
            />
            
            {/* All other routes protected */}
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
