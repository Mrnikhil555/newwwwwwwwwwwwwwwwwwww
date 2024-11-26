import React from 'react';
import { motion } from 'framer-motion';
import { GameType } from '../types';
import { Brain, Gamepad2, Hash, Type } from 'lucide-react';

interface ContentSectionProps {
  gameType: GameType;
}

const ContentSection: React.FC<ContentSectionProps> = ({ gameType }) => {
  const getGameContent = () => {
    switch (gameType) {
      case 'wordguess':
        return {
          icon: Type,
          title: 'Word Guessing Game',
          description: 'Challenge your vocabulary and deduction skills with our voice-controlled word guessing game. Perfect for language enthusiasts and puzzle lovers.',
          features: [
            'Over 20,000 unique words across different categories',
            'Progressive difficulty levels',
            'Voice command support for hands-free gaming',
            'Real-time feedback and scoring system',
            'Educational value in vocabulary building'
          ]
        };
      case 'numberguess':
        return {
          icon: Hash,
          title: 'Number Guessing Challenge',
          description: 'Test your numerical intuition with our voice-activated number guessing game. Perfect for developing mathematical thinking and strategy.',
          features: [
            'Adaptive difficulty based on performance',
            'Voice-controlled gameplay',
            'Statistical feedback on guessing patterns',
            'Multiple difficulty modes',
            'Progressive scoring system'
          ]
        };
      case 'memory':
        return {
          icon: Brain,
          title: 'Memory Match Challenge',
          description: 'Exercise your memory with our innovative voice-controlled matching game. Perfect for cognitive training and entertainment.',
          features: [
            'Dynamic card patterns',
            'Progressive difficulty levels',
            'Voice command support',
            'Performance tracking',
            'Memory-enhancing gameplay'
          ]
        };
      default:
        return {
          icon: Gamepad2,
          title: 'Voice-Controlled Gaming',
          description: 'Experience the future of gaming with our voice-controlled platform. Perfect for accessible and hands-free entertainment.',
          features: [
            'Multiple game modes',
            'Voice command support',
            'Progressive difficulty',
            'Performance tracking',
            'Engaging gameplay mechanics'
          ]
        };
    }
  };

  const content = getGameContent();
  const Icon = content.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-8 my-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <Icon className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-purple-400">{content.title}</h2>
      </div>
      
      <p className="text-lg mb-6 text-white/90">{content.description}</p>
      
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold text-white/80">Key Features:</h3>
        <ul className="grid gap-3">
          {content.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-white/10 p-4 rounded-lg"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default ContentSection;