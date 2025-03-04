
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
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Log authentication state for debugging
  useEffect(() => {
    if (isLoaded) {
      console.log("Authentication state:", { isSignedIn, userId: user?.id });
    }
  }, [isLoaded, isSignedIn, user]);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotificationProvider>
        <HashRouter>
          <Navbar onAdminClick={toggleAdmin} />
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Chargement du portfolio...</p>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/community" element={<Community />} />
              <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/settings" element={isSignedIn ? <Settings /> : <Navigate to="/" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
          
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
