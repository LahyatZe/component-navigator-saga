
import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
  currentQuestion: Question;
  level: number;
}

const QuizModal: FC<QuizModalProps> = ({ isOpen, onClose, onAnswer, currentQuestion, level }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleAnswer = () => {
    if (selectedIndex === null) return;
    
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    onAnswer(isCorrect);
    
    // Reset state for next quiz
    setSelectedIndex(null);
    setShowExplanation(false);
  };
  
  const handleOptionClick = (index: number) => {
    setSelectedIndex(index);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Quiz - Progression vers le niveau {level}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
            <Badge variant="outline" className="text-xs">
              Question de niveau {level}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
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
