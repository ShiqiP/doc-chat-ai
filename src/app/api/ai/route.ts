import { NextRequest, NextResponse } from 'next/server';
import { aiRateLimiter, getClientIP } from '@/lib/rate-limit';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Content size limits
const MAX_CONTENT_SIZE = 50000; // 50KB
const MAX_QUESTION_SIZE = 1000; // 1KB

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    if (!aiRateLimiter.isAllowed(clientIP)) {
      const remaining = aiRateLimiter.getRemainingRequests(clientIP);
      const resetTime = aiRateLimiter.getResetTime(clientIP);
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          remaining,
          resetTime: new Date(resetTime).toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(resetTime).toISOString()
          }
        }
      );
    }

    const { content, question, type } = await request.json();

    // Content size validation
    if (content && content.length > MAX_CONTENT_SIZE) {
      return NextResponse.json(
        { error: `Content too large. Maximum size is ${MAX_CONTENT_SIZE} characters.` },
        { status: 400 }
      );
    }

    if (question && question.length > MAX_QUESTION_SIZE) {
      return NextResponse.json(
        { error: `Question too large. Maximum size is ${MAX_QUESTION_SIZE} characters.` },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    let prompt = '';
    let systemPrompt = '';

    if (type === 'summarize') {
      systemPrompt = `You are a helpful AI assistant that summarizes documents and generates relevant questions. 
      Provide a concise summary (under 300 words) and generate 3-5 relevant questions that users might ask about this content.
      Format your response as JSON with "summary" and "questions" fields. If the content contains meaningless text, return summary shows that the content is meaningless and an empty array for questions.`;
      
      prompt = `Please analyze the following content and provide:
      1. A concise summary (under 300 words)
      2. 3-5 relevant questions that users might ask about this content
      
      Content: ${content}
      
      Respond in JSON format:
      {
        "summary": "your summary here",
        "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
      }`;
    } else if (type === 'question') {
      systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context. 
      Provide clear, accurate answers based on the context given.`;
      
      prompt = `Based on the following context, please answer this question: "${question}"
      
      Context: ${content}
      
      Provide a clear and helpful answer based on the context.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    if (type === 'summarize') {
      try {
        const parsedResponse = JSON.parse(aiResponse);
        return NextResponse.json(parsedResponse);
      } catch (error) {
        // Fallback if JSON parsing fails
        return NextResponse.json({
          summary: aiResponse,
          questions: [
            "What are the main topics covered?",
            "Summarize the key points",
            "What are the important conclusions?",
            "Explain the main concepts"
          ]
        });
      }
    } else {
      return NextResponse.json({ answer: aiResponse });
    }
      } catch {
      console.error('AI API error');
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      );
    }
} 