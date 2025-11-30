"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthModal } from "./signin/page";
import { useSession, signOut } from "next-auth/react";

const Monastery360 = () => {
  const router = useRouter();

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Video states
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // NEXTAUTH session
  const { data: session } = useSession();

  // Avatar dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  const monasteries = [
    { name: "Rumtek Monastery", location: "East Sikkim" },
    { name: "Pemayangtse Monastery", location: "West Sikkim" },
    { name: "Tashiding Monastery", location: "West Sikkim" },
    { name: "Enchey Monastery", location: "Gangtok" },
    { name: "Dubdi Monastery", location: "Yuksom" },
  ];

  // Function to get role-based dashboard route
  const getDashboardRoute = (role: string | undefined) => {
    switch (role?.toLowerCase()) {
      case "hotelier":
        return "/hotel-admin";
      case "monasteryadmin":
        return "/monastery-admin";
      case "user":
      default:
        return "/userprofile";
    }
  };

  // Function to generate avatar from initials
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate a consistent color based on name
  const getAvatarColor = (name: string | undefined) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    const hash = (name || "").split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return colors[hash % colors.length];
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo) {
          const playPromise = video.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        } else {
          video.pause();
        }
        video.muted = isMuted;
      }
    });

    // Play/pause audio based on mute state
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentVideo, isMuted]);

  const handleVideoChange = (dir: "next" | "prev") => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    const nextIndex =
      dir === "next"
        ? (currentVideo + 1) % monasteries.length
        : (currentVideo - 1 + monasteries.length) % monasteries.length;

    setCurrentVideo(nextIndex);

    setTimeout(() => setIsTransitioning(false), 800);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      videoRefs.current.forEach((v) => {
        if (v) v.muted = newState;
      });
      
      // Toggle audio
      if (audioRef.current) {
        if (newState) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }
      
      return newState;
    });
  };

  const currentMonastery = monasteries[currentVideo];
  const userRole = session?.user?.role || "user";
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          backgroundImagePath="/images/sikkimHe.avif" 
        />
      )}

      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        playsInline
      >
        <source src="/audio/landingpage_audiotape.mpeg" type="audio/mpeg" />
      </audio>

      {/* Background Videos */}
      <div className="relative h-screen w-full overflow-hidden">
        {monasteries.map((monastery, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentVideo
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            >
              <source
                src={`/videos/monastery-${index + 1}.mp4`}
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>
        ))}

        {/* NAVBAR */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold tracking-wide">
              <span className="text-white">Monastery</span>
              <span className="text-yellow-400">360</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a onClick={() => router.push("/art-gallery")} className="hover:text-yellow-400 transition cursor-pointer">
               Art Gallery
              </a>
              <a onClick={() => router.push("/monasteries")} className="hover:text-yellow-400 transition cursor-pointer">
                Explore Monastries
              </a>
              <a  onClick={() => router.push("/ai-planner")} className="hover:text-yellow-400 transition  cursor-pointer">
                Plan Your Trip
              </a>
              <a  onClick={() => router.push("/historical-archives")} className="hover:text-yellow-400 transition  cursor-pointer">
                Historical Archives
              </a>
               <a  onClick={() => router.push("/events")} className="hover:text-yellow-400 transition  cursor-pointer">
                Cultural events & festivals
              </a>
              <a   onClick={() => router.push("/sikkim-map")} className="hover:text-yellow-400 transition  cursor-pointer">Sikkim</a>
              {/* 🔥 IF LOGGED IN → SHOW AVATAR */}
              {session?.user ? (
                <div className="relative">
                  {/* Avatar with image or initials */}
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="avatar"
                      className="w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-400"
                      onClick={() => setShowDropdown((p) => !p)}
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-400 flex items-center justify-center font-semibold text-white ${avatarColor}`}
                      onClick={() => setShowDropdown((p) => !p)}
                    >
                      {initials}
                    </div>
                  )}

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-xl py-3 z-50">
                      <div className="px-4 py-2 font-semibold border-b">
                        {userName}
                      </div>

                  

                      <button
                        onClick={() => {
                          router.push(getDashboardRoute(userRole));
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </button>

                    

                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // 🔥 If NOT logged in → Show Get Started (opens login modal)
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Center Text */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <p className="text-yellow-400 text-lg md:text-xl mb-4 tracking-widest uppercase">
              Step into the allure of Sikkim&apos;s
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic mb-6">
              Incredible Wonders
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Explore over 200 ancient monasteries through immersive 360° virtual
              experiences.
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-12 px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div className="flex flex-col">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400">
                {currentMonastery.name}
              </div>
              <div className="text-lg md:text-xl font-light text-white opacity-80">
                <MapPin className="inline w-5 h-5 mr-2" />
                {currentMonastery.location}
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => handleVideoChange("prev")}
                disabled={isTransitioning}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={() => handleVideoChange("next")}
                disabled={isTransitioning}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-950 py-12 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 text-center">
            © 2025 Monastery360 — A SIH 2025 Project.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Monastery360;