
import React from 'react';

interface FutureSelfCountdownProps {
  days: number;
}

const FutureSelfCountdown: React.FC<FutureSelfCountdownProps> = ({ days }) => {
  return (
    <div className="bg-gray-900 border border-red-500/50 p-4 rounded-lg text-center shadow-lg shadow-red-500/10">
      <h2 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-2">
        FUTURE SELF COUNTDOWN
      </h2>
      <div className="text-6xl font-mono font-bold text-red-500">
        {days}
      </div>
      <p className="text-xs text-gray-400 mt-2">Days Until You Preserve Me... Or Erase Me.</p>
    </div>
  );
};

export default FutureSelfCountdown;
