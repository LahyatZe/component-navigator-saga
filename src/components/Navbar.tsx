import { FC } from 'react';
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";  // Import useTheme hook for theme management

const Navbar: FC = () => {
  const { theme, setTheme } = useTheme(); // Get current theme and setTheme function

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link 
              to="/projects" 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Projects
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} // Toggle theme
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                <path d="M12 4v2M12 18v2M18 12h2M4 12H2M16.243 7.757l-1.414 1.414M7.757 16.243l-1.414 1.414M16.243 16.243l-1.414-1.414M7.757 7.757l-1.414-1.414" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                <path d="M12 4v2M12 18v2M18 12h2M4 12H2M16.243 7.757l-1.414 1.414M7.757 16.243l-1.414 1.414M16.243 16.243l-1.414-1.414M7.757 7.757l-1.414-1.414" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
