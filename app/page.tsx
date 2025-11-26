"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, MapPin, Calendar, Book, Compass } from 'lucide-react';

const Monastery360 = () => {
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
          // Attempt to play the video for the current index
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Autoplay was prevented. User will need to interact.
              console.log("Autoplay prevented:", error);
            });
          }
        } else {
          // Pause other videos
          video.pause();
        }
        // Apply mute status on mount/update
        video.muted = isMuted;
      }
    });
  }, [currentVideo, isMuted]);

  const handleVideoChange = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentVideo + 1) % monasteries.length;
    } else {
      nextIndex = (currentVideo - 1 + monasteries.length) % monasteries.length;
    }
    setCurrentVideo(nextIndex);
    
    // Set a timeout for the transition duration
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
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
      {/* Hero Section with Video Background */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Backgrounds */}
        {monasteries.map((monastery, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentVideo 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            >
              <source src={`/videos/monastery-${index + 1}.mp4`} type="video/mp4" />
              {/* Fallback for browsers that do not support the video tag */}
              Your browser does not support the video tag.
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
              {/* Categories inspired by the second image, but for a navigation bar */}
              <a href="#adventure" className="hover:text-yellow-400 transition-colors">Adventure</a>
              <a href="#nature" className="hover:text-yellow-400 transition-colors">Nature</a>
              <a href="#heritage" className="hover:text-yellow-400 transition-colors">Heritage</a>
              <a href="#spiritual" className="hover:text-yellow-400 transition-colors">Spiritual</a>
              <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </nav>

        {/* Center Content */}
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

        {/* Bottom Navigation and Info - REVISED */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-12 px-8">
            <div className="max-w-7xl mx-auto flex justify-between items-end">
                {/* Current Monastery Info (Left/Center) */}
                <div className="flex flex-col">
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 transition-opacity duration-700 ease-in-out">
                        {currentMonastery.name}
                    </div>
                    <div className="text-lg md:text-xl font-light text-white opacity-80 transition-opacity duration-700 ease-in-out">
                        <MapPin className="inline w-5 h-5 mr-2" />
                        {currentMonastery.location}
                    </div>
                </div>

                {/* Sound Toggle (Moved to bottom left for better flow) */}
                <button
                    onClick={toggleMute}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all absolute bottom-12 left-8 md:relative md:bottom-auto md:left-auto md:order-last"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                {/* Navigation Arrows (Bottom Right as requested) */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleVideoChange('prev')}
                        disabled={isTransitioning}
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all disabled:opacity-50"
                        aria-label="Previous monastery"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        onClick={() => handleVideoChange('next')}
                        disabled={isTransitioning}
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all disabled:opacity-50"
                        aria-label="Next monastery"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Monastery</span>
                <span className="text-yellow-400">360</span>
              </div>
              <p className="text-gray-400 text-sm">
                Preserving and sharing Sikkim&asop;s spiritual heritage through innovative digital experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Virtual Tours</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Digital Archives</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Interactive Map</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Audio Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Travel Guide</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cultural Calendar</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Research Portal</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Partner With Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 Monastery360. All rights reserved. A SIH 2025 Project.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Monastery360;