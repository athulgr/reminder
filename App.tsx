import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ChatArena from './components/ChatArena';
import FocusTimer from './components/FocusTimer';
import CompletionCelebration from './components/CompletionCelebration';
import type { ChatMessage, Persona, UnfinishedTask } from './types';
import { MessageSender } from './types';
import { getAiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [focusMeterPercent, setFocusMeterPercent] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'awaiting_task' | 'task_active'>('awaiting_task');
  const [activeTask, setActiveTask] = useState<{ name: string; duration: number; id?: number } | null>(null);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [persona, setPersona] = useState<Persona>('friendly');
  const [unfinishedSessions, setUnfinishedSessions] = useState<UnfinishedTask[]>([]);
  const [isFailureFlashActive, setIsFailureFlashActive] = useState(false);
  const [diamondCount, setDiamondCount] = useState<number>(0);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);

  const addMessage = useCallback((sender: MessageSender, text: string) => {
    setChatHistory(prev => [
      ...prev,
      { sender, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, []);

  useEffect(() => {
    const welcomeMessageShown = localStorage.getItem('welcomeMessageShown');
    if (!welcomeMessageShown) {
      addMessage(MessageSender.AI, "Hello! I'm your Performance Coach 💪. I'm here to help you achieve your goals. What's your main objective right now, and how many minutes do you want to dedicate to it?\n\n**Format:** `[Your Task], [Time in minutes]`");
      localStorage.setItem('welcomeMessageShown', 'true');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (failureCount === 0) {
        setPersona('friendly');
    } else if (failureCount === 1) {
        setPersona('concerned');
    } else {
        setPersona('tough_love');
    }
  }, [failureCount]);

  const handleSendMessage = async (message: string) => {
    addMessage(MessageSender.User, message);
    setIsLoading(true);

    // Heuristic to check if the user is trying to set a task
    const isSettingTask = message.includes(',') && /\d/.test(message);

    if (gameState === 'awaiting_task' && isSettingTask) {
      const parts = message.split(',');
      if (parts.length < 2) {
        addMessage(MessageSender.AI, "Oops! Please include both task and time. **Format:** `[Task], [Time]` 👍");
        setIsLoading(false);
        return;
      }

      const taskName = parts[0].trim();
      const timePart = parts.slice(1).join(',').trim();
      const timeMatch = timePart.match(/(\d+)/);

      if (!timeMatch) {
         addMessage(MessageSender.AI, "I need a number for the time. Ex: `My task, 25 minutes`.");
         setIsLoading(false);
         return;
      }

      const durationInMinutes = parseInt(timeMatch[1], 10);

      if (durationInMinutes < 20) {
        const aiPrompt = `The user tried to set a timer for ${durationInMinutes} minutes, which is less than the 20-minute minimum. Your mode is 'concerned'. Firmly tell them that deep focus requires at least 20 minutes and that they need to set a proper goal.`;
        const aiResponse = await getAiResponse(chatHistory, aiPrompt);
        addMessage(MessageSender.AI, aiResponse);
        setIsLoading(false);
        return;
      }

      const durationInSeconds = durationInMinutes * 60;
      
      const newTask = { name: taskName, duration: durationInSeconds, id: Date.now() };
      setActiveTask(newTask);
      setGameState('task_active');

      const aiPrompt = `The user wants to focus on: **"${taskName}"** for ${durationInMinutes} minutes. Give them a concise motivational message to start the session. Your current mode is '${persona}'.`;
      const aiResponse = await getAiResponse(chatHistory, aiPrompt);
      addMessage(MessageSender.AI, aiResponse);
      
    } else {
        // Treat as a conversational message
        const aiPrompt = `The user said: "${message}". Respond conversationally and concisely as the Performance Coach. Your current mode is '${persona}'. If they are asking for what to do, guide them to set a task.`;
        const aiResponse = await getAiResponse(chatHistory, aiPrompt);
        addMessage(MessageSender.AI, aiResponse);
    }

    setIsLoading(false);
  };
  
  const handleTaskComplete = useCallback(() => {
    if (!activeTask) return;
    setFailureCount(0); // Reset failure count on success
    
    // If the completed task was a resumed one, remove it from unfinished
    if (activeTask.id) {
        setUnfinishedSessions(prev => prev.filter(s => s.id !== activeTask.id));
    }
    
    setDiamondCount(prev => prev + 1);
    setFocusMeterPercent(p => Math.min(100, p + 10));
    setActiveTask(null);
    setGameState('awaiting_task');
    setIsCelebrating(true); // Trigger celebration
  }, [activeTask]);

  const handleCloseCelebration = useCallback(async () => {
    setIsCelebrating(false);
    setIsLoading(true);
    const lastCompletedTaskName = chatHistory.find(msg => msg.sender === MessageSender.User)?.text.split(',')[0] || "the last task";

    addMessage(MessageSender.System, `Focus session complete! Diamond earned.`);
    const aiPrompt = `The user successfully completed their focus session for: **"${lastCompletedTaskName}"**. Briefly praise them for earning a diamond and ask what's next. Your mode is 'friendly'.`;
    const aiResponse = await getAiResponse(chatHistory, aiPrompt);
    addMessage(MessageSender.AI, aiResponse);
    setIsLoading(false);
  }, [addMessage, chatHistory]);

  const handleAbortTask = useCallback(async (timeLeft: number) => {
      if (!activeTask) return;
      setIsLoading(true);

      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);
      const taskName = activeTask.name;

      const existingTaskIndex = unfinishedSessions.findIndex(t => t.id === activeTask.id);
      let aiPrompt: string;

      if (existingTaskIndex > -1) {
          // This was a resumed task that was aborted again.
          const updatedSessions = [...unfinishedSessions];
          const taskToUpdate = { ...updatedSessions[existingTaskIndex] };
          
          taskToUpdate.lives -= 1;
          taskToUpdate.timeLeft = timeLeft;

          if (taskToUpdate.lives > 0) {
              // Lost a life, but not game over yet.
              updatedSessions[existingTaskIndex] = taskToUpdate;
              setUnfinishedSessions(updatedSessions);
              addMessage(MessageSender.System, `Session for "${taskName}" aborted again. One chance lost.`);
              aiPrompt = `Your mode is 'tough_love'. The user failed **"${taskName}"** again, losing a chance. They have ${taskToUpdate.lives} left. Be extremely firm. Tell them this path leads to a permanently abandoned claim.`;
          } else {
              // All lives lost. Permanent failure.
              setUnfinishedSessions(prev => prev.filter(t => t.id !== activeTask.id));
              setFocusMeterPercent(p => Math.max(0, p - 30)); // Heaviest penalty
              addMessage(MessageSender.System, `All chances for "${taskName}" have been lost. Task failed permanently.`);
              
              setIsFailureFlashActive(true);
              setTimeout(() => setIsFailureFlashActive(false), 1000);

              aiPrompt = `Your mode is 'tough_love'. The user has exhausted all chances for **"${taskName}"**. It is now an abandoned claim. State this fact directly. The goal is gone. Tell them the only option is to start a new, different goal and not repeat this failure.`;
          }
      } else {
          // This is a new task being aborted for the first time.
          const newUnfinishedTask: UnfinishedTask = {
              id: activeTask.id || Date.now(),
              name: taskName,
              timeLeft: timeLeft,
              lives: 3,
          };
          setUnfinishedSessions(prev => [...prev, newUnfinishedTask]);
          const nextPersona: Persona = newFailureCount >= 1 ? 'concerned' : 'friendly';
          addMessage(MessageSender.System, `Session for "${taskName}" ended early. You have 3 chances to complete it.`);
          aiPrompt = `Your mode is '${nextPersona}'. The user aborted their session: **"${taskName}"**. Inform them it has been saved as an "Abandoned Claim" with 3 chances to complete it. Encourage them to recommit soon.`;
      }
      
      setActiveTask(null);
      setGameState('awaiting_task');
      
      const aiResponse = await getAiResponse(chatHistory, aiPrompt);
      addMessage(MessageSender.AI, aiResponse);
      setIsLoading(false);
  }, [activeTask, addMessage, chatHistory, failureCount, unfinishedSessions]);
  
  const handleResumeTask = (taskId: number) => {
      const taskToResume = unfinishedSessions.find(s => s.id === taskId);
      if (taskToResume) {
          setActiveTask({
              name: taskToResume.name,
              duration: taskToResume.timeLeft,
              id: taskToResume.id,
          });
          setGameState('task_active');
          addMessage(MessageSender.System, `Resuming session: "${taskToResume.name}"`);
      }
  };


  let motivationalQuote: string;
  if (persona === 'friendly') {
    motivationalQuote = "You've struck a good vein, but there's more diamond to be found. Keep up the great work! 💪";
  } else if (persona === 'concerned') {
    motivationalQuote = "The mine could collapse if you stop now. Are you sure you want to quit? This goal is still within reach.";
  } else { // tough_love
    motivationalQuote = "Quitting now is for amateurs. The real diamonds are found under pressure. Get back to work.";
  }


  return (
    <main className="h-screen w-screen bg-black flex flex-col md:flex-row overflow-hidden">
       {isFailureFlashActive && (
          <div className="fixed inset-0 bg-red-500/50 z-[100] animate-pulse-fast pointer-events-none"></div>
       )}
       {isCelebrating && (
          <CompletionCelebration 
            diamondCount={diamondCount}
            onClose={handleCloseCelebration}
          />
       )}
       {gameState === 'task_active' && activeTask && (
        <FocusTimer 
          task={activeTask}
          onComplete={handleTaskComplete}
          onAbort={handleAbortTask}
          motivationalQuote={motivationalQuote}
        />
      )}
      
      {/* Left Panel */}
      <div className="flex-shrink-0 md:w-1/3 xl:w-1/4 md:border-r border-gray-800 overflow-y-auto">
        <Dashboard 
          erasurePercent={focusMeterPercent}
          unfinishedSessions={unfinishedSessions}
          onResumeTask={handleResumeTask}
          diamondCount={diamondCount}
        />
      </div>

      {/* Right Panel (Chat) */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatArena 
          messages={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isTaskActive={gameState === 'task_active'}
          persona={persona}
        />
      </div>
    </main>
  );
};

export default App;