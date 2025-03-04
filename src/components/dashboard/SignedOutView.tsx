
import { FC, useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BookOpen, Code, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SignedOutView: FC = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email");
      return;
    }

    if (isSignInLoaded && signIn) {
      try {
        setIsProcessing(true);
        const result = await signIn.create({
          identifier: email,
          strategy: "email_code",
        });
        
        if (result.status === "needs_first_factor") {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: result.supportedFirstFactors.find(
              factor => factor.strategy === "email_code"
            )?.emailAddressId,
          });
          toast.success("Code de vérification envoyé. Vérifiez votre email.");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        toast.error("Erreur lors de la connexion. Veuillez réessayer.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSignUp = async () => {
    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email");
      return;
    }

    if (isSignUpLoaded && signUp) {
      try {
        setIsProcessing(true);
        const result = await signUp.create({
          emailAddress: email,
        });
        
        if (result.status === "missing_requirements") {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          toast.success("Code de vérification envoyé. Vérifiez votre email.");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

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
                <Button 
                  size="lg" 
                  onClick={handleSignIn} 
                  disabled={isProcessing || !email.trim()}
                >
                  {isProcessing ? "Chargement..." : "Se connecter"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleSignUp} 
                  disabled={isProcessing || !email.trim()}
                >
                  {isProcessing ? "Chargement..." : "Créer un compte"}
                </Button>
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
