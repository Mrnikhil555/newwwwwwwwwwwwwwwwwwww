import React from 'react';
import { motion } from 'framer-motion';
import { GameType } from '../types';
import { Gamepad2, Brain, Navigation, Lightbulb, Type, Hash } from 'lucide-react';
import { AdBanner } from './AdBanner';
import ContentSection from './ContentSection';

interface GameSelectorProps {
  onSelectGame: (game: GameType) => void;
}

const games = [
  {
    type: 'wordguess' as GameType,
    title: 'Word Guess',
    description: 'Challenge your vocabulary with this voice-controlled word guessing game',
    icon: Type,
    commands: ['guess [letter]', 'solve [word]', 'new game'],
    color: 'from-blue-500 to-purple-500'
  },
  {
    type: 'numberguess' as GameType,
    title: 'Number Guess',
    description: 'Find the hidden number using voice commands and strategic guessing',
    icon: Hash,
    commands: ['guess [number]', 'new game'],
    color: 'from-green-500 to-teal-500'
  },
  {
    type: 'memory' as GameType,
    title: 'Memory Match',
    description: 'Test your memory by matching pairs using voice commands',
    icon: Brain,
    commands: ['flip 1-16', 'reset'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'simon' as GameType,
    title: 'Simon Says',
    description: 'Follow the color sequence using your voice in this classic memory game',
    icon: Lightbulb,
    commands: ['red', 'blue', 'green', 'yellow'],
    color: 'from-yellow-500 to-red-500'
  },
  {
    type: 'quiz' as GameType,
    title: 'Voice Quiz',
    description: 'Test your knowledge with this voice-controlled trivia game',
    icon: Brain,
    commands: ['answer 1-4', 'next', 'previous'],
    color: 'from-indigo-500 to-blue-500'
  },
  {
    type: 'adventure' as GameType,
    title: 'Voice Adventure',
    description: 'Navigate through the grid using voice commands in this adventure game',
    icon: Gamepad2,
    commands: ['up', 'down', 'left', 'right'],
    color: 'from-red-500 to-orange-500'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const [selectedType, setSelectedType] = React.useState<GameType | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.type}
              variants={item}
              onClick={() => {
                setSelectedType(game.type);
                onSelectGame(game.type);
              }}
              className={`bg-gradient-to-br ${game.color} backdrop-blur-sm rounded-lg p-6 text-left hover:scale-105 transition-transform duration-300 shadow-xl group`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <h2 className="text-xl font-bold">{game.title}</h2>
              </div>
              <p className="text-white/90 mb-4 h-12">{game.description}</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Voice Commands:</h3>
                <div className="flex flex-wrap gap-2">
                  {game.commands.map((command) => (
                    <span
                      key={command}
                      className="text-xs bg-black/20 rounded-full px-3 py-1 backdrop-blur-sm group-hover:bg-black/30 transition-colors"
                    >
                      {command}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {selectedType && <ContentSection gameType={selectedType} />}
      
      <AdBanner 
        className="mt-8" 
        slot="game-selector-ad"
        format="horizontal"
      />
    </div>
  );
};

export default GameSelector;