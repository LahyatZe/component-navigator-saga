
import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
  currentQuestion: Question;
  level: number;
}

const QuizModal: FC<QuizModalProps> = ({ isOpen, onClose, onAnswer, currentQuestion, level }) => {
  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Niveau {level} - Question
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-lg mb-4">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
