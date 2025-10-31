import React from 'react';

interface ErasureBarProps {
  percent: number;
}

const ErasureBar: React.FC<ErasureBarProps> = ({ percent }) => {
  return (
    <div className="bg-black border border-gray-800 p-4 rounded-lg">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">
        FOCUS METER
      </h2>
      <div className="w-full bg-gray-900 rounded-full h-6 relative overflow-hidden border-2 border-gray-700">
        <div
          className={`h-full rounded-full bg-white transition-all duration-500`}
          style={{ width: `${percent}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-sm text-black mix-blend-multiply">
            {percent}% FOCUSED
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">A measure of your raw commitment. Don't let it drop.</p>
    </div>
  );
};

export default ErasureBar;