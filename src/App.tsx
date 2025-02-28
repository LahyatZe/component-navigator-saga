
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/sonner";
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

  // For development, show a message if Clerk key is not found
  if (!clerkPubKey) {
    console.warn("Clerk publishable key not found, authentication will not work properly");
  }

  const toggleAdmin = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <HashRouter>
        <Navbar onAdminClick={toggleAdmin} />
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
