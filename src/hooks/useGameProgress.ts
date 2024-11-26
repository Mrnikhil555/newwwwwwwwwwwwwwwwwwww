import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameType } from '../types';
import { showToast } from '../components/Toast';

export const useGameProgress = (gameType: GameType) => {
  const {
    progress,
    updateProgress,
    quizQuestions,
    words,
    numberStages,
    memoryStages,
    simonStages,
    adventureStages
  } = useGameStore();

  const currentProgress = progress[gameType];

  const getCurrentStage = useCallback(() => {
    const level = currentProgress.currentLevel;
    switch (gameType) {
      case 'quiz':
        return quizQuestions[level - 1];
      case 'wordguess':
        return words[level - 1];
      case 'numberguess':
        return numberStages[level - 1];
      case 'memory':
        return memoryStages[level - 1];
      case 'simon':
        return simonStages[level - 1];
      case 'adventure':
        return adventureStages[level - 1];
      default:
        return null;
    }
  }, [gameType, currentProgress.currentLevel]);

  const incrementLevel = useCallback(() => {
    updateProgress(gameType, {
      currentLevel: currentProgress.currentLevel + 1,
      highestLevel: Math.max(currentProgress.highestLevel, currentProgress.currentLevel + 1),
      totalScore: currentProgress.totalScore
    });
    showToast(`Level ${currentProgress.currentLevel + 1} Unlocked!`, 'success');
  }, [gameType, currentProgress]);

  const updateScore = useCallback((points: number) => {
    updateProgress(gameType, {
      ...currentProgress,
      totalScore: currentProgress.totalScore + points
    });
  }, [gameType, currentProgress]);

  const resetProgress = useCallback(() => {
    updateProgress(gameType, {
      currentLevel: 1,
      highestLevel: 1,
      totalScore: 0
    });
    showToast('Progress Reset', 'success');
  }, [gameType]);

  return {
    currentLevel: currentProgress.currentLevel,
    highestLevel: currentProgress.highestLevel,
    totalScore: currentProgress.totalScore,
    currentStage: getCurrentStage(),
    incrementLevel,
    updateScore,
    resetProgress
  };
};