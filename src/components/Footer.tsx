'use client'

import Link from "next/link";
import { Heart, Github, Linkedin, Mail, Zap } from "lucide-react";

interface FooterProps {
  variant?: 'full' | 'compact' | 'centered';
  currentPage?: string;
}

export const Footer = ({ variant = 'full', currentPage }: FooterProps) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Shiqi AI Tools";

  // Full footer for homepage
  if (variant === 'full') {
    return (
      <footer className="border-t border-border/40 bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Author Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Shiqi</h4>
                    <p className="text-sm text-muted-foreground">Software Engineer & Creator</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate about creating intelligent AI solutions that enhance productivity and simplify complex tasks. 
                  Building the future of AI-powered tools, one kit at a time.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">AI Kits</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/doc-chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      DocChat AI
                    </Link>
                  </li>
                  <li>
                    <span className="text-sm text-muted-foreground/60">Code Assistant (Coming Soon)</span>
                  </li>
                  <li>
                    <span className="text-sm text-muted-foreground/60">Smart ChatBot (Coming Soon)</span>
                  </li>
                  <li>
                    <span className="text-sm text-muted-foreground/60">Content Generator (Coming Soon)</span>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Connect</h4>
                <div className="flex flex-col space-y-3">
                  <a 
                    href="https://github.com/ShiqiP" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Github className="w-4 h-4" />
                    </div>
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/shiqi-pang/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="mailto:shiqipam@gmail.com" 
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-border/40 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>© 2025 {appName}. Built with</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>using Next.js, TypeScript & AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Compact footer for app pages
  if (variant === 'compact') {
    return (
      <footer className="border-t border-border/40 bg-muted/20 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2025 {appName}</span>
            {currentPage && (
              <>
                <span>•</span>
                <span>{currentPage}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/ShiqiP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 bg-muted/50 rounded-md flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Github className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </a>
            <a 
              href="https://www.linkedin.com/in/shiqi-pang/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 bg-muted/50 rounded-md flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Linkedin className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </a>
            <a 
              href="mailto:shiqipam@gmail.com"
              className="w-6 h-6 bg-muted/50 rounded-md flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Mail className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        </div>
      </footer>
    );
  }

  // Centered footer for coming soon pages
  if (variant === 'centered') {
    return (
      <footer className="border-t border-border/40 bg-muted/20 mt-auto">
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 {appName}</span>
            <span>•</span>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/ShiqiP" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/shiqi-pang/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:shiqipam@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return null;
};