import React from 'react';

const Instructions: React.FC = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">How to Play</h2>
    <ul className="list-disc list-inside space-y-2 opacity-90">
      <li>Click "Start Voice Control" to begin</li>
      <li>Say "up", "down", "left", or "right" to move</li>
      <li>Reach the green target to score points</li>
      <li>You can also use arrow keys to move</li>
    </ul>
  </div>
);

export default Instructions;