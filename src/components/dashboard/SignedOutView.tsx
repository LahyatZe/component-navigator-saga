
import { FC, useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BookOpen, Code, Users, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SignedOutView: FC = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const clerkSignInUrl = "https://steady-starling-83.accounts.dev/sign-in";
  const clerkSignUpUrl = "https://steady-starling-83.accounts.dev/sign-up";

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur CodeCampus</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La plateforme d'apprentissage interactive pour développer vos compétences en programmation
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connectez-vous pour accéder à la plateforme</CardTitle>
            <CardDescription>
              Créez un compte ou connectez-vous pour suivre votre progression et accéder à tous les contenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-center gap-4">
                <a 
                  href={clerkSignInUrl}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
                >
                  Se connecter <ArrowRight className="h-4 w-4" />
                </a>
                <a 
                  href={clerkSignUpUrl}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background border border-input hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8"
                >
                  Créer un compte <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Cours structurés</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Des cours progressifs adaptés à tous les niveaux pour développer vos compétences pas à pas.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Code className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Projets pratiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Appliquez vos connaissances sur des projets concrets avec accompagnement personnalisé.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Labs interactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pratiquez dans notre environnement de développement intégré avec correction automatique.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Communauté active</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Échangez avec d'autres apprenants et obtenez de l'aide sur vos projets et problèmes.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignedOutView;
