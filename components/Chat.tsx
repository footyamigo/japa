'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { checkChatAccess, recordChatUsage } from '@/lib/services/chatUsage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  visaId?: string;
  countryCode?: string;
  visaName?: string;
  visaDescription?: string;
}

export default function Chat({ visaId, countryCode, visaName, visaDescription }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [chatAccess, setChatAccess] = useState<{
    canChat: boolean;
    reason?: string;
    remainingQuestions?: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAccess = useCallback(async () => {
    if (!user) return;
    
    try {
      setCheckingAccess(true);
      const access = await checkChatAccess(user);
      setChatAccess(access);
    } catch (error) {
      console.error('[Chat] Error checking access:', error);
    } finally {
      setCheckingAccess(false);
    }
  }, [user]);

  // Check access and load welcome message on mount
  useEffect(() => {
    if (user) {
      checkAccess();
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm Maya, your personal visa expert. I'm here to help you with ${visaName || 'your visa application'}. Ask me anything about requirements, documents, the application process, or any concerns you have. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user, visaName, checkAccess]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !chatAccess?.canChat || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          context: {
            visaId,
            countryCode,
            visaName,
            visaDescription,
          },
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Record usage after successful response
      await recordChatUsage(user);
      
      // Refresh access to update remaining questions
      await checkAccess();
    } catch (error: any) {
      console.error('[Chat] Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Please try again later.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null; // Don't show chat bubble if not logged in
  }

  if (checkingAccess) {
    return null; // Don't show until access is checked
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 overflow-hidden border-2 border-indigo-600 z-50 group"
        aria-label="Open chat"
      >
        <Image 
          src="/japa-girl.png" 
          alt="Japa AI Assistant" 
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
        {chatAccess && chatAccess.remainingQuestions !== undefined && chatAccess.remainingQuestions > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {chatAccess.remainingQuestions}
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Window */}
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:w-[500px] h-[85vh] sm:h-[600px] flex flex-col z-10">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-indigo-600 text-white rounded-t-2xl sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  <Image 
                    src="/japa-girl.png" 
                    alt="Your Visa Expert" 
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Your Visa Expert</h3>
                  {chatAccess && (
                    <p className="text-xs text-white/80 mt-0.5">
                      {chatAccess.remainingQuestions !== undefined && chatAccess.remainingQuestions > 0
                        ? `${chatAccess.remainingQuestions} question${chatAccess.remainingQuestions === 1 ? '' : 's'} remaining today`
                        : chatAccess.reason}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl sm:rounded-b-2xl">
              {!chatAccess?.canChat ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 text-center">
                    {chatAccess?.reason || 'Chat access unavailable'}
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about this visa guide..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-gray-900"
                    rows={2}
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || loading || !chatAccess?.canChat}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

