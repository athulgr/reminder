import React from 'react';

interface DiamondTroveProps {
  count: number;
}

const DiamondTrove: React.FC<DiamondTroveProps> = ({ count }) => {
  return (
    <div className="bg-black border border-gray-800 p-4 rounded-lg flex items-center space-x-4">
        <div className="text-4xl">💎</div>
        <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                DIAMOND TROVE
            </h2>
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-xs text-gray-600">Successfully mined sessions.</p>
        </div>
    </div>
  );
};

export default DiamondTrove;
