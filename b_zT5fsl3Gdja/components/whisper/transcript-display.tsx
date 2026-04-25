"use client";

import { cn } from "@/lib/utils";

interface TranscriptDisplayProps {
  transcript: string;
  isListening: boolean;
}

export function TranscriptDisplay({ transcript, isListening }: TranscriptDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative rounded-2xl border bg-card p-6 min-h-[120px] transition-all duration-300",
          isListening && "border-primary/50 shadow-lg shadow-primary/10"
        )}
      >
        {/* Subtle glow effect when listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse" />
        )}
        
        <div className="relative">
          {transcript ? (
            <p className="text-lg text-foreground leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-lg text-muted-foreground text-center">
              {isListening ? "Listening..." : "Click the microphone to start voice input"}
            </p>
          )}
        </div>
        
        {/* Typing indicator */}
        {isListening && (
          <div className="flex items-center gap-1 mt-4 justify-center">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
}
