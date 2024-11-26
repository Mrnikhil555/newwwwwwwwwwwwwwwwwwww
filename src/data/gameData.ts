// Generate 20,000 unique quiz questions
export const generateQuizQuestions = () => {
  const categories = [
    'Science', 'History', 'Geography', 'Technology', 'Arts',
    'Literature', 'Sports', 'Music', 'Movies', 'Nature'
  ];

  return Array.from({ length: 20000 }, (_, i) => {
    const category = categories[i % categories.length];
    return {
      id: i + 1,
      category,
      question: `Question ${i + 1} about ${category}`,
      options: [
        `Option A for Q${i + 1}`,
        `Option B for Q${i + 1}`,
        `Option C for Q${i + 1}`,
        `Option D for Q${i + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4)
    };
  });
};

// Generate 20,000 unique words for word guess game
export const generateWords = () => {
  const themes = [
    'Technology', 'Nature', 'Science', 'Arts', 'Sports',
    'Food', 'Travel', 'Business', 'Health', 'Education'
  ];

  return Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    word: `WORD${(i + 1).toString().padStart(5, '0')}`,
    theme: themes[i % themes.length],
    difficulty: Math.floor(i / 5000) + 1
  }));
};

// Generate 20,000 unique number guess stages
export const generateNumberStages = () => {
  return Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    min: i * 100,
    max: (i + 1) * 100,
    target: Math.floor(Math.random() * 100) + (i * 100),
    difficulty: Math.floor(i / 5000) + 1
  }));
};

// Generate 20,000 unique memory game stages
export const generateMemoryStages = () => {
  const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯', '🎸', '🎺', 
                  '🎻', '🎹', '🎼', '🎧', '🎤', '🎬', '🎨', '🎭', '🎪', '🎢'];

  return Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    gridSize: Math.min(10, Math.floor(i / 2000) + 4),
    symbols: emojis.slice(0, Math.min(Math.floor(i / 1000) + 4, emojis.length)),
    timeLimit: 30 + (Math.floor(i / 1000) * 10),
    difficulty: Math.floor(i / 5000) + 1
  }));
};

// Generate 20,000 unique Simon game stages
export const generateSimonStages = () => {
  return Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    sequenceLength: Math.min(20, Math.floor(i / 1000) + 3),
    speed: Math.max(200, 1000 - (Math.floor(i / 1000) * 50)),
    colors: Math.min(8, Math.floor(i / 2500) + 4),
    difficulty: Math.floor(i / 5000) + 1
  }));
};

// Generate 20,000 unique adventure game stages
export const generateAdventureStages = () => {
  return Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    gridSize: Math.min(20, Math.floor(i / 1000) + 8),
    obstacles: Math.min(Math.floor(i / 500) + 3, 50),
    timeLimit: 30 + (Math.floor(i / 1000) * 10),
    powerUps: Math.min(Math.floor(i / 2000) + 1, 5),
    difficulty: Math.floor(i / 5000) + 1
  }));
};