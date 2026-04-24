"use client";

import { useState } from "react";
import { ChevronLeft, Search, MapPin, Users, Clock, Check, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudyRoomBookingProps {
  initialSearch?: string;
  onBack: () => void;
}

interface Room {
  id: string;
  name: string;
  floor: number;
  building: string;
  capacity: number;
  amenities: string[];
  availableSlots: { time: string; available: boolean }[];
  rating: number;
  image: string;
}

const ROOMS: Room[] = [
  {
    id: "1",
    name: "Quiet Study Room A",
    floor: 3,
    building: "Main Library",
    capacity: 4,
    amenities: ["Whiteboard", "Power Outlets", "Natural Light"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: true },
    ],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Group Study Room B",
    floor: 2,
    building: "Main Library",
    capacity: 8,
    amenities: ["Projector", "Whiteboard", "Video Conferencing"],
    availableSlots: [
      { time: "9:00 AM", available: false },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: false },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: true },
    ],
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Silent Study Pod",
    floor: 3,
    building: "Science Building",
    capacity: 1,
    amenities: ["Soundproof", "Standing Desk", "Monitor"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: false },
    ],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Collaboration Space",
    floor: 1,
    building: "Student Center",
    capacity: 12,
    amenities: ["Large Screen", "Flexible Seating", "Coffee Machine"],
    availableSlots: [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "1:00 PM", available: false },
      { time: "2:00 PM", available: false },
      { time: "3:00 PM", available: true },
    ],
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop",
  },
];

export function StudyRoomBooking({ initialSearch, onBack }: StudyRoomBookingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; time: string } | null>(null);
  const [bookedSlots, setBookedSlots] = useState<{ roomId: string; time: string }[]>([]);
  const [filterFloor, setFilterFloor] = useState<number | null>(null);

  // Show all rooms by default, only filter when user types in search
  const filteredRooms = ROOMS.filter((room) => {
    const matchesSearch =
      searchQuery === "" ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFloor = filterFloor === null || room.floor === filterFloor;
    return matchesSearch && matchesFloor;
  });

  const handleBookRoom = () => {
    if (selectedSlot) {
      setBookedSlots([...bookedSlots, selectedSlot]);
      setSelectedSlot(null);
    }
  };

  const isSlotBooked = (roomId: string, time: string) => {
    return bookedSlots.some((slot) => slot.roomId === roomId && slot.time === time);
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
          <h1 className="text-xl font-semibold">Study Room Booking</h1>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="border-b border-border px-4 py-4 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms, buildings, or amenities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Floor:</span>
            {[null, 1, 2, 3].map((floor) => (
              <button
                key={floor ?? "all"}
                onClick={() => setFilterFloor(floor)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors",
                  filterFloor === floor
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {floor === null ? "All" : `${floor}F`}
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
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Your request:</span> {initialSearch}
              </p>
              <p className="text-sm text-primary mt-1">Here are the available study rooms for you to book:</p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden transition-all",
                  selectedRoom === room.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                )}
              >
                <div className="flex">
                  {/* Room Image */}
                  <div className="w-32 h-40 flex-shrink-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {room.building}, Floor {room.floor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.capacity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{room.rating}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 text-xs bg-muted rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Time Slots */}
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Available times
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {room.availableSlots.map((slot) => {
                          const isBooked = isSlotBooked(room.id, slot.time);
                          const isSelected =
                            selectedSlot?.roomId === room.id && selectedSlot?.time === slot.time;

                          return (
                            <button
                              key={slot.time}
                              disabled={!slot.available || isBooked}
                              onClick={() => {
                                setSelectedRoom(room.id);
                                setSelectedSlot({ roomId: room.id, time: slot.time });
                              }}
                              className={cn(
                                "px-2.5 py-1 text-xs rounded-md transition-colors",
                                isBooked
                                  ? "bg-green-100 text-green-700 cursor-default"
                                  : isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : slot.available
                                  ? "bg-muted hover:bg-muted/80"
                                  : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                              )}
                            >
                              {isBooked ? (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {slot.time}
                                </span>
                              ) : (
                                slot.time
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Bar */}
      {selectedSlot && (
        <div className="border-t border-border px-4 py-4 bg-card">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected:</p>
              <p className="font-medium">
                {ROOMS.find((r) => r.id === selectedSlot.roomId)?.name} at {selectedSlot.time}
              </p>
            </div>
            <Button onClick={handleBookRoom}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
