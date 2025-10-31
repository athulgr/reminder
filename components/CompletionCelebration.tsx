import React from 'react';

interface CompletionCelebrationProps {
  diamondCount: number;
  onClose: () => void;
}

const DiamondRain: React.FC = () => {
  const diamonds = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {diamonds.map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${2 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          💎
        </div>
      ))}
    </div>
  );
};


const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({ diamondCount, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center text-center p-4">
      <DiamondRain />
      <div className="relative z-10 animate-fade-in" style={{ animation: `fade-out-up 4s ease-in-out forwards` }} onAnimationEnd={onClose}>
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-wider text-white" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
          DIAMOND MINED!
        </h1>
        <div className="mt-8 bg-black/50 border border-gray-700 rounded-lg p-4 inline-block">
            <p className="text-sm uppercase tracking-widest text-gray-400">
                DIAMOND TROVE
            </p>
            <p className="text-4xl font-bold text-white mt-1">
                {diamondCount} 💎
            </p>
        </div>
      </div>
       <button 
          onClick={onClose}
          className="absolute bottom-10 z-10 bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 animate-fade-in"
        >
          CLAIM REWARD & CONTINUE
        </button>
    </div>
  );
};

export default CompletionCelebration;