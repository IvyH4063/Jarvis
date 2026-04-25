"use client";

import { useState } from "react";
import { ChevronLeft, Search, MapPin, Users, Clock, ExternalLink, Filter, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// NYU Library Icon
const NYULibraryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#57068c" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface StudyRoomBookingProps {
  initialSearch?: string;
  onBack: () => void;
}

interface Room {
  id: string;
  name: string;
  floor: string;
  building: string;
  capacity: number;
  amenities: string[];
  availableSlots: { time: string; available: boolean }[];
  image: string;
  libCalUrl: string;
}

// NYU Bobst Library Study Rooms
const BOBST_ROOMS: Room[] = [
  {
    id: "ll1-001",
    name: "LL1 Group Study Room 001",
    floor: "Lower Level 1",
    building: "Elmer Holmes Bobst Library",
    capacity: 6,
    amenities: ["Whiteboard", "Power Outlets", "Display Screen"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: true },
    ],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
  {
    id: "ll1-002",
    name: "LL1 Group Study Room 002",
    floor: "Lower Level 1",
    building: "Elmer Holmes Bobst Library",
    capacity: 4,
    amenities: ["Whiteboard", "Power Outlets"],
    availableSlots: [
      { time: "9:00 AM", available: false },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: false },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: false },
    ],
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
  {
    id: "ll2-001",
    name: "LL2 Group Study Room 001",
    floor: "Lower Level 2",
    building: "Elmer Holmes Bobst Library",
    capacity: 8,
    amenities: ["Whiteboard", "Power Outlets", "Display Screen", "Video Conferencing"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: false },
      { time: "4:00 PM", available: true },
    ],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
  {
    id: "4f-001",
    name: "Floor 4 Study Room A",
    floor: "4th Floor",
    building: "Elmer Holmes Bobst Library",
    capacity: 6,
    amenities: ["Whiteboard", "Power Outlets", "Natural Light"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: false },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: true },
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
  {
    id: "5f-001",
    name: "Floor 5 Study Room A",
    floor: "5th Floor",
    building: "Elmer Holmes Bobst Library",
    capacity: 4,
    amenities: ["Whiteboard", "Power Outlets", "Quiet Zone"],
    availableSlots: [
      { time: "9:00 AM", available: false },
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: false },
    ],
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
  {
    id: "6f-001",
    name: "Floor 6 Study Room A",
    floor: "6th Floor",
    building: "Elmer Holmes Bobst Library",
    capacity: 10,
    amenities: ["Large Display", "Whiteboard", "Video Conferencing", "Presentation Setup"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: false },
      { time: "4:00 PM", available: true },
    ],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
    libCalUrl: "https://library.nyu.edu/spaces/bobst-group-study-rooms/",
  },
];

const FLOOR_OPTIONS = ["All", "Lower Level 1", "Lower Level 2", "4th Floor", "5th Floor", "6th Floor"];

export function StudyRoomBooking({ initialSearch, onBack }: StudyRoomBookingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFloor, setFilterFloor] = useState<string>("All");

  // Show all rooms by default, only filter when user types in search
  const filteredRooms = BOBST_ROOMS.filter((room) => {
    const matchesSearch =
      searchQuery === "" ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFloor = filterFloor === "All" || room.floor === filterFloor;
    return matchesSearch && matchesFloor;
  });

  const getAvailableCount = (room: Room) => {
    return room.availableSlots.filter((s) => s.available).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 bg-card">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <NYULibraryIcon />
            <h1 className="text-xl font-semibold">NYU Bobst Library - Study Rooms</h1>
          </div>
        </div>
      </header>

      {/* LibCal Notice */}
      <div className="px-4 py-2 bg-purple-50 border-b border-purple-100">
        <p className="text-xs text-purple-800 text-center">
          Room bookings are managed through NYU LibCal. Click &quot;Book on LibCal&quot; to reserve with your NYU NetID.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-border px-4 py-4 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms or amenities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Floor:</span>
            {FLOOR_OPTIONS.map((floor) => (
              <button
                key={floor}
                onClick={() => setFilterFloor(floor)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap",
                  filterFloor === floor
                    ? "bg-purple-600 text-white"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto">
          {/* Voice Command Context */}
          {initialSearch && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Your request:</span> {initialSearch}
              </p>
              <p className="text-sm text-purple-700 mt-1">Here are the available Bobst Library study rooms:</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available at Bobst Library
            </p>
            <a
              href="https://library.nyu.edu/spaces/bobst-group-study-rooms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              View all on LibCal
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple-300 transition-colors"
              >
                <div className="flex">
                  {/* Room Image */}
                  <div className="w-32 h-44 flex-shrink-0 relative">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600 text-white text-xs font-medium rounded">
                      NYU
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{room.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {room.floor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Up to {room.capacity}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {getAvailableCount(room)} slots
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 text-xs bg-muted rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Available Times Preview */}
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Available today
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {room.availableSlots
                          .filter((slot) => slot.available)
                          .slice(0, 4)
                          .map((slot) => (
                            <span
                              key={slot.time}
                              className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded"
                            >
                              {slot.time}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="mt-3">
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        asChild
                      >
                        <a
                          href={room.libCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <NYULibraryIcon />
                          <span className="ml-1.5">Book on LibCal</span>
                          <ExternalLink className="w-3 h-3 ml-1.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No rooms found matching your search.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setFilterFloor("All");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 bg-card">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>Elmer Holmes Bobst Library, 70 Washington Square S, New York, NY 10012</span>
          <a
            href="https://library.nyu.edu/spaces/bobst-group-study-rooms/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            NYU Library Website
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
