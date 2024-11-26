import React, { useState, useCallback, useEffect } from 'react';
import Header from '../Header';
import CommandList from '../CommandList';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { QuizQuestion } from '../../types';

interface QuizGameProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const COMMANDS = [
  { command: "answer 1-4", description: "Select answer by number" },
  { command: "next", description: "Go to next question" },
  { command: "previous", description: "Go to previous question" }
];

const QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1
  }
];

const QuizGame: React.FC<QuizGameProps> = ({ isMuted, onToggleMute, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (answered.includes(currentQuestion)) return;

    if (answerIndex === QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 100);
    }
    setAnswered(prev => [...prev, currentQuestion]);
  }, [currentQuestion, answered]);

  const handleCommand = useCallback((command: string) => {
    const answerMatch = command.match(/answer (\d+)/i);
    if (answerMatch) {
      const answer = parseInt(answerMatch[1], 10) - 1;
      if (answer >= 0 && answer < 4) {
        handleAnswer(answer);
      }
    } else if (command.includes('next')) {
      setCurrentQuestion(prev => Math.min(prev + 1, QUESTIONS.length - 1));
    } else if (command.includes('previous')) {
      setCurrentQuestion(prev => Math.max(prev - 1, 0));
    }
  }, [handleAnswer]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onCommand: handleCommand,
    onError: console.error,
    onStart: () => {},
    onStop: () => {}
  });

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onToggleListening={isListening ? stopListening : startListening}
          onBack={onBack}
          title="Voice Quiz"
        />

        <CommandList commands={COMMANDS} />

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-2xl mb-4">Score: {score}</div>
          <div className="mb-8">
            <h2 className="text-xl mb-4">{QUESTIONS[currentQuestion].question}</h2>
            <div className="space-y-4">
              {QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered.includes(currentQuestion)}
                  className={`w-full p-4 rounded-lg transition-colors ${
                    answered.includes(currentQuestion)
                      ? index === QUESTIONS[currentQuestion].correctAnswer
                        ? 'bg-green-500'
                        : 'bg-red-500/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {index + 1}. {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, QUESTIONS.length - 1))}
              disabled={currentQuestion === QUESTIONS.length - 1}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;