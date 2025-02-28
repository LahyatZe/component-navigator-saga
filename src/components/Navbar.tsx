
import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';

interface NavbarProps {
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              CodeCampus
            </Link>
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
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10">
              Dashboard
            </Link>
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10"
              >
                Admin
              </button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
