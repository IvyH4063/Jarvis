"use client";

import { useState, useCallback, useRef } from "react";
import {
  Calendar,
  Mail,
  BookOpen,
  Mic,
  MicOff,
  Sparkles,
  Clock,
  X,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Users,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Google Calendar Icon
const GoogleCalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#4285F4" d="M18 4h-1V2h-2v2H9V2H7v2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
    <path fill="#fff" d="M6 9h12v11H6z" />
    <path fill="#EA4335" d="M11 13.5l-2-2 1-1 1 1 3-3 1 1z" />
  </svg>
);

// Gmail Icon
const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#EA4335" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" />
    <path fill="#fff" d="M4 6l8 5 8-5v2l-8 5-8-5V6z" />
  </svg>
);

// NYU Library Icon
const NYULibraryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#57068c" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Demo sample request
const DEMO_REQUEST = "I need to schedule a study session for calculus tomorrow at 3pm, reply to Professor Smith about my late assignment, and book a quiet study room at Bobst for Monday morning.";

// Generated outputs based on voice input
interface GeneratedOutputs {
  planner: {
    title: string;
    date: string;
    time: string;
    duration: string;
  } | null;
  email: {
    subject: string;
    body: string;
  } | null;
  room: {
    name: string;
    floor: string;
    time: string;
    capacity: number;
  } | null;
}

type AppState = "landing" | "recording" | "transcript" | "generating" | "dashboard";

export function WhisperFlow() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [transcript, setTranscript] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [outputs, setOutputs] = useState<GeneratedOutputs>({
    planner: null,
    email: null,
    room: null,
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate voice recording
  const handleStartRecording = useCallback(() => {
    setAppState("recording");
    setTranscript("");

    // Simulate typing effect
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < DEMO_REQUEST.length) {
        setTranscript(DEMO_REQUEST.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        timeoutRef.current = setTimeout(() => {
          setAppState("transcript");
        }, 500);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, []);

  const handleStopRecording = () => {
    setAppState("transcript");
    setTranscript(DEMO_REQUEST);
  };

  // Generate AI outputs
  const handleGenerate = async () => {
    setAppState("generating");

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOutputs({
      planner: {
        title: "Calculus Study Session",
        date: "Tomorrow",
        time: "3:00 PM",
        duration: "2 hours",
      },
      email: {
        subject: "Re: Late Assignment Submission",
        body: `Dear Professor Smith,

I hope this email finds you well. I wanted to sincerely apologize for the late submission of my assignment. I encountered some unexpected circumstances that prevented me from completing it on time.

I have now completed all the required work and submitted it through the course portal. I made sure to address all the key points mentioned in the rubric.

I understand the importance of deadlines and will ensure this does not happen again. Please let me know if there are any penalties or additional steps I need to take.

Thank you for your understanding.

Best regards,
[Your Name]`,
      },
      room: {
        name: "LL1 Group Study Room 001",
        floor: "Lower Level 1",
        time: "Monday, 9:00 AM - 11:00 AM",
        capacity: 6,
      },
    });

    setTaskTitle("Calculus Study Session");
    setAppState("dashboard");
  };

  const handleCopyEmail = async () => {
    if (outputs.email) {
      await navigator.clipboard.writeText(outputs.email.body);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleConfirmBooking = () => {
    setConfirmedBooking(true);
  };

  const handleReset = () => {
    setAppState("landing");
    setTranscript("");
    setOutputs({ planner: null, email: null, room: null });
    setCopiedEmail(false);
    setConfirmedBooking(false);
    setEditingTask(false);
  };

  const generateGoogleCalendarUrl = () => {
    if (!outputs.planner) return "#";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(15, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(17, 0, 0, 0);

    const formatDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: outputs.planner.title,
      dates: `${formatDate(tomorrow)}/${formatDate(end)}`,
      details: "Created by J.A.R.V.I.S. Student Admin AI",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateGmailUrl = () => {
    if (!outputs.email) return "#";
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      su: outputs.email.subject,
      body: outputs.email.body,
    });
    return `https://mail.google.com/mail/?${params.toString()}`;
  };

  // Landing Page
  if (appState === "landing") {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              J.A.R.V.I.S.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your AI-powered student admin assistant. Plan your studies, draft emails, and book rooms with just your voice.
            </p>
            <Button
              size="lg"
              onClick={handleStartRecording}
              className="gap-2 text-lg px-8 py-6"
            >
              <Mic className="w-5 h-5" />
              Start with Voice
            </Button>
          </div>

          {/* How it Works */}
          <div className="mt-16 w-full max-w-4xl">
            <h2 className="text-center text-lg font-semibold text-foreground mb-6">
              How it Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">1. Speak Your Request</h3>
                <p className="text-sm text-muted-foreground">
                  Tell J.A.R.V.I.S. what you need help with
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-medium mb-1">2. AI Generates Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically creates plans, emails, and bookings
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-1">3. Review and Confirm</h3>
                <p className="text-sm text-muted-foreground">
                  Edit, confirm, and sync with your favorite apps
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built by Team J.A.R.V.I.S. | NYU Hackathon 2024</p>
          </div>
        </footer>
      </div>
    );
  }

  // Recording / Transcript / Generating / Dashboard States
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold">J.A.R.V.I.S.</span>
        </button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Start Over
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Voice Transcript Section */}
          <div className="mb-8">
            {/* Floating Mic / Recording State */}
            <div className="flex flex-col items-center mb-6">
              {appState === "recording" ? (
                <>
                  <button
                    onClick={handleStopRecording}
                    className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors relative"
                  >
                    <MicOff className="w-8 h-8" />
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
                  </button>
                  <p className="mt-3 text-sm text-muted-foreground animate-pulse">
                    Listening...
                  </p>
                </>
              ) : appState === "generating" ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Generating tasks...
                  </p>
                </>
              ) : null}
            </div>

            {/* Editable Transcript Box */}
            {(transcript || appState === "transcript" || appState === "dashboard") && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    YOUR REQUEST
                  </span>
                  {appState === "transcript" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      {isEditing ? "Done" : "Edit"}
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full min-h-[80px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-foreground"
                  />
                ) : (
                  <p className="text-foreground leading-relaxed">{transcript}</p>
                )}
              </div>
            )}

            {/* Generate Button */}
            {appState === "transcript" && (
              <div className="flex justify-center mt-4">
                <Button size="lg" onClick={handleGenerate} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Tasks
                </Button>
              </div>
            )}
          </div>

          {/* Unified Dashboard - Three Cards */}
          {appState === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-center mb-6">
                Here&apos;s what I prepared for you
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Smart Planner Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Smart Planner</h3>
                  </div>
                  <div className="p-4">
                    {outputs.planner ? (
                      <div className="space-y-3">
                        {editingTask ? (
                          <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            onBlur={() => setEditingTask(false)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingTask(false)}
                            className="w-full px-2 py-1 border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{taskTitle}</h4>
                            <button
                              onClick={() => setEditingTask(true)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {outputs.planner.date}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {outputs.planner.time} ({outputs.planner.duration})
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 text-xs"
                          asChild
                        >
                          <a
                            href={generateGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GoogleCalendarIcon />
                            <span className="ml-1.5">Add to Google Calendar</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No tasks yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Draft Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-600" />
                    <h3 className="font-medium text-red-900">Email Draft</h3>
                  </div>
                  <div className="p-4">
                    {outputs.email ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Subject</p>
                          <p className="text-sm font-medium">{outputs.email.subject}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Preview</p>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {outputs.email.body.split("\n")[2]}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={handleCopyEmail}
                          >
                            {copiedEmail ? (
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
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            asChild
                          >
                            <a
                              href={generateGmailUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <GmailIcon />
                              <span className="ml-1">Gmail</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No email drafts yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Room Booking Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <h3 className="font-medium text-purple-900">Room Booking</h3>
                  </div>
                  <div className="p-4">
                    {outputs.room ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">{outputs.room.name}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            {outputs.room.floor}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {outputs.room.time}
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" />
                            Up to {outputs.room.capacity} people
                          </p>
                        </div>
                        {confirmedBooking ? (
                          <div className="flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                            <Check className="w-4 h-4" />
                            Booking Confirmed
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full mt-2 text-xs bg-purple-600 hover:bg-purple-700"
                            onClick={handleConfirmBooking}
                          >
                            <NYULibraryIcon />
                            <span className="ml-1.5">Confirm Booking</span>
                          </Button>
                        )}
                        <a
                          href="https://library.nyu.edu/spaces/bobst-group-study-rooms/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1"
                        >
                          View on NYU LibCal
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No room bookings yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <Mic className="w-4 h-4" />
                  New Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border bg-card">
        <div className="text-center text-sm text-muted-foreground">
          <p>Built by Team J.A.R.V.I.S. | NYU Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
}
