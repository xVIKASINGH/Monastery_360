"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Users, Heart, Share2, ChevronLeft, ChevronRight, Star, Loader2, Wifi, Utensils, Wind, Droplet } from 'lucide-react';

type Location = string | { lat: number; long: number; address: string };

interface IMonasteryEvent {
  _id: string;
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
  bookedTickets: number;
}

interface IMonasteryData {
  _id: string;
  name: string;
  location: Location;
  rating: number;
  reviews: number;
  guestFavorite: boolean;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: string[];
  price: number;
  originalPrice: number;
  perNight: string;
  amenities: string[] | null;
  events: IMonasteryEvent[] | null;
}

export default function MonasteryDetail() {
  const params = useParams();
  const monasteryId = (params?.id as string | null | undefined) ?? null;

  const [monastery, setMonastery] = useState<IMonasteryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!monasteryId) {
      setIsLoading(false);
      return;
    }

    const fetchMonastery = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/monastries/${monasteryId}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error(`Monastery with ID ${monasteryId} not found.`);
          throw new Error(`Failed to fetch monastery details. Status: ${res.status}`);
        }

        const data: IMonasteryData = await res.json();
        setMonastery(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error while fetching data.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonastery();
  }, [monasteryId]);

  const getLocationString = (location: Location): string => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null && 'address' in location) return location.address;
    return 'Location details unavailable';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-gray-900 mr-3" size={32} />
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 text-red-700 p-8">
        <p className="text-lg font-semibold">🛑 Error: {error}</p>
      </div>
    );
  }

  if (!monastery) {
    return null;
  }

  const amenities = monastery.amenities ?? [];
  const events = monastery.events ?? [];
  const locationString = getLocationString(monastery.location);
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % monastery.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + monastery.images.length) % monastery.images.length);
  const availableTickets = (event: IMonasteryEvent) => event.totaltickets - event.bookedTickets;

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Sosa Homestays</h1>
          <div className="flex gap-2">
            <button className="p-3 hover:bg-gray-100 rounded-full transition">
              <Share2 size={20} className="text-gray-900" />
            </button>
            <button onClick={() => setLiked(!liked)} className="p-3 hover:bg-gray-100 rounded-full transition">
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-red-500' : 'text-gray-900'} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
   <section className="max-w-7xl mx-auto px-6 py-6">
  {/* Outer container applies rounding */}
  <div className="grid grid-cols-3 gap-2 h-96 mb-4 rounded-xl overflow-hidden">
    
    {/* Main Image (NO rounded here) */}
    <div className="col-span-2 row-span-2 relative group bg-gray-200 cursor-pointer">
      <img
        src={monastery.images[currentImageIndex]}
        alt="Monastery"
        className="w-full h-full object-cover"
      />

      <button
        onClick={prevImage}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-3 right-3 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-semibold transition"
      >
        Show all photos
      </button>
    </div>

    {/* Side Images (NO rounded here) */}
    {monastery.images.slice(1, 3).map((img, idx) => (
      <div
        key={idx}
        className="relative bg-gray-200 overflow-hidden cursor-pointer group"
      >
        <img
          src={img}
          alt={`Gallery ${idx + 2}`}
          className="w-full h-full object-cover group-hover:opacity-80 transition"
          onClick={() => setCurrentImageIndex(idx + 1)}
        />
      </div>
    ))}

  </div>

  {/* Thumbnails remain same */}
  <div className="flex gap-2">
    {monastery.images.map((img, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentImageIndex(idx)}
        className={`w-20 h-20 overflow-hidden border-2 transition ${
          idx === currentImageIndex ? "border-gray-900" : "border-gray-300"
        } rounded-lg`}
      >
        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
      </button>
    ))}
  </div>
</section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-12">
        <div className="col-span-2">
          {/* Title & Rating */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">{monastery.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="fill-gray-900 text-gray-900" />
                <span className="font-semibold text-gray-900">{monastery.rating}</span>
                <span className="text-gray-600">({monastery.reviews} reviews)</span>
              </div>
              {monastery.guestFavorite && <span className="text-sm text-gray-700">⭐ Guest favorite</span>}
            </div>
          </div>

          {/* Details */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-lg font-semibold text-gray-900">{monastery.guests}</div>
                <div className="text-sm text-gray-600">guests</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{monastery.bedrooms}</div>
                <div className="text-sm text-gray-600">bedrooms</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{monastery.beds}</div>
                <div className="text-sm text-gray-600">beds</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{monastery.bathrooms}</div>
                <div className="text-sm text-gray-600">bathrooms</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-900 mt-1 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Location</div>
                <div className="text-gray-600">{locationString}</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this monastery</h2>
            <p className="text-gray-700 leading-relaxed text-base">{monastery.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What this place offers</h2>
            <div className="grid grid-cols-2 gap-6">
              {amenities.map((amenity, idx) => {
                const icons: Record<string, React.ReactNode> = {
                  'WiFi': <Wifi size={20} />,
                  'Kitchen': <Utensils size={20} />,
                  'Air Conditioning': <Wind size={20} />,
                  'Heating': <Droplet size={20} />,
                };
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="text-gray-900">{icons[amenity] || <div className="w-5 h-5 bg-gray-300 rounded" />}</div>
                    <span className="text-gray-900">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Events & Activities</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedEvent(event._id === selectedEvent ? null : event._id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">₹{event.ticketPrice}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {event.startDate} • {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {event.location}
                    </div>
                  </div>

                  {selectedEvent === event._id && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border-t border-gray-200 mt-4 pt-4">
                      <p className="text-sm text-gray-700 mb-4"><strong>Highlights:</strong> {event.highlights}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-700">{availableTickets(event)} of {event.totaltickets} tickets available</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900" style={{ width: `${(event.bookedTickets / event.totaltickets) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                      availableTickets(event) > 0
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={availableTickets(event) <= 0}
                  >
                    {availableTickets(event) > 0 ? 'Book Now' : 'Sold Out'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
       <div className="col-span-1">
  <div className="border border-gray-300 rounded-xl p-6 sticky top-24 shadow-md">
    
    {/* Event message */}
    <div className="mb-4 text-center bg-gray-100 p-3 rounded-lg">
      <p className="text-sm font-medium text-gray-800">
        🌟 Do participate in this event for this monastery!
      </p>
    </div>

    <div className="mb-6">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-gray-900">₹{monastery.price}</span>
        <span className="text-lg text-gray-600 line-through">₹{monastery.originalPrice}</span>
      </div>
      <p className="text-sm text-gray-600">{monastery.perNight}</p>
    </div>

    <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition mb-4">
      Be a part of Event
    </button>

    <div className="mb-6 pb-6 border-b border-gray-200 space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-700">Base price</span>
        <span className="text-gray-900">₹7,200</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-700">Taxes & fees</span>
        <span className="text-gray-900">₹281</span>
      </div>
    </div>

    <div className="flex justify-between font-semibold text-gray-900 mb-6">
      <span>Total</span>
      <span>₹{monastery.price}</span>
    </div>

    <p className="text-xs text-gray-600 text-center">💎 Prices include all fees</p>
  </div>
</div>

      </section>
    </div>
  );
}