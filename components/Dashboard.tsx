import React from 'react';
import ErasureBar from './ErasureBar';
import UnfinishedSessions from './UnfinishedSessions';
import DiamondTrove from './DiamondTrove';
import type { UnfinishedTask } from '../types';

interface DashboardProps {
  erasurePercent: number;
  unfinishedSessions: UnfinishedTask[];
  onResumeTask: (taskId: number) => void;
  diamondCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ erasurePercent, unfinishedSessions, onResumeTask, diamondCount }) => {
  return (
    <div className="p-4 md:p-6 space-y-6 flex flex-col">
      <div className="text-center py-4">
        <h1 className="text-xl font-bold tracking-wider uppercase">ALTER EGO</h1>
        <p className="text-xs text-gray-500">Forge your future.</p>
      </div>
      <ErasureBar percent={erasurePercent} />
      <DiamondTrove count={diamondCount} />
      <UnfinishedSessions sessions={unfinishedSessions} onResume={onResumeTask} />
    </div>
  );
};

export default Dashboard;