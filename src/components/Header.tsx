import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Mic, MicOff, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  isListening: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleListening: () => void;
  onBack: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  isListening,
  isMuted,
  onToggleMute,
  onToggleListening,
  onBack,
  title,
}) => (
  <motion.div 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex justify-between items-center mb-8 bg-black/20 backdrop-blur-md rounded-lg p-4"
  >
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Back to game selection"
      >
        <ArrowLeft className="w-6 h-6" />
      </motion.button>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Gamepad2 className="w-8 h-8" />
      </motion.div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        {title}
      </h1>
    </div>
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleMute}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleListening}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" /> Stop
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" /> Start Voice Control
          </>
        )}
      </motion.button>
    </div>
  </motion.div>
);

export default Header;