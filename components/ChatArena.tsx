import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Persona } from '../types';
import { MessageSender } from '../types';

interface ChatArenaProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isTaskActive: boolean;
  persona: Persona;
}

const ChatArena: React.FC<ChatArenaProps> = ({ 
    messages, 
    onSendMessage, 
    isLoading, 
    isTaskActive,
    persona
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isTaskActive) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const getMessageStyle = (sender: MessageSender) => {
    switch (sender) {
      case MessageSender.AI:
        if (persona === 'tough_love') {
          return 'bg-black self-start border-2 border-red-500/50 shadow-lg shadow-red-500/10';
        }
        if (persona === 'concerned') {
          return 'bg-black self-start border-2 border-orange-500/50 shadow-lg shadow-orange-500/10';
        }
        return 'bg-black self-start border-2 border-blue-500/50 shadow-lg shadow-blue-500/10';
      case MessageSender.User:
        return 'bg-gray-800 self-end text-gray-200';
      case MessageSender.System:
        return 'bg-gray-900/80 self-center text-gray-400 text-xs italic text-center';
      default:
        return 'bg-gray-800 self-start';
    }
  };
  
  const getTextStyle = (sender: MessageSender) => {
      if (sender === MessageSender.AI) {
        if (persona === 'tough_love') {
          return 'font-semibold text-red-400';
        }
        if (persona === 'concerned') {
            return 'font-semibold text-orange-400';
        }
        return 'font-semibold text-blue-400';
      }
      return 'text-white';
  }

  const getLoadingDotStyle = () => {
      if (persona === 'tough_love') return 'bg-red-500';
      if (persona === 'concerned') return 'bg-orange-500';
      return 'bg-blue-500';
  }

  return (
    <div className={`flex flex-col h-full bg-black/80 border-l border-gray-800`}>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-lg ${getMessageStyle(msg.sender)}`}>
              <p className={`whitespace-pre-wrap ${getTextStyle(msg.sender)}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className={`p-3 rounded-lg max-w-lg self-start ${getMessageStyle(MessageSender.AI)}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getLoadingDotStyle()} rounded-full animate-pulse [animation-delay:-0.3s]`}></div>
                <div className={`w-2 h-2 ${getLoadingDotStyle()} rounded-full animate-pulse [animation-delay:-0.15s]`}></div>
                <div className={`w-2 h-2 ${getLoadingDotStyle()} rounded-full animate-pulse`}></div>
              </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800">
         <form onSubmit={handleSend} className="p-4">
            <div className={`flex items-center bg-gray-900 rounded-lg border border-gray-700 ${isTaskActive ? 'opacity-50' : 'focus-within:border-white'} transition-all`}>
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isTaskActive ? "Focus session in progress..." : "What is your goal? Format: [Task], [Time in minutes]"}
                className="w-full bg-transparent p-3 focus:outline-none text-white"
                disabled={isLoading || isTaskActive}
                />
                <button
                type="submit"
                disabled={isLoading || isTaskActive}
                className="p-3 text-gray-400 hover:text-white disabled:text-gray-600"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArena;