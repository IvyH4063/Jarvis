"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Copy, Check, User, Bot, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Gmail Icon
const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
    <path fill="#fff" d="M4 6l8 5 8-5v2l-8 5-8-5V6z" />
    <path fill="#EA4335" d="M4 6l8 5 8-5" />
    <path fill="#34A853" d="M4 18V8l8 5V18" />
    <path fill="#FBBC04" d="M20 18V8l-8 5v5" />
  </svg>
);

interface EmailReplyProps {
  initialPrompt?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  subject?: string;
}

const EXAMPLE_RESPONSES: Record<string, { subject: string; body: string }> = {
  professor: {
    subject: "Re: Assignment Submission",
    body: `Dear Professor Smith,

Thank you for your email regarding the assignment. I wanted to let you know that I have completed all the required work and submitted it through the course portal.

I made sure to address all the key points mentioned in the rubric, including the literature review and methodology sections. Please let me know if you need any additional materials or clarification.

Best regards,
[Your Name]`,
  },
  meeting: {
    subject: "Re: Meeting Request",
    body: `Hi [Name],

Thank you for reaching out. I would be happy to meet with you to discuss this further.

I am available on the following dates and times:
- Monday, 2:00 PM - 4:00 PM
- Wednesday, 10:00 AM - 12:00 PM
- Friday, 3:00 PM - 5:00 PM

Please let me know which time works best for you, and I will send a calendar invite.

Best regards,
[Your Name]`,
  },
  default: {
    subject: "Re: Your Email",
    body: `Dear [Recipient],

Thank you for your email. I appreciate you taking the time to reach out.

I have reviewed the information you provided and would like to follow up on a few points. Please let me know if you have any questions or need additional information.

Looking forward to hearing from you.

Best regards,
[Your Name]`,
  },
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
  const hasGeneratedInitial = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        content: response.body,
        subject: response.subject,
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

  // Generate Gmail compose URL
  const generateGmailComposeUrl = (subject: string, body: string) => {
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      su: subject,
      body: body,
    });
    return `https://mail.google.com/mail/?${params.toString()}`;
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
          <GmailIcon />
          <h1 className="text-xl font-semibold">Email Reply Assistant</h1>
        </div>
      </header>

      {/* Gmail Integration Notice */}
      <div className="px-4 py-2 bg-red-50 border-b border-red-100">
        <p className="text-xs text-red-700 text-center">
          Generated replies can be opened directly in Gmail. Click the Gmail button to compose.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-red-600" />
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
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-red-600" />
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
                    {message.subject && (
                      <div className="mb-2 pb-2 border-b border-border">
                        <span className="text-xs text-muted-foreground">Subject: </span>
                        <span className="text-sm font-medium">{message.subject}</span>
                      </div>
                    )}
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                    <div className="mt-3 pt-3 border-t border-border flex justify-end gap-2">
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
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                      >
                        <a
                          href={generateGmailComposeUrl(message.subject || "Re: Your Email", message.content)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GmailIcon />
                          <span className="ml-1.5">Open in Gmail</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
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
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-red-600" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
