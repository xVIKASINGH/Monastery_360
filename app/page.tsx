"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthModal } from './signin/page';

const Monastery360 = () => {
  const router = useRouter();

  // 🟡 Modal state added
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const monasteries = [
    { name: 'Rumtek Monastery', location: 'East Sikkim' },
    { name: 'Pemayangtse Monastery', location: 'West Sikkim' },
    { name: 'Tashiding Monastery', location: 'West Sikkim' },
    { name: 'Enchey Monastery', location: 'Gangtok' },
    { name: 'Dubdi Monastery', location: 'Yuksom' }
  ];

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
        video.muted = isMuted;
      }
    });
  }, [currentVideo, isMuted]);

  const handleVideoChange = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextIndex =
      direction === "next"
        ? (currentVideo + 1) % monasteries.length
        : (currentVideo - 1 + monasteries.length) % monasteries.length;

    setCurrentVideo(nextIndex);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMutedState = !prev;
      videoRefs.current.forEach(video => {
        if (video) video.muted = newMutedState;
      });
      return newMutedState;
    });
  };

  const currentMonastery = monasteries[currentVideo];

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}

      {/* Background Videos */}
      <div className="relative h-screen w-full overflow-hidden">
        {monasteries.map((monastery, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <video
              ref={el => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            >
              <source src={`/videos/monastery-${index + 1}.mp4`} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>
        ))}

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-2xl font-bold tracking-wide">
              <span className="text-white">Monastery</span>
              <span className="text-yellow-400">360</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#adventure" className="hover:text-yellow-400 transition-colors">Adventure</a>
              <a href="#nature" className="hover:text-yellow-400 transition-colors">Nature</a>
              <a href="#heritage" className="hover:text-yellow-400 transition-colors">Heritage</a>
              <a href="#spiritual" className="hover:text-yellow-400 transition-colors">Spiritual</a>

              {/* 🔥 Replaced "Explore Now" with "Get Started" → opens modal */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
              >
                Get Started
              </button>
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
              Explore over 200 ancient monasteries through immersive 360° virtual experiences
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-12 px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-end">

            {/* Monastery Info */}
            <div className="flex flex-col">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400">
                {currentMonastery.name}
              </div>
              <div className="text-lg md:text-xl font-light text-white opacity-80">
                <MapPin className="inline w-5 h-5 mr-2" />
                {currentMonastery.location}
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {/* Arrows */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleVideoChange("prev")}
                disabled={isTransitioning}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={() => handleVideoChange("next")}
                disabled={isTransitioning}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
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
