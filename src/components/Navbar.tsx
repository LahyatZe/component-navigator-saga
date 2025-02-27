
import { FC, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton,
  useUser
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User, Home, Code, BookOpen, Mail, Rocket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, isSignedIn } = useUser();
  const location = useLocation();

  // Collecte de statistiques
  useEffect(() => {
    if (isSignedIn && user) {
      // Enregistrement de la visite
      console.log("Visite enregistrée:", {
        userId: user.id,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });
      
      // Dans un cas réel, ces données seraient envoyées à un service d'analyse
    }
  }, [isSignedIn, user, location.pathname]);

  // Suivi des interactions utilisateur
  useEffect(() => {
    const trackInteraction = (e: MouseEvent) => {
      if (isSignedIn && user) {
        // Enregistrement de l'interaction
        console.log("Interaction enregistrée:", {
          userId: user.id,
          timestamp: new Date().toISOString(),
          type: e.type,
          target: (e.target as HTMLElement).tagName,
          page: window.location.pathname
        });
      }
    };

    window.addEventListener("click", trackInteraction);
    return () => window.removeEventListener("click", trackInteraction);
  }, [isSignedIn, user]);

  const scrollToSection = (id: string) => {
    // Si nous sommes sur la page d'accueil, faire défiler vers la section
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Sinon, rediriger vers la page d'accueil avec un paramètre d'ancre
      window.location.href = `/#${id}`;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link 
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              Portfolio
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection("hero")}
                className={`flex items-center gap-2 transition-colors ${
                  location.pathname === '/' 
                    ? 'text-primary hover:text-primary/80' 
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                À propos
              </button>
              <button 
                onClick={() => scrollToSection("projects")}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Code className="w-4 h-4" />
                Projets
              </button>
              <Link 
                to="/labs"
                className={`flex items-center gap-2 transition-colors ${
                  isActive('/labs') 
                    ? 'text-primary hover:text-primary/80' 
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <Rocket className="w-4 h-4" />
                Labs
              </Link>
              <button 
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                userProfileMode="navigation"
                userProfileUrl="/"
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  Se connecter
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="flex items-center gap-2">
                  S'inscrire
                </Button>
              </SignUpButton>
            </SignedOut>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
