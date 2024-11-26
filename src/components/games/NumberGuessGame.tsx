import React, { useState, useCallback, useEffect } from 'react';
import Header from '../Header';
import CommandList from '../CommandList';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { NumberGuessState } from '../../types';

interface NumberGuessGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const COMMANDS = [
  { command: "guess [number]", description: "Make a guess" },
  { command: "new game", description: "Start a new game" }
];

const NumberGuessGame: React.FC<NumberGuessGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const [gameState, setGameState] = useState<NumberGuessState>({
    target: 0,
    guesses: [],
    min: 1,
    max: 100,
    score: 0
  });

  const initGame = useCallback(() => {
    const target = Math.floor(Math.random() * 100) + 1;
    setGameState(prev => ({
      target,
      guesses: [],
      min: 1,
      max: 100,
      score: prev.score
    }));
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleGuess = useCallback((guess: number) => {
    if (guess < 1 || guess > 100) return;

    setGameState(prev => {
      const newGuesses = [...prev.guesses, guess];
      let newScore = prev.score;
      
      if (guess === prev.target) {
        newScore += Math.max(100 - newGuesses.length * 10, 10);
      }

      return {
        ...prev,
        guesses: newGuesses,
        score: newScore
      };
    });
  }, []);

  const handleCommand = useCallback((command: string) => {
    const guessMatch = command.match(/guess (\d+)/i);
    
    if (guessMatch) {
      const guess = parseInt(guessMatch[1], 10);
      handleGuess(guess);
    } else if (command.toLowerCase().includes('new game')) {
      initGame();
    }
  }, [handleGuess, initGame]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: console.error,
    onStart: () => {},
    onStop: () => {}
  });

  const getHint = useCallback(() => {
    const lastGuess = gameState.guesses[gameState.guesses.length - 1];
    if (!lastGuess) return 'Make your first guess!';
    if (lastGuess === gameState.target) return 'You got it!';
    return lastGuess > gameState.target ? 'Lower!' : 'Higher!';
  }, [gameState.guesses, gameState.target]);

  const isGameOver = gameState.guesses.includes(gameState.target);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Number Guess"
        />

        <CommandList commands={COMMANDS} />

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-2xl mb-4">Score: {gameState.score}</div>
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{getHint()}</div>
            <div className="text-xl">
              Guesses: {gameState.guesses.length}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => handleGuess(num)}
                disabled={gameState.guesses.includes(num) || isGameOver}
                className={`p-3 rounded-lg text-center transition-colors ${
                  gameState.guesses.includes(num)
                    ? num === gameState.target
                      ? 'bg-green-500'
                      : 'bg-red-500/50'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {isGameOver && (
            <div className="mt-8 text-center">
              <div className="text-2xl mb-4">
                Congratulations! You found the number in {gameState.guesses.length} tries!
              </div>
              <button
                onClick={initGame}
                className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
              >
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberGuessGame;