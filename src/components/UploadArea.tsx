import { useState, useRef } from "react";
import { Upload, File, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FilePreview } from "./FilePreview";
import { TextPreview } from "./TextPreview";

interface UploadAreaProps {
  onContentSubmit: (content: string, type: 'file' | 'text', fileName?: string) => void;
  onTextSelect?: (selectedText: string) => void;
}

export const UploadArea = ({ onContentSubmit, onTextSelect }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [hasSubmittedText, setHasSubmittedText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'text/markdown'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, text file, or markdown file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      onContentSubmit(content, 'file', file.name);
    };
    reader.readAsText(file);

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been processed.`,
    });
  };

  const handleTextSubmit = () => {
    if (!textContent.trim()) {
      toast({
        title: "No content provided",
        description: "Please enter some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    onContentSubmit(textContent, 'text');
    setHasSubmittedText(true);
    toast({
      title: "Text submitted successfully",
      description: "Your text has been processed.",
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeText = () => {
    setTextContent("");
    setHasSubmittedText(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Show File Preview if file is uploaded */}
      {uploadedFile && fileContent && (
        <div className="flex-1 min-h-0">
          <FilePreview 
            file={uploadedFile} 
            content={fileContent} 
            onRemove={removeFile}
            onTextSelect={onTextSelect}
          />
        </div>
      )}

      {/* Show Text Preview if text is submitted */}
      {hasSubmittedText && textContent && !uploadedFile && (
        <div className="flex-1 min-h-0">
          <TextPreview 
            content={textContent} 
            onRemove={removeText}
            onTextSelect={onTextSelect}
          />
        </div>
      )}

      {/* Show upload area if no content is uploaded */}
      {!uploadedFile && !hasSubmittedText && (
        <div className="h-full flex flex-col space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Learn from your documents</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a document or paste text to start an AI-powered conversation and extract insights.
              </p>
            </div>
          </div>

          {/* File Upload Area */}
          <Card className="relative overflow-hidden border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors">
            <div
              className={`
                p-8 transition-all duration-300 rounded-lg
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-muted/30'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload a document</h3>
                  <p className="text-muted-foreground text-sm">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, TXT, and MD files up to 10MB
                  </p>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:border-primary/40"
                >
                  <File className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </Card>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-border/40"></div>
            <span className="px-4 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border/40"></div>
          </div>

          {/* Text Input Area */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Paste text directly</h3>
              <p className="text-muted-foreground text-sm">
                Enter any text content you&apos;d like to analyze and learn from
              </p>
            </div>
            
            <Textarea
              placeholder="Paste your text content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="min-h-[120px] resize-none border-border/50 focus:border-primary/50"
            />
            
            <Button
              onClick={handleTextSubmit}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!textContent.trim()}
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};