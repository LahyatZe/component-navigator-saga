
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <div className="text-center px-4 py-16 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">Portfolio</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sohaib Zeghouani
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Développeur Web passionné spécialisé dans le développement d'applications web et de solutions d'entreprise.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm">Angular</Badge>
            <Badge variant="secondary" className="text-sm">TypeScript</Badge>
            <Badge variant="secondary" className="text-sm">React.js</Badge>
            <Badge variant="secondary" className="text-sm">Express.js</Badge>
            <Badge variant="secondary" className="text-sm">SQL</Badge>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              variant="default" 
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2"
            >
              Voir mes projets <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              asChild
            >
              <a href="/CV_Sohaib_ZEGHOUANI.pdf" download className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Télécharger CV
              </a>
            </Button>
          </div>
          
          <div className="flex justify-center gap-6">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <Linkedin size={24} />
            </a>
            <a href="mailto:youremail@example.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
