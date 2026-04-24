"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Copy, Check, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailReplyProps {
  initialPrompt?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_RESPONSES: Record<string, string> = {
  professor: `Subject: Re: Assignment Submission

Dear Professor Smith,

Thank you for your email regarding the assignment. I wanted to let you know that I have completed all the required work and submitted it through the course portal.

I made sure to address all the key points mentioned in the rubric, including the literature review and methodology sections. Please let me know if you need any additional materials or clarification.

Best regards,
[Your Name]`,
  meeting: `Subject: Re: Meeting Request

Hi [Name],

Thank you for reaching out. I would be happy to meet with you to discuss this further.

I am available on the following dates and times:
- Monday, 2:00 PM - 4:00 PM
- Wednesday, 10:00 AM - 12:00 PM
- Friday, 3:00 PM - 5:00 PM

Please let me know which time works best for you, and I will send a calendar invite.

Best regards,
[Your Name]`,
  default: `Subject: Re: Your Email

Dear [Recipient],

Thank you for your email. I appreciate you taking the time to reach out.

I have reviewed the information you provided and would like to follow up on a few points. Please let me know if you have any questions or need additional information.

Looking forward to hearing from you.

Best regards,
[Your Name]`,
};

export function EmailReply({ initialPrompt, onBack }: EmailReplyProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialPrompt) {
      return [
        {
          id: "1",
          role: "user",
          content: initialPrompt,
        },
      ];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasGeneratedInitial = useRef(false);

  useEffect(() => {
    // Auto-generate response for initial prompt (only once)
    if (initialPrompt && messages.length === 1 && messages[0].role === "user" && !hasGeneratedInitial.current) {
      hasGeneratedInitial.current = true;
      generateResponse(initialPrompt);
    }
  }, [initialPrompt, messages]);

  const generateResponse = async (prompt: string) => {
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let response = EXAMPLE_RESPONSES.default;
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("professor") || lowerPrompt.includes("assignment")) {
      response = EXAMPLE_RESPONSES.professor;
    } else if (lowerPrompt.includes("meeting") || lowerPrompt.includes("schedule")) {
      response = EXAMPLE_RESPONSES.meeting;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: response,
      },
    ]);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    await generateResponse(input.trim());
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center gap-4 bg-card">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold">Email Reply Assistant</h1>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-medium mb-2">Email Reply Assistant</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Describe the email you need to reply to, and I will generate a professional response for you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "Reply to professor about assignment",
                  "Schedule a meeting",
                  "Thank you email",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-xl rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}
              >
                {message.role === "assistant" ? (
                  <div>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                    <div className="mt-3 pt-3 border-t border-border flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-xs"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Generating reply...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the email you want to reply to..."
              className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px] max-h-[120px]"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isGenerating}
              className="h-12 w-12 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
