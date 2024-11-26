import React from 'react';
import { motion } from 'framer-motion';
import { Position } from '../types';
import { Trophy, Star, X } from 'lucide-react';

interface GameBoardProps {
  position: Position;
  target: Position;
  obstacles: Position[];
  powerUps: Position[];
  gridSize: number;
  isComplete: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  position, 
  target, 
  obstacles,
  powerUps,
  gridSize,
  isComplete
}) => (
  <motion.div 
    className={`grid gap-1 mb-6`}
    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
  >
    {Array.from({ length: gridSize * gridSize }).map((_, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      const isPlayer = x === position.x && y === position.y;
      const isTarget = x === target.x && y === target.y;
      const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
      const isPowerUp = powerUps.some(pu => pu.x === x && pu.y === y);

      return (
        <motion.div
          key={index}
          className={`aspect-square rounded-lg flex items-center justify-center ${
            isPlayer
              ? 'bg-blue-500 shadow-lg'
              : isTarget
              ? 'bg-green-500'
              : isObstacle
              ? 'bg-red-500'
              : isPowerUp
              ? 'bg-yellow-500'
              : 'bg-white/5'
          }`}
          whileHover={{ scale: 1.05 }}
          animate={isComplete ? { scale: [1, 1.1, 1], rotate: [0, 360, 0] } : {}}
        >
          {isPlayer && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>⭐</motion.div>}
          {isTarget && <Trophy className="w-6 h-6" />}
          {isObstacle && <X className="w-6 h-6" />}
          {isPowerUp && <Star className="w-6 h-6 animate-pulse" />}
        </motion.div>
      );
    })}
  </motion.div>
);

export default GameBoard;