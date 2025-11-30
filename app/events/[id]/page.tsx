"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EventDetail = {
  _id: string;
  monasteryId: string;
  eventName: string;
  category: string;
  startDate: string;
  endDate?: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  images: string[];
  bookingAvailable?: boolean;
  ticketPrice?: number;
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to fetch event data");
        const data = await res.json();
        setEvent(data);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    // <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl my-12">
    //   <button
    //     className="mb-6 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition"
    //     onClick={() => router.back()}
    //   >
    //     ← Back to Events
    //   </button>

    //   {/* Header Section */}
    //   <div className="mb-8">
    //     <h1 className="text-4xl font-extrabold text-indigo-900 mb-3">
    //       {event.eventName}
    //     </h1>

    //     <span className="inline-block px-4 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700 capitalize">
    //       {event.category}
    //     </span>
    //   </div>

    //   {/* Event Info Grid */}
    //   <div className="grid md:grid-cols-2 gap-6 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
    //     <div className="space-y-2 text-gray-800">
    //       <p><strong className="text-indigo-700">Start Date:</strong> {event.startDate}</p>
    //       <p><strong className="text-indigo-700">End Date:</strong> {event.endDate}</p>
    //       <p><strong className="text-indigo-700">Time:</strong> {event.time}</p>
    //       <p><strong className="text-indigo-700">Duration:</strong> {event.duration}</p>
    //       <p><strong className="text-indigo-700">Location:</strong> {event.location}</p>
    //       <p><strong className="text-indigo-700">Ticket Price:</strong> ₹{event.ticketPrice}</p>
    //     </div>

    //     <div>
    //       <p className="font-semibold text-indigo-700 mb-2">Booking Status</p>
    //       <div
    //         className={`px-4 py-2 rounded-lg text-white text-center font-semibold ${event.bookingAvailable ? "bg-green-600" : "bg-red-600"
    //           }`}
    //       >
    //         {event.bookingAvailable ? "Booking Available" : "Not Available"}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Image */}
    //   <div className="mb-8">
    //     <img
    //       src={event.images[selectedImageIndex]}
    //       alt="Main Image"
    //       className="w-full max-h-[480px] object-cover rounded-xl shadow-lg border"
    //     />
    //   </div>

    //   {/* Thumbnails */}
    //   <div className="flex space-x-4 overflow-x-auto mb-10 pb-3">
    //     {event.images.map((img, i) => (
    //       <img
    //         key={i}
    //         src={img}
    //         onClick={() => setSelectedImageIndex(i)}
    //         className={`w-28 h-20 object-cover rounded-lg cursor-pointer shadow-md transition ${selectedImageIndex === i
    //             ? "ring-4 ring-indigo-600 scale-105"
    //             : "opacity-80 hover:opacity-100"
    //           }`}
    //       />
    //     ))}
    //   </div>

    //   {/* Description */}
    //   <p className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-gray-700 leading-relaxed mb-10">
    //     {event.description}
    //   </p>

    //   {/* Highlights */}
    //   <div className="mb-10">
    //     <h2 className="text-2xl font-bold text-indigo-900 mb-4">✨ Highlights</h2>
    //     <ul className="list-disc ml-6 space-y-2 text-gray-700">
    //       {event.highlights?.map((point, i) => (
    //         <li key={i}>{point}</li>
    //       ))}
    //     </ul>
    //   </div>

    //   {event.bookingAvailable && (
    //     <button className="px-8 py-3 w-full md:w-auto bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
    //       Book Tickets
    //     </button>
    //   )}
    // </div>
    <div className="min-h-screen bg-gray-100">
      {/* HERO BANNER */}
      <div className="relative h-[420px] w-full">
        <img
          src={event.images[selectedImageIndex]}
          className="w-full h-full object-cover"
          alt={event.eventName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Title */}
        <div className="absolute bottom-6 left-6 text-white">
          <button
            className="text-sm mb-4 flex items-center gap-2 hover:underline"
            onClick={() => router.back()}
          >
            ← Back to Events
          </button>

          <h1 className="text-5xl font-extrabold drop-shadow-lg">{event.eventName}</h1>
          <span className="mt-3 inline-block px-4 py-1 text-sm rounded-full bg-white/25 backdrop-blur-md border border-white/50">
            {event.category}
          </span>
        </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 p-8 -mt-20 relative z-10">

        {/* LEFT SECTION - DETAILS */}
        <div className="md:col-span-2 space-y-8">

          {/* INFO CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Information</h2>

            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p><strong>📅 Start:</strong> {event.startDate}</p>
              <p><strong>📅 End:</strong> {event.endDate}</p>
              <p><strong>⏳ Duration:</strong> {event.duration}</p>
              <p><strong>⏰ Time:</strong> {event.time}</p>
              <p><strong>📍 Location:</strong> {event.location}</p>
              <p><strong>💵 Ticket Price:</strong> ₹{event.ticketPrice}</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl shadow-lg p-6 leading-relaxed text-gray-700 border border-gray-200">
            {event.description}
          </div>

          {/* HIGHLIGHTS */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Highlights</h2>
            <ul className="space-y-2 list-disc ml-6 text-gray-700">
              {event.highlights?.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          {event.bookingAvailable && (
            <button className="px-10 py-4 text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl hover:scale-105 transition">
              Book Tickets Now
            </button>
          )}
        </div>

        {/* RIGHT SECTION - GALLERY */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">📸 Gallery</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {event.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImageIndex(i)}
                className={`w-full h-32 object-cover rounded-xl cursor-pointer shadow-md transition ${selectedImageIndex === i ? "ring-4 ring-indigo-600 scale-105" : "opacity-80 hover:opacity-100"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}
