import React, { useState, useCallback, useEffect } from 'react';
import Header from '../Header';
import CommandList from '../CommandList';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { cn } from '../../utils/cn';

interface SimonGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const COMMANDS = [
  { command: "red", description: "Select red color" },
  { command: "blue", description: "Select blue color" },
  { command: "green", description: "Select green color" },
  { command: "yellow", description: "Select yellow color" }
];

const COLORS = ['red', 'blue', 'green', 'yellow'];

const SimonGame: React.FC<SimonGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const playSequence = useCallback(async () => {
    setIsPlaying(true);
    for (const color of sequence) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!isMuted) {
        const audio = new Audio(`/sounds/${color}.mp3`);
        audio.play();
      }
    }
    setIsPlaying(false);
  }, [sequence, isMuted]);

  const startGame = useCallback(() => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence([newColor]);
    setPlayerSequence([]);
    setScore(0);
  }, []);

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence, playSequence]);

  const handleColorClick = useCallback((color: string) => {
    if (isPlaying) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (!isMuted) {
      const audio = new Audio(`/sounds/${color}.mp3`);
      audio.play();
    }

    const currentIndex = playerSequence.length;
    if (sequence[currentIndex] !== color) {
      alert('Game Over! Score: ' + score);
      startGame();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(prev => prev + sequence.length * 10);
      const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setTimeout(() => {
        setSequence([...sequence, newColor]);
        setPlayerSequence([]);
      }, 1000);
    }
  }, [isPlaying, playerSequence, sequence, score, isMuted, startGame]);

  const handleCommand = useCallback((command: string) => {
    const color = command.toLowerCase().trim();
    if (COLORS.includes(color)) {
      handleColorClick(color);
    }
  }, [handleColorClick]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: console.error,
    onStart: () => {},
    onStop: () => {}
  });

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Simon Says"
        />

        <CommandList commands={COMMANDS} />

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-2xl mb-4">Score: {score}</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                disabled={isPlaying}
                className={cn(
                  "aspect-square rounded-lg transition-all transform",
                  `bg-${color}-500 hover:bg-${color}-400`,
                  isPlaying && sequence[sequence.length - 1] === color && "scale-110"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimonGame;