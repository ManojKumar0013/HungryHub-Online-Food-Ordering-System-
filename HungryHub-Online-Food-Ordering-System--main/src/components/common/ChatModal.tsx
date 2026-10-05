import React, { useState } from 'react';
import { Order, ChatMessage } from '../../types';
import { X, Send, Bot, User, Bike, Store, CheckCheck } from 'lucide-react';

interface ChatModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'system',
      text: `Chat initialized for Order ${order.id}. Support and delivery rider connected.`,
      timestamp: '10:02 AM',
    },
    {
      id: 'm2',
      sender: 'driver',
      text: `Hi ${order.customerName.split(' ')[0]}! I've picked up your order from ${order.restaurantName} and I'm currently on my way.`,
      timestamp: '10:04 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated automated rider reply after 1.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: 'driver',
        text: 'Got it! Following GPS route to your building entrance now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <img
              src={order.driverAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
              alt={order.driverName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{order.driverName}</h4>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Delivery
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isSystem = m.sender === 'system';

            if (isSystem) {
              return (
                <div key={m.id} className="text-center my-2">
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    {m.text}
                  </span>
                </div>
              );
            }

            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    isUser
                      ? 'bg-[#FF6B00] text-white rounded-br-none shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200/50 dark:border-zinc-700/50'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-zinc-400 mt-1 px-1">
                  <span>{m.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-100">•</span>
              <span className="animate-bounce delay-200">•</span>
              <span>Rider is typing...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to delivery partner..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold border-none focus:ring-2 focus:ring-[#FF6B00]"
          />
          <button
            type="submit"
            className="p-3 rounded-2xl bg-[#FF6B00] text-white font-bold hover:bg-[#e05e00] transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
