'use client'

import Link from "next/link";
import { Brain, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CodeAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to AI Kits</span>
            </Link>
            <div className="w-px h-6 bg-border/50"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Code Assistant</h1>
              <p className="text-xs text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">Code Assistant</h2>
            <p className="text-muted-foreground text-lg mb-8">
              This AI kit is currently under development. It will feature intelligent code analysis, 
              generation, and debugging capabilities for developers.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-8">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Coming Soon</span>
            </div>
            
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Explore Other AI Kits
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}