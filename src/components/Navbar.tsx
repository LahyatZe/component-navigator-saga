
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
import { Sun, Moon, User } from "lucide-react";

const Navbar: FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, isSignedIn } = useUser();

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
  }, [isSignedIn, user]);

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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-8">
            <button 
              onClick={() => scrollToSection("hero")}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Projets
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Contact
            </button>
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
