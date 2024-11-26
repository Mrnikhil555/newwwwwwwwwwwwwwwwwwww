import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameType } from './types';
import Game from './components/Game';
import GameSelector from './components/GameSelector';
import MemoryGame from './components/games/MemoryGame';
import SimonGame from './components/games/SimonGame';
import QuizGame from './components/games/QuizGame';
import WordGuessGame from './components/games/WordGuessGame';
import NumberGuessGame from './components/games/NumberGuessGame';
import { Toast } from './components/Toast';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

function App() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleBack = () => setSelectedGame(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'adventure':
        return (
          <motion.div key="adventure" {...pageVariants}>
            <Game onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      case 'memory':
        return (
          <motion.div key="memory" {...pageVariants}>
            <MemoryGame onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      case 'simon':
        return (
          <motion.div key="simon" {...pageVariants}>
            <SimonGame onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      case 'quiz':
        return (
          <motion.div key="quiz" {...pageVariants}>
            <QuizGame onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      case 'wordguess':
        return (
          <motion.div key="wordguess" {...pageVariants}>
            <WordGuessGame onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      case 'numberguess':
        return (
          <motion.div key="numberguess" {...pageVariants}>
            <NumberGuessGame onBack={handleBack} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
          </motion.div>
        );
      default:
        return (
          <motion.div 
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto p-8"
          >
            <motion.h1 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Voice-Controlled Games
            </motion.h1>
            <GameSelector onSelectGame={setSelectedGame} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <AnimatePresence mode="wait">
        {renderGame()}
      </AnimatePresence>
      <Toast />
    </div>
  );
}

export default App;