"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogOut, Plus, LayoutDashboard, Calendar, IndianRupee, X, Image as ImageIcon, Loader2 } from 'lucide-react';
// NextAuth hook for session management (assuming Next.js environment)
import { useSession, signOut } from 'next-auth/react'; 
import { useRouter } from "next/navigation";


// --- Interface Definitions ---

interface Monastery {
  _id: string;
  name: string;
}

interface ImagePreview {
    file: File;
    url: string; // Local URL for preview
}

interface EventFormData {
  monasteryId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  highlights: string;
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
}

// Separate state for images to manage File objects and URLs
interface EventFormState extends EventFormData {
    images: ImagePreview[]; 
}

interface EventCard {
  id: string;
  eventName: string;
  monasteryName: string;
  startDate: string;
  endDate: string;
  bookingAvailable: boolean;
  ticketPrice: number;
}

// --- Component Start ---

const MAX_IMAGES = 4;

const MonasteryEventDashboard = () => {
  const { data: session, status } = useSession();
  const userSession = session;
  const isLoadingSession = status === 'loading';

  const [activeView, setActiveView] = useState<'dashboard' | 'list-events'>('dashboard');
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [isLoadingMonasteries, setIsLoadingMonasteries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchEventsError, setFetchEventsError] = useState<string | null>(null);
  const router=useRouter();
  const initialFormData: EventFormState = {
    monasteryId: '',
    eventName: '',
    startDate: '',
    endDate: '',
    time: '',
    duration: '',
    location: '',
    description: '',
    highlights: '',
    images: [], 
    bookingAvailable: true,
    ticketPrice: 0,
    totaltickets: 0,
  };
  const [formData, setFormData] = useState<EventFormState>(initialFormData);

  // Ref for file input to allow manual triggering/clearing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API Functions ---

  const fetchMonasteries = useCallback(async () => {
    setIsLoadingMonasteries(true);

    try {
      // API call to fetch actual monastery data
      const res = await fetch("/api/get-monastery", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch monasteries");
      }

      const data: { monasteries: Monastery[] } = await res.json();
      setMonasteries(data.monasteries || []);
    } catch (error) {
      console.error("Error fetching monasteries:", error);
    } finally {
      setIsLoadingMonasteries(false);
    }
  }, []); // Empty dependency array means it runs once

  const fetchEvents = useCallback(async () => {
  setFetchEventsError(null);

  try {
    const res = await fetch("/api/events/get-events", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();

    // Safely extract events array
    const eventsArray = Array.isArray(data?.events) ? data.events : [];

    setEvents(eventsArray);

  } catch (error) {
    console.error("Error fetching events:", error);
    setFetchEventsError("Could not load events. Please try again.");
  }
}, []);


  const createEvent = async (state: EventFormState): Promise<EventCard | null> => {
    setIsSubmitting(true);

    try {
      // 1. Prepare FormData for file upload
      const formPayload = new FormData();

      // Append text fields
      Object.keys(state).forEach(key => {
        if (key !== 'images') {
          formPayload.append(key, String(state[key as keyof EventFormData]));
        }
      });

      // Append image files
      state.images.forEach((img, index) => {
        formPayload.append(`images`, img.file);
      });

      console.log("📤 Sending POST → /api/create-event with FormData");

      // 2. Send the request
      const res = await fetch("/api/create-event", {
        method: "POST",
        // Do NOT set Content-Type header when using FormData for file uploads.
        // The browser sets it automatically, including the boundary.
        body: formPayload, 
      });

      const json = await res.json();
      console.log("📥 Response from /api/create-event:", json);

      if (!res.ok || !json.success) {
        console.error("❌ Failed to create event:", json);
        alert(json.message || "Event creation failed.");
        return null;
      }

      // 3. Convert backend response to UI-friendly event card
      const newEvent: EventCard = {
        id: json.event._id,
        eventName: json.event.eventName,
        monasteryName:
          monasteries.find((m) => m._id === json.event.monasteryId)?.name ||
          "Unknown Monastery",
        startDate: json.event.startDate.substring(0, 10), // Clean up date format
        endDate: json.event.endDate.substring(0, 10),
        bookingAvailable: json.event.bookingAvailable,
        ticketPrice: json.event.ticketPrice,
      };

      // 4. Update state
      setEvents((prev) => [...prev, newEvent]);

      return newEvent;
    } catch (error) {
      console.error("🔥 Error creating event:", error);
      alert("Failed to create event. See console.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Effects and Handlers ---

  useEffect(() => {
    fetchMonasteries();
    fetchEvents();
  }, [fetchMonasteries, fetchEvents]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // For number inputs, ensure value is converted to a float, defaulting to 0
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || 0 : value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = [];

    const currentCount = formData.images.length;
    const remainingSlots = MAX_IMAGES - currentCount;
    
    // Process new files, creating previews and storing the File object
    files.slice(0, remainingSlots).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newImages.push({ file, url: previewUrl });
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset file input to allow selecting the same file again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = formData.images[indexToRemove];
    
    // Revoke the object URL to free up memory (best practice)
    if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
    }
    
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdEvent = await createEvent(formData);

    if (createdEvent) {
      // Revoke all current preview URLs before clearing state
      formData.images.forEach(img => URL.revokeObjectURL(img.url));
      
      // Clear form only on successful creation
      setFormData(initialFormData);
      setActiveView('dashboard'); // Switch to dashboard view after successful creation
    }
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
  const bookingsOpen = events.filter((e) => e.bookingAvailable).length;

  // --- Loading/Error/Auth Guards ---

  if (isLoadingSession) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-yellow-600" size={32} />
            <p className="ml-3 text-lg text-gray-700">Loading Session...</p>
        </div>
    );
  }

  if (!userSession) {
    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You must be logged in to view the dashboard.</p>
            <button
                onClick={() => router.push("/")} 
                className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition"
            >
                Go to Sign In
            </button>
        </div>
    );
  }

  // --- Component JSX ---
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-wider">
            <span className="text-yellow-600">Monastery</span>360
          </h1>
          <p className="text-xs text-gray-500 mt-1">Event Partner Console</p>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src={userSession.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${userSession.user?.name || 'User'}`}
              alt={userSession.user?.name || 'User'}
              className="w-12 h-12 rounded-full ring-2 ring-yellow-400 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {userSession.user?.name || 'Partner'}
              </p>
              <p className="text-xs text-yellow-600 font-medium truncate">Verified Event Partner</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 truncate">{userSession.user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'dashboard'
                ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('list-events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'list-events'
                ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar size={20} />
            <span>List your Event</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeView === 'dashboard' ? (
          <>
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800">👋 Welcome, {userSession.user?.name?.split(' ')[0]}</h2>
              <p className="text-gray-500 mt-2">Manage your monastery events and track performance at a glance.</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Total Events</p>
                <p className="text-4xl font-bold text-gray-800">{totalEvents}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Upcoming Events</p>
                <p className="text-4xl font-bold text-blue-600">{upcomingEvents}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Bookings Open</p>
                <p className="text-4xl font-bold text-green-600">
                  {bookingsOpen}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-400">
                <p className="text-gray-500 text-sm mb-2 font-medium">Past Events</p>
                <p className="text-4xl font-bold text-gray-800">{totalEvents - upcomingEvents}</p>
              </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Current Events List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Calendar size={24} className="text-yellow-600" />
                <span>My Current Events</span>
              </h3>
              
              {fetchEventsError && (
                  <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4 rounded">
                      Error: {fetchEventsError}
                  </div>
              )}

              <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <p>No events found. Start by listing a new event!</p>
                        <button 
                            onClick={() => setActiveView('list-events')}
                            className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold flex items-center mx-auto"
                        >
                            <Plus size={18} className="mr-1" /> List Event
                        </button>
                    </div>
                ) : (
                    events.map((event) => (
                      <div key={event.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-sm transition duration-150">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-extrabold text-lg text-gray-800">{event.eventName}</h4>
                            <p className="text-sm text-yellow-600 mt-1">{event.monasteryName}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              🗓️ **{event.startDate}** to **{event.endDate}**
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                event.bookingAvailable
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {event.bookingAvailable ? 'Bookings Open' : 'Closed'}
                              </span>
                              {event.ticketPrice > 0 && (
                                <span className="text-sm font-bold text-indigo-600 flex items-center mt-1">
                                    <IndianRupee size={12} />{event.ticketPrice}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800">List Your Event ✨</h2>
              <p className="text-gray-500 mt-2">Complete the form below to publish your event.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Plus size={24} className="text-yellow-600" />
                <span>New Event Details</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Monastery & Event Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Monastery Select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Monastery</label>
                        <div className="relative">
                            <select
                                name="monasteryId"
                                value={formData.monasteryId}
                                onChange={handleInputChange}
                                disabled={isLoadingMonasteries || isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                required
                            >
                                <option value="">{isLoadingMonasteries ? 'Loading...' : 'Choose monastery'}</option>
                                {monasteries.map((m) => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                            <Loader2 size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isLoadingMonasteries ? 'animate-spin' : 'hidden'}`} />
                        </div>
                    </div>

                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
                        <input
                            type="text"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="e.g., Losar Festival 2025"
                            required
                        />
                    </div>
                </div>

                {/* Row 2: Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            required
                        />
                    </div>
                </div>

                {/* Row 3: Time, Duration, Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (e.g., 2 hours)</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Duration"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Event location"
                        />
                    </div>
                </div>

                {/* Row 4: Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="A detailed description of the event"
                        rows={3}
                    />
                </div>
                
                {/* Row 5: Highlights */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Highlights (Key points)</label>
                    <input
                        type="text"
                        name="highlights"
                        value={formData.highlights}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="Key highlights"
                    />
                </div>

                {/* Row 6: Tickets & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Price (₹)</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Price"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Tickets</label>
                        <input
                            type="number"
                            name="totaltickets"
                            value={formData.totaltickets}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Count"
                            min="0"
                        />
                    </div>
                </div>

                {/* Row 7: Images and Booking Toggle */}
                <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Images (Max {MAX_IMAGES})</label>
                    
                    {/* Image Upload Input (Hidden) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                        disabled={formData.images.length >= MAX_IMAGES || isSubmitting}
                    />
                    
                    {/* Image Previews and Add Button */}
                    <div className="flex flex-wrap items-center gap-4">
                        
                        {/* Add Image Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={formData.images.length >= MAX_IMAGES || isSubmitting}
                            className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition duration-200 ${
                                formData.images.length >= MAX_IMAGES
                                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                    : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                            }`}
                        >
                            <ImageIcon size={24} />
                            <span className="text-xs mt-1">Add Image</span>
                        </button>

                        {/* Image Previews */}
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group">
                                <img
                                    src={img.url}
                                    alt={`Event Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl-lg opacity-0 group-hover:opacity-100 transition duration-150"
                                    aria-label="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Booking Available Checkbox */}
                    <div className="flex items-center space-x-2 pt-6">
                        <input
                            type="checkbox"
                            name="bookingAvailable"
                            checked={formData.bookingAvailable}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <label className="text-sm font-semibold text-gray-700">
                            Bookings Available (Mark as live/open for booking)
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-200 shadow-md hover:shadow-lg mt-6 flex items-center justify-center disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Publishing Event...
                        </>
                    ) : 'Publish Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonasteryEventDashboard;