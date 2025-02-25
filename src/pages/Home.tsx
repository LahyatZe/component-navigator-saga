
import { FC, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';

const Home: FC = () => {
  const [scrollY, setScrollY] = useState(0);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background relative overflow-hidden"
        style={{ 
          backgroundPosition: `50% ${scrollY * 0.5}px`
        }}
      >
        <div className="text-center px-4 relative z-10">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transform transition-all duration-1000"
            style={{ 
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: 1 - (scrollY * 0.001) 
            }}
          >
            Bienvenue sur Mon Portfolio
          </h1>
          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transform transition-all duration-1000"
            style={{ 
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: 1 - (scrollY * 0.002)
            }}
          >
            Développeur passionné spécialisé dans le développement web et les solutions d'entreprise
          </p>
          <button
            onClick={() => scrollToSection('about')}
            className="animate-bounce absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Scroll to content"
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </button>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-[10px] opacity-50">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-multiply filter blur-xl animate-pulse"
                style={{
                  backgroundColor: `hsla(${i * 120}, 100%, 50%, 0.1)`,
                  width: '60vw',
                  height: '60vw',
                  top: `${30 + i * 10}%`,
                  left: `${20 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `translateY(${scrollY * (0.1 * (i + 1))}px)`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline of Experience */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mon Parcours
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20" />
            
            {/* Timeline items */}
            {[
              {
                year: "2023",
                title: "Développeur Full Stack Senior",
                description: "Développement de solutions PWA et applications bancaires sécurisées"
              },
              {
                year: "2021",
                title: "Lead Developer",
                description: "Direction technique et développement de projets majeurs"
              },
              {
                year: "2019",
                title: "Développeur Web",
                description: "Création d'applications web modernes et responsive"
              }
            ].map((item, index) => (
              <div 
                key={item.year}
                className={`flex items-center mb-8 opacity-0 ${
                  scrollY > 500 + index * 100 ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-1/2 pr-8 text-right ${index % 2 === 1 ? 'order-2' : ''}`}>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
                <div className={`w-1/2 pl-8 ${index % 2 === 1 ? 'order-1 text-right' : ''}`}>
                  <span className="text-2xl font-bold text-primary">{item.year}</span>
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
