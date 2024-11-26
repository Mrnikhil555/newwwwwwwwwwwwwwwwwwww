import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import CommandList from '../CommandList';
import LevelProgress from '../LevelProgress';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useGameProgress } from '../../hooks/useGameProgress';
import { useSound } from '../../hooks/useSound';
import { showToast } from '../Toast';
import { useGameStore } from '../../store/gameStore';

interface WordGuessGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface WordGameState {
  word: string;
  guessedLetters: string[];
  remainingAttempts: number;
  timeLeft: number;
}

const COMMANDS = [
  { command: "guess [letter]", description: "Guess a letter" },
  { command: "solve [word]", description: "Try to solve the word" },
  { command: "new game", description: "Start a new game" }
];

const WordGuessGame: React.FC<WordGuessGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const { playSound } = useSound(isMuted);
  const { currentLevel, highestLevel, totalScore, updateScore, incrementLevel } = useGameProgress('wordguess');
  const words = useGameStore(state => state.words);
  const [gameState, setGameState] = useState<WordGameState>({
    word: '',
    guessedLetters: [],
    remainingAttempts: 6,
    timeLeft: 3
  });

  const initGame = useCallback(() => {
    const currentWord = words[currentLevel - 1];
    setGameState({
      word: currentWord.word,
      guessedLetters: [],
      remainingAttempts: 6,
      timeLeft: 3
    });
  }, [currentLevel, words]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.timeLeft]);

  const handleGuess = useCallback((letter: string) => {
    if (gameState.guessedLetters.includes(letter)) {
      showToast('Letter already guessed!', 'error');
      return;
    }

    setGameState(prev => {
      const newGuessedLetters = [...prev.guessedLetters, letter];
      const isCorrect = prev.word.includes(letter);
      const newRemainingAttempts = isCorrect ? prev.remainingAttempts : prev.remainingAttempts - 1;

      if (isCorrect) {
        const occurrences = prev.word.split('').filter(l => l === letter).length;
        updateScore(10 * occurrences * currentLevel);
        playSound('correct', '/sounds/correct.mp3');
        showToast(`+${10 * occurrences * currentLevel} points!`, 'success');
      } else {
        playSound('wrong', '/sounds/wrong.mp3');
        showToast('Incorrect guess!', 'error');
      }

      return {
        ...prev,
        guessedLetters: newGuessedLetters,
        remainingAttempts: newRemainingAttempts
      };
    });
  }, [gameState.guessedLetters, playSound, currentLevel, updateScore]);

  const handleSolve = useCallback((attempt: string) => {
    if (attempt.toUpperCase() === gameState.word) {
      setGameState(prev => ({
        ...prev,
        guessedLetters: [...new Set(prev.word.split(''))]
      }));
      updateScore(100 * currentLevel);
      incrementLevel();
      playSound('win', '/sounds/win.mp3');
      showToast(`Word solved! +${100 * currentLevel} points!`, 'success');
      setTimeout(initGame, 1500);
    } else {
      setGameState(prev => ({
        ...prev,
        remainingAttempts: prev.remainingAttempts - 1
      }));
      playSound('wrong', '/sounds/wrong.mp3');
      showToast('Incorrect solution!', 'error');
    }
  }, [gameState.word, playSound, currentLevel, updateScore, incrementLevel, initGame]);

  const handleCommand = useCallback((command: string) => {
    const guessMatch = command.match(/guess (\w)/i);
    const solveMatch = command.match(/solve (\w+)/i);
    
    if (guessMatch) {
      handleGuess(guessMatch[1].toUpperCase());
    } else if (solveMatch) {
      handleSolve(solveMatch[1].toUpperCase());
    } else if (command.toLowerCase().includes('new game')) {
      initGame();
    }
  }, [handleGuess, handleSolve, initGame]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: (error) => showToast(error, 'error'),
    onStart: () => showToast('Voice recognition started', 'success'),
    onStop: () => showToast('Voice recognition stopped', 'success')
  });

  const maskedWord = gameState.word
    .split('')
    .map(letter => gameState.guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  const isGameOver = gameState.remainingAttempts === 0;
  const isWon = gameState.word.split('').every(letter => gameState.guessedLetters.includes(letter));

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Word Guess"
        />

        <LevelProgress
          gameType="wordguess"
          currentLevel={currentLevel}
          highestLevel={highestLevel}
          totalScore={totalScore}
        />

        <CommandList commands={COMMANDS} />

        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {gameState.timeLeft > 0 ? (
            <motion.div 
              className="text-center text-4xl font-bold"
              initial={{ scale: 2 }}
              animate={{ scale: 1 }}
              key={gameState.timeLeft}
            >
              {gameState.word}
              <div className="text-2xl mt-4">Memorize the word!</div>
              <div className="text-xl mt-2">Time: {gameState.timeLeft}s</div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="text-4xl font-mono mb-4">{maskedWord}</div>
                <div className="text-xl">Attempts remaining: {gameState.remainingAttempts}</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
                  <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={gameState.guessedLetters.includes(letter) || isGameOver || isWon}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      gameState.guessedLetters.includes(letter)
                        ? gameState.word.includes(letter)
                          ? 'bg-green-500'
                          : 'bg-red-500/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {(isGameOver || isWon) && (
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-2xl mb-4">
                    {isWon ? 'Congratulations!' : 'Game Over!'}
                  </div>
                  <div className="mb-4">The word was: {gameState.word}</div>
                  <button
                    onClick={initGame}
                    className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    New Game
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WordGuessGame;