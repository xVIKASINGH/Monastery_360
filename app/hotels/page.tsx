"use client";

import React, { useState, useEffect } from "react";
import { Heart, MapPin, Users, Star, Wallet, Building2 } from "lucide-react";
import Link from "next/link";
import { Types } from "mongoose";
import { IHotel } from "@/models/hotelsModel";

interface Location {
  lat: number;
  lng: number;
}

const HotelCard: React.FC<{
  hotel: IHotel;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}> = ({ hotel, index, isFavorite, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/hotels/${hotel._id}`}>
      <div
        className="group h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="relative h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:shadow-slate-200">
          {/* Image */}
          <div className="relative w-full h-80 overflow-hidden bg-gray-100">
            {hotel.images?.length > 0 ? (
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: isHovered ? "scale(1.08)" : "scale(1)",
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-semibold">Hotel</span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(hotel._id.toString());
              }}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
            >
              <Heart
                size={22}
                className={
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700 hover:text-red-500"
                }
              />
            </button>

            {/* Price Tag */}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-4 py-1 rounded-full text-sm font-semibold">
              ₹{hotel.pricePerNight.toLocaleString()}
              <span className="text-xs"> / night</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
              {hotel.name}
            </h3>

            <div className="flex items-start gap-2 text-gray-600 mb-3">
              <MapPin size={14} className="mt-0.5 text-gray-400" />
              <span className="text-sm leading-snug">{hotel.address}</span>
            </div>

            {/* Closest Monastery */}
            {hotel.closestMonastery && (
              <div className="mb-3">
                <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-xs font-semibold border border-yellow-100">
                  Near {hotel.closestMonastery}
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900 text-sm">
                    {hotel.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Rating</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Wallet size={14} className="text-green-600" />
                  <span className="font-bold text-gray-900 text-sm">
                    ₹{hotel.pricePerNight}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Price</span>
              </div>

              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm mb-1">
                  {hotel.available ? "Yes" : "No"}
                </div>
                <span className="text-xs text-gray-500">Available</span>
              </div>
            </div>

            <button
              className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 hover:bg-gray-800"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const HotelsListing = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels");
        const data = await response.json();
        setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = new Set(favorites);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setFavorites(updated);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-14 w-14 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Hotels Near Monasteries
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mt-4">
            Find premium stays, scenic resorts, and peaceful retreats close to
            sacred monasteries.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hotels.map((hotel, index) => (
            <HotelCard
              key={hotel._id.toString()}
              hotel={hotel}
              index={index}
              isFavorite={favorites.has(hotel._id.toString())}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {hotels.length === 0 && (
          <p className="text-center text-gray-500 text-xl py-24">
            No hotels found
          </p>
        )}
      </div>
    </div>
  );
};

export default HotelsListing;
