
import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';

interface TaskQueueProps {
  tasks: Task[];
}

const statusStyles: Record<TaskStatus, { icon: string; classes: string }> = {
  [TaskStatus.Pending]: { icon: '⏳', classes: 'text-gray-300' },
  [TaskStatus.Completed]: { icon: '✅', classes: 'text-green-500 line-through' },
  [TaskStatus.Overdue]: { icon: '🔥', classes: 'text-red-500 animate-pulse font-bold' },
};

const TaskQueue: React.FC<TaskQueueProps> = ({ tasks }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-md h-full">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
        DAILY MANDATE
      </h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No mandate set. Are you wasting the day?</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-md bg-gray-800/50 ${statusStyles[task.status].classes}`}
            >
              <span className="flex items-center">
                <span className="mr-3 text-lg">{statusStyles[task.status].icon}</span>
                <span>{task.name}</span>
              </span>
              <span className="font-mono text-xs">{task.dueTime}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskQueue;
