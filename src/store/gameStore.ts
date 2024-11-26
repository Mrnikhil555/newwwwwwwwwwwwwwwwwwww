import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { GameProgress, GameType } from '../types';
import {
  generateQuizQuestions,
  generateWords,
  generateNumberStages,
  generateMemoryStages,
  generateSimonStages,
  generateAdventureStages
} from '../data/gameData';

interface GameStore {
  progress: Record<GameType, GameProgress>;
  quizQuestions: ReturnType<typeof generateQuizQuestions>;
  words: ReturnType<typeof generateWords>;
  numberStages: ReturnType<typeof generateNumberStages>;
  memoryStages: ReturnType<typeof generateMemoryStages>;
  simonStages: ReturnType<typeof generateSimonStages>;
  adventureStages: ReturnType<typeof generateAdventureStages>;
  updateProgress: (gameType: GameType, progress: GameProgress) => void;
  resetProgress: (gameType: GameType) => void;
}

const initialProgress: GameProgress = {
  currentLevel: 1,
  highestLevel: 1,
  totalScore: 0
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      progress: {
        quiz: { ...initialProgress },
        wordguess: { ...initialProgress },
        numberguess: { ...initialProgress },
        memory: { ...initialProgress },
        simon: { ...initialProgress },
        adventure: { ...initialProgress }
      },
      quizQuestions: generateQuizQuestions(),
      words: generateWords(),
      numberStages: generateNumberStages(),
      memoryStages: generateMemoryStages(),
      simonStages: generateSimonStages(),
      adventureStages: generateAdventureStages(),
      updateProgress: (gameType, progress) => set(
        produce((state) => {
          state.progress[gameType] = progress;
        })
      ),
      resetProgress: (gameType) => set(
        produce((state) => {
          state.progress[gameType] = { ...initialProgress };
        })
      )
    }),
    {
      name: 'game-storage',
      version: 1
    }
  )
);

export const getDifficultyLabel = (level: number): string => {
  if (level <= 5000) return 'Easy';
  if (level <= 10000) return 'Medium';
  if (level <= 15000) return 'Hard';
  return 'Extreme';
};

export const getDifficultyColor = (level: number): string => {
  if (level <= 5000) return 'text-green-400';
  if (level <= 10000) return 'text-yellow-400';
  if (level <= 15000) return 'text-orange-400';
  return 'text-red-400';
};