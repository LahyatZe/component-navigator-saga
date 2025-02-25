
import { FC } from 'react';
import { ArrowDown } from 'lucide-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';

const Home: FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background relative">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bienvenue sur Mon Portfolio
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
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
      </div>

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
