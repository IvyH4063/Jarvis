"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Calendar, Mail, BookOpen, Sparkles } from "lucide-react";
import { TranscriptDisplay } from "./transcript-display";
import { MicrophoneButton } from "./microphone-button";
import { DashboardCard } from "./dashboard-card";
import { StudyPlanner } from "@/components/jarvis/study-planner";
import { EmailReply } from "@/components/jarvis/email-reply";
import { StudyRoomBooking } from "@/components/jarvis/study-room-booking";

type ViewType = "home" | "planner" | "email" | "room";

// Demo phrases for simulation
const demoPhrases = [
  "Schedule my study session for tomorrow at 3 PM to review calculus chapter 5",
  "Reply to Professor Smith's email about the late assignment submission",
  "Book a quiet study room on the 3rd floor for Monday morning group project",
];

export function WhisperFlow() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showDashboards, setShowDashboards] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate voice input with typing effect
  const simulateVoiceInput = useCallback(() => {
    const randomPhrase = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];
    let currentIndex = 0;
    setTranscript("");
    setShowDashboards(false);

    const typeInterval = setInterval(() => {
      if (currentIndex < randomPhrase.length) {
        setTranscript(randomPhrase.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        
        timeoutRef.current = setTimeout(() => {
          setIsListening(false);
          setShowDashboards(true);
        }, 500);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, []);

  const handleMicrophoneClick = useCallback(() => {
    if (isListening) {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      setIsListening(true);
      setShowDashboards(false);
      simulateVoiceInput();
    }
  }, [isListening, simulateVoiceInput]);

  const handleDashboardClick = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView("home");
    setShowDashboards(false);
    setTranscript("");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const dashboards = [
    {
      id: "planner" as ViewType,
      title: "Study Planner",
      description: "Create a study schedule based on your input",
      icon: Calendar,
      color: "blue" as const,
    },
    {
      id: "email" as ViewType,
      title: "Email Reply",
      description: "Generate a professional email response",
      icon: Mail,
      color: "teal" as const,
    },
    {
      id: "room" as ViewType,
      title: "Study Room Booking",
      description: "Find and book available study rooms",
      icon: BookOpen,
      color: "amber" as const,
    },
  ];

  // Render dashboard views
  if (currentView === "planner") {
    return <StudyPlanner initialTask={transcript} onBack={handleBack} />;
  }

  if (currentView === "email") {
    return <EmailReply initialPrompt={transcript} onBack={handleBack} />;
  }

  if (currentView === "room") {
    return <StudyRoomBooking initialSearch={transcript} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center gap-3 py-8">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground tracking-wide">J.A.R.V.I.S.</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 gap-8">
        {/* Transcript Display - only show when there's input or listening */}
        {(transcript || isListening) && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <TranscriptDisplay transcript={transcript} isListening={isListening} />
          </div>
        )}

        {/* Microphone Button */}
        <div className="flex flex-col items-center gap-4">
          <MicrophoneButton isListening={isListening} onClick={handleMicrophoneClick} />
          
          {!transcript && !isListening && (
            <p className="text-sm text-muted-foreground text-center max-w-md animate-in fade-in duration-500">
              At your service. Click the microphone and speak your command.
            </p>
          )}
        </div>

        {/* Dashboard Cards - only show after voice input is complete */}
        {showDashboards && (
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-500">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Select a feature to process your request
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboards.map((dashboard, index) => (
                <div
                  key={dashboard.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
                >
                  <DashboardCard
                    title={dashboard.title}
                    description={dashboard.description}
                    icon={dashboard.icon}
                    color={dashboard.color}
                    isActive={false}
                    onClick={() => handleDashboardClick(dashboard.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
