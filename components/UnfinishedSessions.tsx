import React from 'react';
import type { UnfinishedTask } from '../types';

interface UnfinishedSessionsProps {
  sessions: UnfinishedTask[];
  onResume: (taskId: number) => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const renderLives = (lives: number) => {
  return (
    <div className="flex space-x-0.5 text-red-500">
      {'❤️'.repeat(lives)}
    </div>
  );
};


const UnfinishedSessions: React.FC<UnfinishedSessionsProps> = ({ sessions, onResume }) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-black border border-gray-800 p-4 rounded-lg">
      <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-500 mb-4">
        Abandoned Claims
      </h2>
      <ul className="space-y-3">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-center justify-between p-3 rounded-md bg-gray-900 border border-gray-700"
          >
            <div className="flex-grow pr-2">
              <p className="font-semibold text-white truncate">{session.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400 font-mono">
                  {formatTime(session.timeLeft)}
                </p>
                {renderLives(session.lives)}
              </div>
            </div>
            <button
              onClick={() => onResume(session.id)}
              className="flex-shrink-0 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-400 font-bold py-2 px-3 rounded-md transition-all text-xs"
            >
              Resume
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnfinishedSessions;