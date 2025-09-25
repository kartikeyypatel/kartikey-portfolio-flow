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
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm Kartikey's AI assistant. I can answer questions about his experience, skills, projects, and background. What would you like to know?",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (this would be replaced with actual RAG implementation)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: "Thanks for your question! This is a placeholder response. The actual RAG-based chatbot will be implemented to provide detailed answers about Kartikey's experience, skills, and projects based on his resume and portfolio data.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

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