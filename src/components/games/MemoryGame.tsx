import React, { useState, useCallback, useEffect } from 'react';
import { MemoryCard } from '../../types';
import Header from '../Header';
import CommandList from '../CommandList';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { cn } from '../../utils/cn';

interface MemoryGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const COMMANDS = [
  { command: "flip 1-16", description: "Flip a card by its number" },
  { command: "reset", description: "Reset the game" }
];

const CARD_SYMBOLS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];

const MemoryGame: React.FC<MemoryGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const initializeCards = useCallback(() => {
    const symbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
    const shuffled = symbols.sort(() => Math.random() - 0.5);
    return shuffled.map((value, id) => ({
      id,
      value,
      isFlipped: false,
      isMatched: false
    }));
  }, []);

  useEffect(() => {
    setCards(initializeCards());
  }, [initializeCards]);

  const handleCommand = useCallback((command: string) => {
    const match = command.match(/flip (\d+)/i);
    if (match) {
      const cardIndex = parseInt(match[1], 10) - 1;
      if (cardIndex >= 0 && cardIndex < cards.length && !cards[cardIndex].isMatched) {
        handleCardFlip(cardIndex);
      }
    } else if (command.includes('reset')) {
      setCards(initializeCards());
      setFlippedIndices([]);
      setMatchedPairs(0);
      setScore(0);
    }
  }, [cards, initializeCards]);

  const handleCardFlip = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      if (cards[firstIndex].value === cards[index].value) {
        newCards[firstIndex].isMatched = true;
        newCards[index].isMatched = true;
        setMatchedPairs(prev => prev + 1);
        setScore(prev => prev + 100);
      } else {
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[index].isFlipped = false;
          setCards([...newCards]);
        }, 1000);
      }
      setFlippedIndices([]);
    } else {
      setFlippedIndices([index]);
    }
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: console.error,
    onStart: () => {},
    onStop: () => {}
  });

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Memory Match"
        />

        <CommandList commands={COMMANDS} />

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-2xl mb-4">Score: {score}</div>
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardFlip(index)}
                className={cn(
                  "aspect-square rounded-lg text-4xl flex items-center justify-center transition-all transform",
                  card.isFlipped || card.isMatched
                    ? "bg-purple-500 rotate-0"
                    : "bg-white/10 rotate-180"
                )}
                disabled={card.isMatched || flippedIndices.length === 2}
              >
                {(card.isFlipped || card.isMatched) && card.value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;