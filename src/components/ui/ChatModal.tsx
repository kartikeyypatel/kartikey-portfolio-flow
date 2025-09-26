'use client';

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatMessageList } from '@/components/ui/chat-message-list';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi! I'm Kartikey's AI assistant. I can tell you about my experience as a Full Stack Engineer, my projects (like the Consumer Safety App and Document Intelligence Assistant), my technical skills in React, Spring Boot, and AWS, or my education at NJIT. What would you like to know?",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  // Core message processing used by both form submit and Enter key handling
  const processInput = async (userInput: string) => {
    if (!userInput.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: userInput,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/simple-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput,
          conversationHistory: messages.slice(-6), // Last 3 exchanges
          options: {
            topK: 5,
            similarityThreshold: 0.7,
            maxContextTokens: 2000,
            includeFollowUps: true
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from AI');
      const data = await response.json();

      const aiResponse: Message = {
        id: newMessage.id + 1,
        content: data.response,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorResponse: Message = {
        id: newMessage.id + 1,
        content: "I'm sorry, I'm having trouble processing your question right now. Please try again in a moment.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userInput = input;
    setInput("");
    await processInput(userInput);
  };

  // Send initial message from hero input when modal opens
  React.useEffect(() => {
    if (isOpen && initialMessage && !hasSentInitial) {
      setHasSentInitial(true);
      setInput("");
      processInput(initialMessage);
    }
  }, [isOpen, initialMessage, hasSentInitial]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-portfolio-gray border border-portfolio-gray-lighter rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-portfolio-gray-lighter">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-portfolio-cyan/20">
                  <Bot className="h-6 w-6 text-portfolio-cyan" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-portfolio-text">
                    Ask about Kartikey
                  </h3>
                  <p className="text-sm text-portfolio-text-muted">
                    AI-powered portfolio assistant
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-portfolio-text-muted hover:text-portfolio-text"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      fallback={message.sender === "user" ? "U" : "AI"}
                    />
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      fallback="AI"
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-portfolio-gray-lighter">
              <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border border-portfolio-gray-lighter bg-portfolio-gray focus-within:ring-1 focus-within:ring-portfolio-cyan p-1"
              >
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const text = input.trim();
                      if (text && !isLoading) {
                        setInput("");
                        processInput(text);
                      }
                    }
                  }}
                  placeholder="Ask about Kartikey's experience, skills, projects..."
                  className="min-h-12 resize-none rounded-lg bg-portfolio-gray border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0 justify-end">
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="ml-auto gap-1.5 bg-portfolio-cyan text-portfolio-black hover:bg-portfolio-cyan/90"
                    disabled={!input.trim() || isLoading}
                  >
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;