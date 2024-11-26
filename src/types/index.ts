export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  position: Position;
  target: Position;
  score: number;
}

export type GameType = 'memory' | 'simon' | 'quiz' | 'adventure' | 'wordguess' | 'numberguess';

export interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SimonSequence {
  id: number;
  sequenceLength: number;
  speed: number;
  colors: number;
  difficulty: number;
}

export interface WordGuessState {
  id: number;
  word: string;
  theme: string;
  difficulty: number;
}

export interface NumberGuessState {
  id: number;
  min: number;
  max: number;
  target: number;
  difficulty: number;
}

export interface MemoryStage {
  id: number;
  gridSize: number;
  symbols: string[];
  timeLimit: number;
  difficulty: number;
}

export interface AdventureStage {
  id: number;
  gridSize: number;
  obstacles: number;
  timeLimit: number;
  powerUps: number;
  difficulty: number;
}

export interface GameProgress {
  currentLevel: number;
  highestLevel: number;
  totalScore: number;
  gameType: GameType;
}