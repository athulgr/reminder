import React, { useState, useEffect } from 'react';

interface FocusTimerProps {
  task: { name: string; duration: number };
  onComplete: () => void;
  onAbort: (timeLeft: number) => void;
  motivationalQuote: string;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ task, onComplete, onAbort, motivationalQuote }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [isConfirmingAbort, setIsConfirmingAbort] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    if (isConfirmingAbort) {
        return; // Pause the timer
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete, isConfirmingAbort]);


  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center">
        <p className="text-lg uppercase tracking-widest text-gray-400 mb-4">
          MINING SESSION
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 px-4">
          {task.name}
        </h1>
        
        {/* Animation */}
        <div className="relative my-8 w-48 h-48 flex items-center justify-center">
          <div className="absolute text-8xl" style={{ animation: `sparkle 2s ease-in-out infinite` }}>💎</div>
          <div className="absolute text-7xl origin-bottom-right" style={{ animation: `swing 1s ease-in-out infinite` }}>⛏️</div>
        </div>

        {/* Numerical Timer */}
        <div className="text-6xl font-mono font-bold text-gray-200">
          {formatTime(timeLeft)}
        </div>

        <button 
          onClick={() => setIsConfirmingAbort(true)}
          className="w-full max-w-xs mx-auto bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-300 font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg mt-8"
        >
          STOP MINING
        </button>
      </div>
      
      {isConfirmingAbort && (
          <div className="absolute inset-0 bg-black/80 z-60 flex flex-col items-center justify-center p-4 animate-fade-in">
              <div className="text-center bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md shadow-2xl">
                <p className="text-lg text-white mb-6">
                    {motivationalQuote}
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsConfirmingAbort(false)}
                        className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300"
                    >
                        KEEP GOING
                    </button>
                    <button
                        onClick={() => onAbort(timeLeft)}
                        className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 font-bold py-3 px-8 rounded-lg transition-all duration-300"
                    >
                        I QUIT
                    </button>
                </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default FocusTimer;