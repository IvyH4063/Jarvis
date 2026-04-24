"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudyPlannerProps {
  initialTask?: string;
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  startHour: number;
  duration: number;
  color: string;
}

const COLORS = [
  "bg-blue-500/20 border-blue-500 text-blue-700",
  "bg-teal-500/20 border-teal-500 text-teal-700",
  "bg-amber-500/20 border-amber-500 text-amber-700",
  "bg-rose-500/20 border-rose-500 text-rose-700",
  "bg-violet-500/20 border-violet-500 text-violet-700",
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

export function StudyPlanner({ initialTask, onBack }: StudyPlannerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(() => {
    const today = new Date();
    const baseEvents: Event[] = [
      {
        id: "1",
        title: "Math Review",
        date: today,
        startHour: 9,
        duration: 2,
        color: COLORS[0],
      },
      {
        id: "2",
        title: "Physics Lab Report",
        date: today,
        startHour: 14,
        duration: 1.5,
        color: COLORS[1],
      },
      {
        id: "3",
        title: "Literature Essay",
        date: new Date(today.getTime() + 86400000),
        startHour: 10,
        duration: 2,
        color: COLORS[2],
      },
    ];

    // Add initial task if provided
    if (initialTask) {
      baseEvents.push({
        id: "voice-task",
        title: initialTask,
        date: new Date(today.getTime() + 86400000),
        startHour: 15,
        duration: 1,
        color: COLORS[3],
      });
    }

    return baseEvents;
  });

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const addQuickEvent = (date: Date, hour: number) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: "New Study Session",
      date: date,
      startHour: hour,
      duration: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Study Planner</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {formatMonth(currentDate)}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-card">
          <div className="p-2" />
          {weekDays.map((date, i) => (
            <div
              key={i}
              className={cn(
                "p-2 text-center border-l border-border",
                isToday(date) && "bg-primary/5"
              )}
            >
              <div className="text-xs text-muted-foreground">{dayNames[i]}</div>
              <div
                className={cn(
                  "text-lg font-medium mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                  isToday(date) && "bg-primary text-primary-foreground"
                )}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                {/* Time Label */}
                <div className="h-16 border-b border-border pr-2 text-right">
                  <span className="text-xs text-muted-foreground -mt-2 block">
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
                {/* Day Columns */}
                {weekDays.map((date, dayIndex) => (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={cn(
                      "h-16 border-b border-l border-border relative group cursor-pointer hover:bg-muted/50 transition-colors",
                      isToday(date) && "bg-primary/5"
                    )}
                    onClick={() => addQuickEvent(date, hour)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Events Overlay */}
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDay(date);
              return dayEvents.map((event) => {
                const top = (event.startHour - 7) * 64;
                const height = event.duration * 64;
                const left = `calc(60px + ${(dayIndex * 100) / 7}% + 2px)`;
                const width = `calc(${100 / 7}% - 4px)`;

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "absolute rounded-md border-l-4 px-2 py-1 overflow-hidden group/event",
                      event.color
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left,
                      width,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{event.title}</p>
                        <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {event.startHour > 12 ? event.startHour - 12 : event.startHour}
                          {event.startHour >= 12 ? " PM" : " AM"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEvent(event.id);
                        }}
                        className="opacity-0 group-hover/event:opacity-100 transition-opacity p-0.5 hover:bg-foreground/10 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
