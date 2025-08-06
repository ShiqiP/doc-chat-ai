'use client'

import { useState, useRef } from "react";
import { Upload, File, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePreview } from "./FilePreview";
import { TextPreview } from "./TextPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UploadAreaProps {
  onContentSubmit: (content: string, type: 'file' | 'text', fileName?: string) => void;
  onTextSelect?: (selectedText: string) => void;
  onClear?: () => void;
}

export const UploadArea = ({ onContentSubmit, onTextSelect, onClear }: UploadAreaProps) => {


  const [isDragging, setIsDragging] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [hasSubmittedText, setHasSubmittedText] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearType, setClearType] = useState<'file' | 'text'>('file');
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

  const handleFileUpload = async (file: File) => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.doc', '.docx', '.pdf', '.md', '.txt'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a DOC, DOCX, PDF, MD, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    // File size limits
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `File size (${fileSizeMB}MB) exceeds the 5MB limit. Please choose a smaller file.`,
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);

    try {
      let content = "";

      if (fileExtension === '.pdf') {
        // For PDF files, we'll extract text using PDF.js
        content = await extractPdfText(file);
      } else if (fileExtension === '.doc' || fileExtension === '.docx') {
        // For Word documents, we'll use mammoth.js
        content = await extractDocText(file);
      } else {
        // For text files (txt, md), read as text
        content = await readFileAsText(file);
      }

      setFileContent(content);
      onContentSubmit(content, 'file', file.name);

      toast({
        title: "File uploaded successfully",
        description: `${file.name} (${fileSizeMB}MB) has been processed.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "Failed to extract content from the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const extractPdfText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdfjs = await import('pdfjs-dist');
          pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => {
                if ('str' in item) {
                  return item.str || '';
                }
                return '';
              })
              .join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const extractDocText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const mammoth = await import('mammoth');

          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Word document'));
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
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

    const MAX_TEXT_SIZE = 10000; // 10KB limit
    const currentSize = textContent.length;
    
    if (currentSize > MAX_TEXT_SIZE) {
      const sizeKB = (currentSize / 1024).toFixed(2);
      toast({
        title: "Text too long",
        description: `Text size (${sizeKB}KB, ${currentSize} characters) exceeds the 10KB limit. Please enter shorter text.`,
        variant: "destructive"
      });
      return;
    }

    onContentSubmit(textContent, 'text');
    setHasSubmittedText(true);
    const sizeKB = (currentSize / 1024).toFixed(2);
    toast({
      title: "Text submitted successfully",
      description: `Your text (${sizeKB}KB, ${currentSize} characters) has been processed.`,
    });
  };

  const handleClearRequest = (type: 'file' | 'text') => {
    setClearType(type);
    setShowClearDialog(true);
  };

  const handleClearConfirm = () => {
    if (clearType === 'file') {
      setUploadedFile(null);
      setFileContent("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setTextContent("");
      setHasSubmittedText(false);
    }
    onClear?.();
    setShowClearDialog(false);
  };

  const removeFile = () => {
    handleClearRequest('file');
  };

  const removeText = () => {
    handleClearRequest('text');
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
        <ScrollArea className="h-full">
          <div className="h-full flex flex-col space-y-6 p-4">
            {/* Welcome Section */}
            {/* <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Learn from your documents</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a document or paste text to start an AI-powered conversation and extract insights.
              </p>
            </div>
          </div> */}

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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Supports DOC, DOCX, PDF, MD, and TXT files</p>
                      <p className="text-amber-600 font-medium">Maximum file size: 5MB</p>
                    </div>
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
                  accept=".doc,.docx,.pdf,.md,.txt"
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
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="text-amber-600 font-medium">Maximum text size: 10KB (10,000 characters)</p>
                  <p className={`font-medium ${
                    textContent.length > 10000 
                      ? 'text-red-600' 
                      : textContent.length > 8000 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                  }`}>
                    Current: {textContent.length} characters
                    {textContent.length > 10000 && ' (EXCEEDED LIMIT)'}
                    {textContent.length > 8000 && textContent.length <= 10000 && ' (APPROACHING LIMIT)'}
                  </p>
                </div>
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
                disabled={!textContent.trim() || textContent.length > 10000}
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                {textContent.length > 10000 ? 'Text Too Long' : 'Start Learning'}
              </Button>
            </Card>
          </div>
        </ScrollArea>
      )}

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all content and chat records? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};