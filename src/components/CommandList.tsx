import React from 'react';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';

interface CommandListProps {
  commands: { command: string; description: string }[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 }
};

const CommandList: React.FC<CommandListProps> = ({ commands }) => (
  <motion.div 
    variants={container}
    initial="hidden"
    animate="show"
    className="bg-black/20 backdrop-blur-md rounded-lg p-4 mb-6"
  >
    <div className="flex items-center gap-2 mb-3">
      <Command className="w-5 h-5 text-purple-400" />
      <h3 className="font-semibold text-purple-400">Voice Commands</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {commands.map(({ command, description }) => (
        <motion.div
          key={command}
          variants={item}
          className="bg-white/5 rounded-lg p-3 text-sm hover:bg-white/10 transition-colors border border-white/10"
        >
          <span className="font-mono text-purple-300">{command}</span>
          <p className="text-white/60 text-xs mt-1">{description}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default CommandList;