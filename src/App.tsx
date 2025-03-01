
import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
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

// Import your public Clerk key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClerkError, setIsClerkError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if using placeholder key
    if (clerkPubKey === 'pk_test_placeholder') {
      console.warn("Using placeholder Clerk key - authentication will be limited");
      // Set a small delay to ensure the UI is ready before showing the error
      const timer = setTimeout(() => {
        setIsClerkError(true);
        setIsLoading(false);
        toast.error("Authentication is disabled. Please add a valid Clerk API key for full functionality.", {
          duration: 5000,
        });
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // If we have a real key, just set loading to false after a short delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  // Create a simplified app without Clerk if there's an error
  if (isClerkError) {
    return (
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
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
    );
  }

  // Regular app with Clerk
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
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
    </ClerkProvider>
  );
}

export default App;
