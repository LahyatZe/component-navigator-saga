
import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertCircle, HelpCircle, Download, Lightbulb } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Question } from '@/types/quiz';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
  currentQuestion: Question | null;
  level: number;
  onUseHint: (hintIndex: number) => void;
  onDownloadCV: () => void;
}

const QuizModal: FC<QuizModalProps> = ({ 
  isOpen, 
  onClose, 
  onAnswer, 
  currentQuestion, 
  level,
  onUseHint,
  onDownloadCV 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  // Reset state when the question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.id) {
      setSelectedIndex(null);
      setShowExplanation(false);
      setUserInput('');
    }
  }, [currentQuestion?.id]);
  
  // Safety guard to prevent errors if currentQuestion is null
  if (!currentQuestion) {
    return null;
  }
  
  const handleAnswer = () => {
    if (selectedIndex === null) return;
    
    try {
      // Use correctAnswer or correctOptionIndex depending on which one is available
      const correctIndex = typeof currentQuestion.correctAnswer !== 'undefined' 
        ? currentQuestion.correctAnswer 
        : currentQuestion.correctOptionIndex;
      
      if (correctIndex === undefined) {
        console.error("Cannot determine correct answer index");
        return;
      }
      
      const isCorrect = selectedIndex === correctIndex;
      
      // Call the onAnswer callback with the result
      onAnswer(isCorrect);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };
  
  const handleOptionClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleShowHint = (index: number) => {
    try {
      onUseHint(index);
    } catch (error) {
      console.error("Error showing hint:", error);
    }
  };
  
  // Safely handle usedHints, ensuring it's always an array
  const usedHints = currentQuestion.usedHints || [];

  // Handle the Dialog properly to prevent empty screen
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  
  // Ensure we have valid options before rendering
  const options = currentQuestion?.options || [];
  const hints = currentQuestion?.hints || [];
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Quiz - Progression vers le niveau {level}
          </DialogTitle>
          <DialogDescription>
            Répondez correctement pour débloquer le niveau suivant
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
            <Badge variant="outline" className="text-xs">
              Question de niveau {level}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg transition-all cursor-pointer ${
                  selectedIndex === index 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-muted-foreground/50'
                }`}
                onClick={() => handleOptionClick(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    selectedIndex === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="text-base">{option}</div>
                </div>
              </div>
            ))}
          </div>
          
          {hints && hints.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Indices disponibles ({usedHints.length}/{hints.length})
              </h4>
              <div className="space-y-2">
                {hints.map((hint, index) => (
                  <div key={index} className="text-sm">
                    {usedHints.includes(index.toString()) ? (
                      <div className="p-2 bg-muted/50 rounded-md">
                        {hint}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left"
                        onClick={() => handleShowHint(index)}
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Révéler l'indice {index + 1}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Recherchez des informations dans mon CV..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={onDownloadCV}
                title="Télécharger mon CV"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CV
              </Button>
            </div>
            {userInput.length > 2 && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm">
                Astuce: Consultez mon CV pour trouver plus d'informations sur {userInput}
              </div>
            )}
          </div>
          
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            {currentQuestion.explanation && (
              <Button 
                variant="outline" 
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                {showExplanation ? 'Masquer l\'explication' : 'Voir l\'explication'}
              </Button>
            )}
            
            <Button 
              onClick={handleAnswer}
              disabled={selectedIndex === null}
              className="ml-auto"
            >
              Valider ma réponse
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
