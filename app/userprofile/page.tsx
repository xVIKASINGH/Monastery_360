'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Heart, Ticket, Settings, MapPin, Calendar, Users } from 'lucide-react';
import { signOut } from "next-auth/react";

interface Monastery {
  _id: string;
  name: string;
  district: string;
  state: string;
  images: string[];
}

interface Booking {
  _id: string;
  event: string;
  date: string;
  numberOfPeople: number;
  ticketPrice: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'success' | 'failed';
}

interface UserData {
  _id: string;
  email: string;
  username: string;
  savedMonasteries: Monastery[];
  bookings: Booking[];
}

type TabType = 'account' | 'saved' | 'tickets';

const getInitials = (username: string): string => {
  return username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (username: string): string => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-indigo-500 to-indigo-600',
  ];
  return colors[username.length % colors.length];
};

const QRPlaceholder: React.FC = () => (
  <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded grid grid-cols-3 gap-1 p-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-400' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  </div>
);

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/userprofile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const json = await response.json();
        const data: UserData | null = json?.user ?? null;
        if (!data) throw new Error('No user data returned from server');
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


const handleLogout = async () => {
  try {
    await signOut({ callbackUrl: "/" });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading your profile</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <p className="text-red-600 font-medium">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <div className="flex flex-col items-center">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarColor(
                    userData.username
                  )} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <span className="text-white text-2xl font-bold">
                    {getInitials(userData.username)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {userData.username}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{userData.email}</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {(
                [
                  { id: 'account', label: 'Account', icon: Settings },
                  { id: 'saved', label: 'Saved Monasteries', icon: Heart },
                  { id: 'tickets', label: 'My Tickets', icon: Ticket },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                    activeTab === id
                      ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="max-w-3xl">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Account Settings
                    </h1>
                    <p className="text-slate-500">Manage your account information</p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">
                          Username
                        </label>
                        <input
                          type="text"
                          value={userData.username}
                          disabled
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Monasteries Tab */}
              {activeTab === 'saved' && (
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Saved Monasteries
                    </h1>
                    <p className="text-slate-500">
                      {userData.savedMonasteries?.length || 0} saved locations
                    </p>
                  </div>

                  {userData.savedMonasteries?.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                      <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">
                        No saved monasteries yet
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Explore and save your favorite monasteries to visit later
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {userData.savedMonasteries?.map((monastery: Monastery) => (
                        <div
                          key={monastery._id}
                          className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
                        >
                          {monastery.images?.[0] && (
                            <div className="h-48 overflow-hidden bg-slate-100">
                              <img
                                src={monastery.images[0]}
                                alt={monastery.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-2">
                              {monastery.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={16} />
                              <p className="text-sm">
                                {monastery.district}, {monastery.state}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      My Tickets
                    </h1>
                    <p className="text-slate-500">
                      {userData.bookings?.length || 0} booking(s)
                    </p>
                  </div>

                  {userData.bookings?.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                      <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">
                        No tickets booked yet
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Book your first ticket to start your monastery journey
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userData.bookings?.map((booking: Booking) => (
                        <div
                          key={booking._id}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Ticket Left Side */}
                            <div className="md:w-2/3 p-8 border-b md:border-b-0 md:border-r border-slate-100">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                                    Booking ID
                                  </p>
                                  <h3 className="text-2xl font-bold text-slate-900">
                                    {booking._id.slice(-6).toUpperCase()}
                                  </h3>
                                </div>
                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                    booking.paymentStatus === 'success'
                                      ? 'bg-green-100 text-green-700'
                                      : booking.paymentStatus === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {booking.paymentStatus}
                                </span>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {booking.event}
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                  <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                                      Date
                                    </p>
                                    <p className="flex items-center gap-2 text-slate-900 font-semibold">
                                      <Calendar size={16} />
                                      {new Date(booking.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                                      Guests
                                    </p>
                                    <p className="flex items-center gap-2 text-slate-900 font-semibold">
                                      <Users size={16} />
                                      {booking.numberOfPeople}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                                      Per Person
                                    </p>
                                    <p className="text-slate-900 font-semibold">
                                      ₹{booking.ticketPrice}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Ticket Right Side - QR */}
                            <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                              <QRPlaceholder />
                              <p className="text-xs text-slate-500 font-medium mt-4 text-center">
                                Scan at entry
                              </p>
                            </div>
                          </div>

                          {/* Ticket Bottom - Total */}
                          <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
                            <p className="text-slate-300 text-sm font-medium">
                              Total Amount
                            </p>
                            <p className="text-white text-2xl font-bold">
                              ₹{booking.totalAmount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}