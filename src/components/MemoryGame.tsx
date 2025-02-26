
import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy } from 'lucide-react';
import { toast } from "sonner";

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: FC = () => {
  const emojis = ['🚀', '💻', '⭐', '🎮', '🎨', '🔧', '🎯', '🎪'];
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 || 
      flippedCards.includes(cardId) || 
      cards[cardId].isMatched
    ) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;
      
      if (cards[firstCard].emoji === cards[secondCard].emoji) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCard || card.id === secondCard
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);
        
        // Check if all cards are matched
        const allMatched = cards.every((card, index) => 
          card.isMatched || index === firstCard || index === secondCard
        );
        
        if (allMatched) {
          if (!bestScore || moves + 1 < bestScore) {
            setBestScore(moves + 1);
            toast.success("Nouveau record ! 🎉");
          }
          toast.success("Félicitations ! Vous avez gagné ! 🏆");
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Memory Game</h2>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Coups :</span>
            <span className="font-bold">{moves}</span>
          </div>
          {bestScore && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-muted-foreground">Meilleur score :</span>
              <span className="font-bold">{bestScore}</span>
            </div>
          )}
        </div>
        <Button onClick={initializeGame} variant="outline" className="mb-6">
          Nouvelle partie
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <Card
            key={card.id}
            className={`aspect-square flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform ${
              card.isMatched || flippedCards.includes(card.id)
                ? 'bg-primary/5 rotate-y-180'
                : 'bg-primary/10 hover:bg-primary/20'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.isMatched || flippedCards.includes(card.id)) ? card.emoji : '?'}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
