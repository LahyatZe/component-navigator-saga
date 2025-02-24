
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center space-x-8 py-4">
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
      </div>
    </nav>
  );
};

export default Navbar;
