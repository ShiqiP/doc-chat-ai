'use client';

import { useState, useCallback, useEffect } from "react";
import { File, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// Dynamic imports for react-pdf to avoid SSR issues
let Document: React.ComponentType<any> | null = null;
let Page: React.ComponentType<any> | null = null;
let pdfjs: any = null;

interface FilePreviewProps {
  file: File;
  content: string;
  onRemove: () => void;
  onTextSelect?: (selectedText: string) => void;
}

export const FilePreview = ({ file, content, onRemove, onTextSelect }: FilePreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedText, setSelectedText] = useState<string>("");
  const [isPdfLoaded, setIsPdfLoaded] = useState<boolean>(false);

  // Load react-pdf on client side
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const reactPdf = await import('react-pdf');
        Document = reactPdf.Document;
        Page = reactPdf.Page;
        pdfjs = reactPdf.pdfjs;
        
        // Set up PDF.js worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setIsPdfLoaded(true);
      } catch (error) {
        console.error('Failed to load react-pdf:', error);
      }
    };

    if (file.type === 'application/pdf') {
      loadPdf();
    }
  }, [file.type]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      setSelectedText(text);
      onTextSelect?.(text);
    }
  }, [onTextSelect]);

  const isPDF = file.type === 'application/pdf';

  const getFileIcon = () => {
    if (file.type === 'application/pdf') return <File className="w-4 h-4 text-red-500" />;
    if (file.type === 'text/markdown') return <FileText className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-green-500" />;
  };

  const getFileTypeLabel = () => {
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type === 'text/markdown') return 'Markdown';
    return 'Text';
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-card border border-primary/10 shadow-lg overflow-hidden">
      {/* Minimal Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/20 bg-muted/30">
        <div className="flex items-center gap-2">
          {getFileIcon()}
          <span className="font-medium text-sm truncate max-w-48">{file.name}</span>
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {getFileTypeLabel()}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {isPDF && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="h-7 w-7 p-0"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-10 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                className="h-7 w-7 p-0"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-hidden relative">
        {isPDF ? (
          <div className="h-full flex flex-col">
            {/* PDF Navigation */}
            {numPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-2 border-b border-border/20 bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs text-muted-foreground min-w-16 text-center">
                  {pageNumber} / {numPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}

                         {/* PDF Document */}
             <ScrollArea className="flex-1">
               <div
                 className="flex justify-center p-4 select-text"
                 onMouseUp={handleTextSelection}
                 style={{ userSelect: 'text' }}
               >
                 {Document && Page && isPdfLoaded ? (
                   <Document
                     file={file}
                     onLoadSuccess={onDocumentLoadSuccess}
                     className="border border-border/30 shadow-sm"
                   >
                     <Page
                       pageNumber={pageNumber}
                       scale={scale}
                       renderTextLayer={true}
                       renderAnnotationLayer={false}
                       canvasBackground="transparent"
                     />
                   </Document>
                 ) : (
                   <div className="flex items-center justify-center h-48 text-muted-foreground">
                     <div className="text-center space-y-2">
                       <div className="w-8 h-8 mx-auto bg-muted/50 rounded-lg flex items-center justify-center">
                         <FileText className="w-4 h-4" />
                       </div>
                       <p className="text-sm">Loading PDF viewer...</p>
                     </div>
                   </div>
                 )}
               </div>
             </ScrollArea>
          </div>
        ) : (
          // Text content viewer
          <ScrollArea className="h-full">
            <div
              className="p-4 text-sm leading-relaxed whitespace-pre-wrap select-text"
              onMouseUp={handleTextSelection}
              style={{ userSelect: 'text' }}
            >
              {content}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Selected text indicator */}
      {selectedText && (
        <div className="p-2 border-t border-border/20 bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1">Selected:</div>
          <div className="text-xs bg-primary/10 border border-primary/20 p-2 max-h-16 overflow-y-auto">
            &ldquo;{selectedText}&rdquo;
          </div>
        </div>
      )}
    </Card>
  );
};