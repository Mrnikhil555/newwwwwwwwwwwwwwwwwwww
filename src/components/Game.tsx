import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Position } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useGameStore } from '../store/gameStore';
import GameBoard from './GameBoard';
import Header from './Header';
import Instructions from './Instructions';
import CommandList from './CommandList';
import { showToast } from './Toast';
import { useSound } from '../hooks/useSound';

const COMMANDS = [
  { command: "up", description: "Move player upward" },
  { command: "down", description: "Move player downward" },
  { command: "left", description: "Move player left" },
  { command: "right", description: "Move player right" },
  { command: "next level", description: "Go to next level" },
  { command: "restart", description: "Restart current level" }
];

interface GameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const Game: React.FC<GameProps> = ({ onBack, isMuted, onToggleMute }) => {
  const { playSound } = useSound(isMuted);
  const { currentLevel, adventureStages, incrementLevel, updateScore } = useGameStore();
  const currentStage = adventureStages[currentLevel - 1];
  
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [target, setTarget] = useState<Position>({ x: 0, y: 0 });
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [powerUps, setPowerUps] = useState<Position[]>([]);
  const [timeLeft, setTimeLeft] = useState(currentStage.timeLimit);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const initializeLevel = useCallback(() => {
    const gridSize = currentStage.gridSize;
    setPosition({ x: 0, y: 0 });
    setTarget({ x: gridSize - 1, y: gridSize - 1 });
    
    // Generate random obstacles
    const newObstacles = Array.from({ length: currentStage.obstacles }, () => ({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    })).filter(obs => 
      !(obs.x === 0 && obs.y === 0) && 
      !(obs.x === gridSize - 1 && obs.y === gridSize - 1)
    );
    
    setObstacles(newObstacles);

    // Generate power-ups
    const newPowerUps = Array.from({ length: currentStage.powerUps }, () => ({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    })).filter(pu => 
      !newObstacles.some(obs => obs.x === pu.x && obs.y === pu.y) &&
      !(pu.x === 0 && pu.y === 0) &&
      !(pu.x === gridSize - 1 && pu.y === gridSize - 1)
    );
    
    setPowerUps(newPowerUps);
    setTimeLeft(currentStage.timeLimit);
    setIsLevelComplete(false);
  }, [currentStage]);

  useEffect(() => {
    initializeLevel();
  }, [initializeLevel, currentLevel]);

  useEffect(() => {
    if (timeLeft > 0 && !isLevelComplete) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isLevelComplete) {
      showToast('Time\'s up! Try again.', 'error');
      initializeLevel();
    }
  }, [timeLeft, isLevelComplete, initializeLevel]);

  const handleMove = useCallback((newPos: Position) => {
    const gridSize = currentStage.gridSize;
    
    if (newPos.x < 0 || newPos.x >= gridSize || 
        newPos.y < 0 || newPos.y >= gridSize ||
        obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y)) {
      playSound('bump', '/sounds/bump.mp3');
      return;
    }

    setPosition(newPos);
    playSound('move', '/sounds/move.mp3');

    // Check for power-up collection
    const powerUpIndex = powerUps.findIndex(pu => pu.x === newPos.x && pu.y === newPos.y);
    if (powerUpIndex !== -1) {
      setPowerUps(pus => pus.filter((_, i) => i !== powerUpIndex));
      updateScore(50);
      playSound('powerup', '/sounds/powerup.mp3');
      showToast('+50 points!', 'success');
    }

    // Check for level completion
    if (newPos.x === target.x && newPos.y === target.y) {
      setIsLevelComplete(true);
      updateScore(100 + timeLeft);
      playSound('complete', '/sounds/complete.mp3');
      showToast('Level Complete! +' + (100 + timeLeft) + ' points!', 'success');
      setTimeout(() => {
        incrementLevel();
      }, 1500);
    }
  }, [currentStage, obstacles, powerUps, target, playSound, updateScore, incrementLevel, timeLeft]);

  const handleCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    if (isLevelComplete) return;

    if (lowerCommand.includes('up')) {
      handleMove({ ...position, y: position.y - 1 });
    } else if (lowerCommand.includes('down')) {
      handleMove({ ...position, y: position.y + 1 });
    } else if (lowerCommand.includes('left')) {
      handleMove({ ...position, x: position.x - 1 });
    } else if (lowerCommand.includes('right')) {
      handleMove({ ...position, x: position.x + 1 });
    } else if (lowerCommand.includes('restart')) {
      initializeLevel();
    }
  }, [position, handleMove, initializeLevel, isLevelComplete]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: (error) => showToast(error, 'error'),
    onStart: () => showToast('Voice control activated', 'success'),
    onStop: () => showToast('Voice control deactivated', 'success')
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title={`Voice Adventure - Level ${currentLevel}`}
        />

        <CommandList commands={COMMANDS} />

        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl">Level: {currentLevel}</div>
            <div className="text-xl">Time: {timeLeft}s</div>
          </div>

          <GameBoard 
            position={position}
            target={target}
            obstacles={obstacles}
            powerUps={powerUps}
            gridSize={currentStage.gridSize}
            isComplete={isLevelComplete}
          />
        </motion.div>

        <Instructions />
      </div>
    </div>
  );
};

export default Game;