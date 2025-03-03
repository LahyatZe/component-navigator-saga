
import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@clerk/clerk-react";
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
import NotFound from './pages/NotFound';
import AdminPanel from './components/AdminPanel';
import AdminDataMigration from './components/AdminDataMigration';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Force redirect if user is already signed in and trying to access auth pages
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const currentPath = window.location.hash;
      // Check if on a sign-in or sign-up page
      if (currentPath === '#/sign-in' || currentPath === '#/sign-up' || 
          currentPath.startsWith('#/sign-in/') || currentPath.startsWith('#/sign-up/')) {
        window.location.href = '#/dashboard';
      }
    }
  }, [isSignedIn, isLoaded]);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
            <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/sign-in" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign-in/*" element={isSignedIn ? <Navigate to="/dashboard" /> : <SignIn />} />
            <Route path="/sign-up/*" element={isSignedIn ? <Navigate to="/dashboard" /> : <SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
        
        {isAdminOpen && (
          <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)}>
            <AdminDataMigration />
          </AdminPanel>
        )}
        
        <Toaster />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
