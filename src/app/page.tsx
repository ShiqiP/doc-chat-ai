'use client'

import Link from "next/link";
import { Brain, FileText, MessageSquare, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIKit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  status: 'available' | 'coming-soon';
  features: string[];
  color: string;
}

const aiKits: AIKit[] = [
  {
    id: 'doc-chat',
    title: 'DocChat AI',
    description: 'AI-powered document analysis and conversation. Upload documents, extract insights, and chat with your content.',
    icon: <FileText className="w-6 h-6" />,
    href: '/doc-chat',
    status: 'available',
    features: ['PDF & Document Support', 'Text Extraction', 'AI Summarization', 'Interactive Q&A'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'code-assistant',
    title: 'Code Assistant',
    description: 'Intelligent code analysis, generation, and debugging assistant for developers.',
    icon: <Brain className="w-6 h-6" />,
    href: '/code-assistant',
    status: 'coming-soon',
    features: ['Code Generation', 'Bug Detection', 'Code Review', 'Multi-language Support'],
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'chat-bot',
    title: 'Smart ChatBot',
    description: 'Advanced conversational AI with context awareness and personalized responses.',
    icon: <MessageSquare className="w-6 h-6" />,
    href: '/chat-bot',
    status: 'coming-soon',
    features: ['Context Memory', 'Personality Customization', 'Multi-turn Conversations', 'Rich Responses'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'content-generator',
    title: 'Content Generator',
    description: 'Generate high-quality content for blogs, social media, and marketing materials.',
    icon: <Sparkles className="w-6 h-6" />,
    href: '/content-generator',
    status: 'coming-soon',
    features: ['Blog Writing', 'Social Media Posts', 'Marketing Copy', 'SEO Optimization'],
    color: 'from-pink-500 to-violet-600'
  }
];

export default function HomePage() {
  const availableKits = aiKits.filter(kit => kit.status === 'available');
  const comingSoonKits = aiKits.filter(kit => kit.status === 'coming-soon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shiqi AI Kit</h1>
                <p className="text-muted-foreground">Powerful AI tools for enhanced productivity</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {availableKits.length} Available
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            AI-Powered Tools for
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Every Need</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover our collection of intelligent AI tools designed to boost your productivity, 
            creativity, and efficiency. Each kit is crafted with cutting-edge technology to solve real-world challenges.
          </p>
        </div>

        {/* Available Kits */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h3 className="text-2xl font-semibold text-foreground">Available Now</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableKits.map((kit) => (
              <Link key={kit.id} href={kit.href} className="group">
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${kit.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                        {kit.icon}
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                        Available
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {kit.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {kit.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {kit.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <Button className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary group-hover:shadow-md transition-all">
                      Launch Kit
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon Kits */}
        {comingSoonKits.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-muted-foreground to-muted-foreground/50 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-foreground">Coming Soon</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonKits.map((kit) => (
                <Card key={kit.id} className="h-full p-6 border-border/30 opacity-75">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${kit.color} opacity-60 rounded-lg flex items-center justify-center text-white shadow-sm`}>
                        {kit.icon}
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                        Coming Soon
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        {kit.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {kit.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {kit.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to boost your productivity?
            </h3>
            <p className="text-muted-foreground mb-8">
              Start with our available AI kits and experience the power of intelligent automation.
            </p>
            <Link href="/doc-chat">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started with DocChat AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}