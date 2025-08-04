export interface AIResponse {
  summary?: string;
  questions?: string[];
  answer?: string;
  error?: string;
}

export async function summarizeContent(content: string): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        type: 'summarize',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      error: 'Failed to summarize content',
      summary: 'I apologize, but I encountered an error while analyzing your content. Please try again.',
      questions: [
        "What are the main topics covered?",
        "Summarize the key points",
        "What are the important conclusions?",
        "Explain the main concepts"
      ]
    };
  }
}

export async function askQuestion(content: string, question: string): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        question,
        type: 'question',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      error: 'Failed to get answer',
      answer: 'I apologize, but I encountered an error while processing your question. Please try again.'
    };
  }
} 