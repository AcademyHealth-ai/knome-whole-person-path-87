import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const streamAssistantResponse = async (
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  ) => {
    const url = `https://tlqkvthdhqvkakpzhqkx.functions.supabase.co/functions/v1/ai-assistant-stream`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, conversationHistory }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Failed to stream response');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE lines from OpenAI: lines start with `data:`
        const lines = chunk.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') continue;
          try {
            const json = JSON.parse(dataStr);
            const delta: string | undefined = json?.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              // Update last assistant message incrementally
              setMessages((prev) => {
                const updated = [...prev];
                let lastIndex = updated.length - 1;
                if (lastIndex < 0 || updated[lastIndex].role !== 'assistant') {
                  updated.push({ role: 'assistant', content: '', timestamp: new Date() });
                  lastIndex = updated.length - 1;
                }
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: assistantText,
                  timestamp: new Date(),
                };
                return updated;
              });
            }
          } catch {
            // Ignore keepalive or non-JSON lines
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      toast({
        title: 'Error',
        description: 'Failed to stream response from Stanley. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Add user message immediately and create an empty assistant message placeholder
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '', timestamp: new Date() },
    ]);

    try {
      // Prepare conversation history for the API (include the new user message)
      const conversationHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ];

      await streamAssistantResponse(message, conversationHistory);
    } catch (error) {
      console.error('Error sending message to AI assistant:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message to AI assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  };
};
