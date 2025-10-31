export enum MessageSender {
  User = 'user',
  AI = 'ai',
  System = 'system',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export type Persona = 'friendly' | 'concerned' | 'tough_love';

export interface UnfinishedTask {
  id: number;
  name: string;
  timeLeft: number;
  lives: number;
}

export enum TaskStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Overdue = 'Overdue',
}

export interface Task {
  id: string | number;
  name: string;
  dueTime: string;
  status: TaskStatus;
}