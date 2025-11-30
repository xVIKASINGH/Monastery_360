"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Users, Heart, Share2, ChevronLeft, ChevronRight, Star, Loader2, Wifi, Utensils, Wind, Droplet } from 'lucide-react';
import MonasteryAerialPage from '@/app/map-testing/page';
import { useRouter } from 'next/navigation';
type Location = string | { lat: number; long: number; address: string };
interface IMonasteryEvent {
  _id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: {
    lat: number;
    lng: number;
  };
  foundedYear: number;
  description: string;
  highlights: string;
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
  bookedTickets: number;
}
interface IEvent {
  _id: string;
  monasteryId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  highlights: string;
  images: string[];
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
  bookedTickets: number;
  createdAt: string;
  updatedAt: string;
}
interface IMonasteryData {
  _id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  altitude: string;
  foundedYear: number;
  rating: number;
  reviews: number;
  guestFavorite: boolean;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  nearbyAttractions: string[];
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
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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
        console.log("Monastry That i fetched:", data);
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

  useEffect(() => {
    if (!monasteryId) return;

    const fetchEvents = async () => {
      setEventsLoading(true);

      try {
        const res = await fetch(`/api/events/event-by-monastries/${monasteryId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch events. Status: ${res.status}`);
        }
        const data = await res.json();
        const eventsList: IEvent[] = data.events || [];
        setEvents(eventsList);
        if (eventsList.length > 0) {
          setSelectedEventId(eventsList[0]._id);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [monasteryId]);
  const handleLikeToggle = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState); // optimistic UI

    try {
      const res = await fetch("/api/liked-monastery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monasteryId,
          liked: newLikedState,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update like status");
      }

      console.log("Like updated:", await res.json());
    } catch (err) {
      console.error("Error updating like:", err);
      setLiked(!newLikedState); // revert UI on failure
    }
  };

  console.log(events);


  const getLocationString = (location: Location): string => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null && 'address' in location) return location.address;
    return 'Location details unavailable';
  };

  const getSelectedEvent = (): IEvent | null => {
    return events.find(e => e._id === selectedEventId) || null;
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
  const locationString = getLocationString(monastery.location);
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % monastery.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + monastery.images.length) % monastery.images.length);
  const selectedEvent = getSelectedEvent();
  const router = useRouter();
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
            <button onClick={handleLikeToggle} className="p-3 hover:bg-gray-100 rounded-full transition">
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-red-500' : 'text-gray-900'} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-2 h-96 mb-4 rounded-xl overflow-hidden">
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

        <div className="flex gap-2">
          {monastery.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-20 h-20 overflow-hidden border-2 transition ${idx === currentImageIndex ? "border-gray-900" : "border-gray-300"
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

          {/* Aerial map */}
          <MonasteryAerialPage
            name={monastery.name}
            description={monastery.description}
            lat={monastery.location.lat}
            lng={monastery.location.lng}
            foundedYear={monastery.foundedYear}
            altitude={monastery.altitude}
            nearbyAttractions={["Gangtok City", "Ranka Monastery", "Ban Jhakri Falls"]}
            rating={4.92}
            reviewsCount={128}
            locationText="sikkim"
          />

          {/* Amenities */}
          {/* <div className="mb-12 pb-8 border-b border-gray-200">
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
          </div> */}
          {console.log(events)}
          {/* Upcoming Events & Festivals */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Events & Festivals</h2>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-900" size={24} />
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event._id} className="rounded-lg cursor-pointer overflow-hidden border border-gray-200 hover:shadow-lg transition">
                    {event.images && event.images.length > 0 ? (
                      <div 
                      // onClick={() => {
                      //   console.log(event._id);
                      //   console.log(event);
                      //   return router.push(`/events`)
                      // }} 
                      onClick={() => router.push(`/events/${event._id}`)}
                      className="w-full h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={event.images[0]}
                          alt={event.eventName}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No image available</span>
                      </div>
                    )}
                    <div className="p-3"

                    >
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{event.eventName}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar size={14} />
                        <span>{event.startDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No upcoming events available</p>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="col-span-1">
          <div className="border border-gray-300 rounded-xl p-6 sticky top-24 shadow-md">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select an Event:</h3>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-gray-900" size={20} />
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event._id}
                      onClick={() => setSelectedEventId(event._id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedEventId === event._id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1">{event.eventName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                        <Calendar size={12} />
                        <span>{event.startDate}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No events available</p>
              )}
            </div>

            {selectedEvent && (
              <>
                <div className="mb-4 text-center bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    🌟 Participate in {selectedEvent.eventName}!
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">₹{selectedEvent.ticketPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600">per ticket</p>
                </div>

                <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition mb-4">
                  Be a part of Event
                </button>

                <div className="mb-6 pb-6 border-b border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Ticket Price</span>
                    <span className="text-gray-900">₹{selectedEvent.ticketPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Taxes & fees</span>
                    <span className="text-gray-900">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Available Tickets</span>
                    <span className="text-gray-900">{selectedEvent.totaltickets - selectedEvent.bookedTickets}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{selectedEvent.ticketPrice}</span>
                </div>

                <p className="text-xs text-gray-600 text-center">💎 Prices include all fees</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}