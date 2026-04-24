"use client";

import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicrophoneButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export function MicrophoneButton({ isListening, onClick }: MicrophoneButtonProps) {
  return (
    <div className="relative">
      {/* Ripple effect when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute -inset-8 rounded-full bg-primary/5 animate-pulse" style={{ animationDelay: "150ms" }} />
        </>
      )}
      
      <button
        onClick={onClick}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
          isListening
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105 border"
        )}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {isListening ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
