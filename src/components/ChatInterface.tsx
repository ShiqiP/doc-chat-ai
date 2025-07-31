'use client'

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Sparkles, ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  documentContent?: string;
  documentName?: string;
  documentType?: 'file' | 'text';
  selectedText?: string;
}

export const ChatInterface = ({ documentContent, documentName, documentType, selectedText }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const questionsScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateSuggestedQuestions = () => {
    const questions = [
      "What are the main topics covered?",
      "Summarize the key points",
      "What are the important conclusions?",
      "Explain the main concepts"
    ];
    setSuggestedQuestions(questions);
  };

  const generateSummary = async () => {
    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const summaryMessage: Message = {
      id: Date.now().toString(),
      content: `I've analyzed your ${documentType === 'file' ? 'document' : 'text'}${documentName ? ` "${documentName}"` : ''}. Here's what I found:

**Key Insights:**
• This document contains valuable information that I can help you explore
• I can answer questions about specific details, concepts, or themes
• I can help clarify complex sections or provide explanations
• I can also help you find specific information quickly

**What would you like to learn?** You can ask me:
- "What are the main topics covered?"
- "Summarize the key points"
- "What are the important conclusions?"
- "Explain the main concepts"

Or ask any specific question about the content!`,
      type: 'assistant',
      timestamp: new Date()
    };
    
    setMessages([summaryMessage]);
    setIsLoading(false);
  };

  // Generate summary when document is uploaded
  useEffect(() => {
    if (documentContent && messages.length === 0) {
      generateSummary();
      generateSuggestedQuestions();
    }
  }, [documentContent]);

  const sendMessage = async (question?: string) => {
    const messageText = question || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse = generateAIResponse(messageText);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      type: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollQuestions = (direction: 'left' | 'right') => {
    if (questionsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      questionsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const generateAIResponse = (question: string): string => {
    const responses = [
      "Based on the document content, I can see that this topic is well-covered. The key points include...",
      "This is an interesting question about the material. From what I've analyzed, the main concepts are...",
      "Great question! The document addresses this topic in several ways. Here's what I found...",
      "I can help you understand this better. The content shows that...",
      "This is a complex topic that the document explores in detail. Let me break it down for you..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {documentContent ? 'Ready to help you learn' : 'Upload a document to start'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && !documentContent && (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 mx-auto bg-muted/50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Ready to learn</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Upload a document or paste text to start an AI-powered conversation and extract insights.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Suggested questions</h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollQuestions('left')}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollQuestions('right')}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <ScrollArea ref={questionsScrollRef} className="scrollbar-hide">
            <div className="flex gap-2 pb-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(question)}
                  className="whitespace-nowrap border-border/50 hover:border-primary/50"
                >
                  {question}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/40 bg-card/30">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your document..."
              className="pr-10 border-border/50 focus:border-primary/50"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSpeechRecognition}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              {isListening ? (
                <MicOff className="w-3 h-3 text-destructive" />
              ) : (
                <Mic className="w-3 h-3 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};