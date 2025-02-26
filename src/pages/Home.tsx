
import { FC, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import { toast } from 'sonner';

const Home: FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [hasViewedCV, setHasViewedCV] = useState(false);

  const timelineItems = [
    {
      year: "2018",
      title: "Baccalauréat Économie et Sociale",
      company: "Lycée Honoré d'Urfé",
      description: "Études en économie et sciences sociales.",
    },
    {
      year: "2020",
      title: "Titre RNCP 5 - Développeur Web & Mobile",
      company: "Human Booster",
      description: "Formation en développement web full-stack.",
    },
    {
      year: "2020",
      title: "Stage Développeur Web Full-Stack",
      company: "My Pets Life",
      description: "Développement d'une plateforme web de gestion d'animaux.",
    },
    {
      year: "2022",
      title: "Alternant Consultant Métier",
      company: "Capgemini Technologies & Services",
      description: "Développement d'un produit d'entrée en relation pour Crédit Agricole.",
    },
    {
      year: "2023",
      title: "Titre RNCP 6 - Concepteur Développeur d'Application",
      company: "EPSI Montpellier",
      description: "Formation en conception et développement d'applications.",
    },
    {
      year: "2023",
      title: "Développeur Web Full-Stack",
      company: "Sam Outillage",
      description: "Développement et amélioration de la solution Sam Tool Supervisor.",
    },
    {
      year: "2024",
      title: "Développeur Full-Stack",
      company: "IGSI Calliope by Parthena Consultant",
      description: "Développement d'une PWA de gestion d'intervention intégrée à Sage 100.",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCVView = () => {
    setHasViewedCV(true);
    toast.success("Félicitations ! Vous avez débloqué le niveau 2 !");
    setCurrentLevel(2);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background relative overflow-hidden"
        style={{ backgroundPosition: `50% ${scrollY * 0.5}px` }}
      >
        <div className="text-center px-4 relative z-10">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transform transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.2}px)`, opacity: 1 - (scrollY * 0.001) }}
          >
            Bienvenue sur Mon Portfolio
          </h1>
          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transform transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: 1 - (scrollY * 0.002) }}
          >
            Développeur passionné spécialisé dans le développement web et les solutions d'entreprise
          </p>
        </div>
      </div>
      
      <button
        onClick={() => scrollToSection('timeline')}
        className="animate-bounce absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Scroll to content"
      >
        <ArrowDown className="w-6 h-6 text-primary" />
      </button>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mon Parcours
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20" />
            
            {timelineItems.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center mb-8 opacity-1 ${scrollY > 500 + index * 100 ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-1/2 pr-8 text-right ${index % 2 === 1 ? 'order-2' : ''}`}>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-primary">{item.company}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
                <div className={`w-1/2 pl-8 ${index % 2 === 1 ? 'order-1 text-right' : ''}`}>
                  <span className={`text-2xl font-bold text-primary ${index % 2 === 0 ? 'pr-8' : 'pr-8'}`}>
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <About />
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <Projects />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
