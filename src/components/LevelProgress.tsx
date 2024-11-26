import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Crown } from 'lucide-react';
import { GameType } from '../types';
import { getDifficultyLabel, getDifficultyColor } from '../store/gameStore';

interface LevelProgressProps {
  gameType: GameType;
  currentLevel: number;
  highestLevel: number;
  totalScore: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  gameType,
  currentLevel,
  highestLevel,
  totalScore
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="flex items-center gap-4 bg-white/10 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Trophy className="w-6 h-6 text-yellow-400" />
          <div>
            <div className="text-sm opacity-75">Current Level</div>
            <div className="text-xl font-bold">{currentLevel}</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-4 bg-white/10 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Star className="w-6 h-6 text-purple-400" />
          <div>
            <div className="text-sm opacity-75">Highest Level</div>
            <div className="text-xl font-bold">{highestLevel}</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-4 bg-white/10 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Award className="w-6 h-6 text-blue-400" />
          <div>
            <div className="text-sm opacity-75">Total Score</div>
            <div className="text-xl font-bold">{totalScore.toLocaleString()}</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-4 bg-white/10 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Crown className="w-6 h-6 text-pink-400" />
          <div>
            <div className="text-sm opacity-75">Difficulty</div>
            <div className={`text-xl font-bold ${getDifficultyColor(currentLevel)}`}>
              {getDifficultyLabel(currentLevel)}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-4 bg-white/10 p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel % 100) / 100 * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="mt-2 text-sm text-white/60 text-center">
          Progress to next level: {currentLevel % 100}/100
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LevelProgress;