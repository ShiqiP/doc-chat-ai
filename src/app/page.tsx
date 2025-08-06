'use client'
import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { UploadArea } from "@/components/UploadArea";
import { ChatInterface } from "@/components/ChatInterface";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<'file' | 'text'>('text');
  const [selectedText, setSelectedText] = useState<string>("");
  const isMobile = useIsMobile();

  const handleContentSubmit = (content: string, type: 'file' | 'text', fileName?: string) => {
    setDocumentContent(content);
    setDocumentType(type);
    setDocumentName(fileName || 'Pasted Text');
  };

  const handleClear = () => {
    setDocumentContent("");
    setDocumentName("");
    setDocumentType('text');
    setSelectedText("");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Shiqi AI Kit</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-powered</p>
            </div>
          </div>
            {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Author Shiqi</span>
            </div> */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {isMobile ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 p-4">
              <UploadArea
                onContentSubmit={handleContentSubmit}
                onTextSelect={setSelectedText}
                onClear={handleClear}
              />
            </div>
            <div className="h-96 border-t border-border/40 bg-card/50">
              <ChatInterface
                documentContent={documentContent}
                documentName={documentName}
                documentType={documentType}
                selectedText={selectedText}
                onClear={handleClear}
              />
            </div>
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={60} minSize={40} maxSize={75}>
              <div className="h-full">
                <UploadArea
                  onContentSubmit={handleContentSubmit}
                  onTextSelect={setSelectedText}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
              <div className="h-full bg-card/30 border-l border-border/40">
                <ChatInterface
                  documentContent={documentContent}
                  documentName={documentName}
                  documentType={documentType}
                  selectedText={selectedText}
                  onClear={handleClear}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default Index;
