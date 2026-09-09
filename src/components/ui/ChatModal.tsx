'use client';

import React, { useCallback, useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Bot, CornerDownLeft } from 'lucide-react';
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

const renderAssistantText = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={index}>{part}</React.Fragment>,
  );
};

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
  const [mounted, setMounted] = useState(false);
  const nextMessageId = useRef(2);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousRootOverflow = root.style.overflow;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    root.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      root.style.overflow = previousRootOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Core message processing used by both form submit and Enter key handling
  const processInput = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const newMessage: Message = {
      id: nextMessageId.current++,
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
        id: nextMessageId.current++,
        content: data.response,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorResponse: Message = {
        id: nextMessageId.current++,
        content: "I'm sorry, I'm having trouble processing your question right now. Please try again in a moment.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

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
  }, [isOpen, initialMessage, hasSentInitial, processInput]);

  // Allow the next hero-input message to be sent once the modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setHasSentInitial(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex h-[100dvh] w-full items-center justify-center overflow-hidden overscroll-none bg-[#050707] p-2 sm:bg-[#050707]/96 sm:p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-assistant-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="flex h-[calc(100dvh-1rem)] min-h-0 w-[calc(100vw-1rem)] min-w-0 max-w-2xl touch-pan-y flex-col overflow-hidden overscroll-contain rounded-xl border border-portfolio-gray-lighter bg-[#0b0f10] shadow-2xl sm:h-[80vh] sm:max-h-[600px] sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-portfolio-gray-lighter p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-portfolio-cyan/20">
                  <Bot className="h-6 w-6 text-portfolio-cyan" />
                </div>
                <div>
                  <h3 id="portfolio-assistant-title" className="text-base font-semibold text-portfolio-text sm:text-lg">
                    Ask about Kartikey
                  </h3>
                  <p className="text-xs text-portfolio-text-muted sm:text-sm">
                    AI-powered portfolio assistant
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-portfolio-text-muted hover:text-portfolio-text"
                aria-label="Close portfolio assistant"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-hidden overscroll-contain">
              <ChatMessageList className="overscroll-contain p-3 sm:p-4">
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
                      className="min-w-0 max-w-[calc(100%-2.5rem)] break-words text-sm leading-6"
                    >
                      {message.sender === 'ai' ? renderAssistantText(message.content) : message.content}
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
            <div className="shrink-0 border-t border-portfolio-gray-lighter bg-[#0b0f10] p-4 sm:p-6">
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
                  className="min-h-12 resize-none rounded-lg border-0 bg-portfolio-gray p-3 text-base shadow-none focus-visible:ring-0 sm:text-sm"
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
    </AnimatePresence>,
    document.body,
  );
};

export default ChatModal;
