'use client'

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Sparkles, ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { summarizeContent, askQuestion, AIResponse } from "@/lib/ai";

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
  onClear?: () => void;
}

export const ChatInterface = ({ documentContent, documentName, documentType, selectedText }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>("");
  const [selectedTextRef, setSelectedTextRef] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const questionsScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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

  const generateSummary = async () => {
    if (!documentContent) return;
    
    setIsLoading(true);
    
    try {
      const aiResponse: AIResponse = await summarizeContent(documentContent);
      
      if (aiResponse.error) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `I encountered an error while analyzing your ${documentType === 'file' ? 'document' : 'text'}${documentName ? ` "${documentName}"` : ''}. ${aiResponse.error}`,
          type: 'assistant',
          timestamp: new Date()
        };
        setMessages([errorMessage]);
      } else {
        const summaryMessage: Message = {
          id: Date.now().toString(),
          content: `I've analyzed your ${documentType === 'file' ? 'document' : 'text'}${documentName ? ` "${documentName}"` : ''}. Here's what I found:

**Summary:**
${aiResponse.summary}

**What would you like to learn?** You can ask me any of the suggested questions below, or ask your own specific question about the content!`,
          type: 'assistant',
          timestamp: new Date()
        };
        
        setMessages([summaryMessage]);
        
        if (aiResponse.questions && aiResponse.questions.length > 0) {
          setSuggestedQuestions(aiResponse.questions);
        }
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `I apologize, but I encountered an error while analyzing your content. Please try again.`,
        type: 'assistant',
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate summary when document is uploaded
  useEffect(() => {
    if (documentContent) {
      setCurrentContent(documentContent);
      // Always generate summary when new content is provided
      generateSummary();
    }
  }, [documentContent]);

  // Reset chat state when document content is cleared
  useEffect(() => {
    if (!documentContent) {
      setMessages([]);
      setInputValue("");
      setSuggestedQuestions([]);
      setCurrentContent("");
      setSelectedTextRef("");
    }
  }, [documentContent]);

  // Update selected text reference when selectedText prop changes
  useEffect(() => {
    if (selectedText && selectedText.trim()) {
      setSelectedTextRef(selectedText.trim());
    }
  }, [selectedText]);

  const sendMessage = async (question?: string) => {
    const messageText = question || inputValue.trim();
    if (!messageText || !currentContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      let contextContent = currentContent;
      // If there's selected text, use it as the primary context
      if (selectedTextRef) {
        contextContent = selectedTextRef;
      }

      const aiResponse: AIResponse = await askQuestion(contextContent, messageText);
      
      if (aiResponse.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I encountered an error while processing your question: ${aiResponse.error}`,
          type: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.answer || 'I apologize, but I couldn\'t generate a response. Please try again.',
          type: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error while processing your question. Please try again.',
        type: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
      const scrollViewport = questionsScrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        const scrollAmount = direction === 'left' ? -200 : 200;
        scrollViewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearSelectedTextRef = () => {
    setSelectedTextRef("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border/40 bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground text-sm sm:text-base">AI Assistant</h3>
            <p className="text-xs text-muted-foreground truncate">
              {documentContent ? 'Ready to help you learn' : 'Upload a document to start'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-3 sm:p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && !documentContent && (
              <div className="text-center py-8 sm:py-12 space-y-4">
                <div className="w-12 h-12 mx-auto bg-muted/50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground text-sm sm:text-base">Ready to learn</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    Upload a document or paste text to start an AI-powered conversation and extract insights.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</div>
                  <div className={`text-xs mt-1 sm:mt-2 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-border/40 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-medium text-foreground">Suggested questions</h4>
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
                  className="whitespace-nowrap border-border/50 hover:border-primary/50 text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Selected Text Reference */}
      {selectedTextRef && (
        <div className="p-3 sm:p-4 border-t border-border/40 bg-primary/5 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary">Selected Text Reference</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-background/50 rounded-lg p-2 sm:p-3 border border-border/30 break-words">
                &ldquo;{selectedTextRef}&rdquo;
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelectedTextRef}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border/40 bg-card/30 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedTextRef ? "Ask a question about the selected text..." : "Ask a question about your document..."}
              className="pr-10 border-border/50 focus:border-primary/50 text-xs sm:text-sm"
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
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};