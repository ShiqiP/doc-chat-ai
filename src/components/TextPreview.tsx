
'use client'

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TextPreviewProps {
  content: string;
  onRemove: () => void;
  onTextSelect?: (selectedText: string) => void;
}

export const TextPreview = ({ content, onRemove, onTextSelect }: TextPreviewProps) => {


  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      onTextSelect?.(text);
    }
  };

  // Process content into paragraphs for better display
  const paragraphs = content.split('\n').filter(para => para.trim().length > 0);
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card className="h-full flex flex-col border border-border/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-card/50">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-blue-500" />
          <div>
            <h3 className="font-medium text-foreground">Text Content</h3>
            <p className="text-xs text-muted-foreground">Ready for analysis</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {wordCount} words
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          ×
        </Button>
      </div>

      {/* Content Viewer */}
      <ScrollArea className="flex-1">
        <div 
          className="p-6 text-sm leading-relaxed select-text"
          onMouseUp={handleTextSelection}
          style={{ userSelect: 'text' }}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>

      {/* Selected text indicator */}
      {/* {selectedText && (
        <div className="p-4 border-t border-border/40 bg-muted/30">
          <div className="text-xs text-muted-foreground mb-2">Selected text:</div>
          <div className="text-xs bg-primary/10 border border-primary/20 p-3 rounded-lg max-h-20 overflow-y-auto">
            &ldquo;{selectedText}&rdquo;
          </div>
        </div>
      )} */}
    </Card>
  );
};