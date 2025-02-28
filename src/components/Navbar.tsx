
import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ModeToggle } from "./ModeToggle";
import { Icons } from "./icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, BookOpen, GraduationCap, Users, LayoutDashboard, Flask } from "lucide-react";

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const routes = [
    { href: "/", label: "Accueil" },
    { href: "/courses", label: "Cours", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { href: "/dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { href: "/community", label: "Communauté", icon: <Users className="w-4 h-4 mr-2" /> },
    { href: "/labs", label: "Labs", icon: <Flask className="w-4 h-4 mr-2" /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`py-3 px-4 sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block">CodeLearn</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={`flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors ${
                location.pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {route.icon} {route.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Se connecter</Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      to={route.href}
                      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === route.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.icon} {route.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
