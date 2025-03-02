
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
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a small delay to ensure the UI is ready before proceeding
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only show warning toast if using a placeholder key
      if (!clerkPubKey || clerkPubKey === 'pk_test_placeholder') {
        console.warn("Missing or invalid Clerk key - authentication will be limited");
        toast.warning("Authentication requires a valid Clerk key. Some portfolio functionality may be limited.", {
          duration: 5000,
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  // Check if we're using a valid Clerk key
  const hasValidClerkKey = clerkPubKey && clerkPubKey !== 'pk_test_placeholder';

  // If we have a valid Clerk key, use ClerkProvider, otherwise render without it
  const AppContent = () => (
    <>
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
    </>
  );

  return (
    <HashRouter>
      {hasValidClerkKey ? (
        <ClerkProvider publishableKey={clerkPubKey}>
          <AppContent />
        </ClerkProvider>
      ) : (
        <AppContent />
      )}
    </HashRouter>
  );
}

export default App;
