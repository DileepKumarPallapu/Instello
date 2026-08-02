'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Repeat, Bookmark, Share2, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, Music, CheckCircle2 } from 'lucide-react';

const reelsData = [
  {
    id: 'reel-1',
    author: {
      name: 'Elena Rostova',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    caption: 'High Clarity Audio Reel: Atmospheric synth frequency experiment #AudioReels #DilseUp 🎧✨',
    audioTitle: 'Atmospheric Synth - Frequency 432Hz',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    likesCount: 1420,
    commentsCount: 84,
  },
  {
    id: 'reel-2',
    author: {
      name: 'Sound Architect',
      username: 'sound_architect',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    caption: 'Spatial Web & Glassmorphism UI walkthrough #Nextjs15 #React19 🔥',
    audioTitle: 'Cyberpunk Pulse Stream',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    likesCount: 2890,
    commentsCount: 142,
  },
];

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({
    'reel-1': 1420,
    'reel-2': 2890,
  });

  const currentReel = reelsData[currentIndex];

  const handleLike = (id: string) => {
    const isLiked = liked[id];
    setLiked({ ...liked, [id]: !isLiked });
    setLikesCounts({
      ...likesCounts,
      [id]: isLiked ? likesCounts[id] - 1 : likesCounts[id] + 1,
    });
  };

  const handleNext = () => {
    if (currentIndex < reelsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex items-center justify-center relative py-2">
      
      {/* Reel Theater Frame */}
      <div className="relative w-full max-w-sm h-full glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between">
        
        {/* Reel Media Preview Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentReel.mediaUrl}
            alt="Reel content"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </div>

        {/* Top Header Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">HD Audio Reel</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:scale-105 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Play / Pause Toggle Center Trigger */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl">
              <Play className="w-8 h-8 ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Reel Caption & Creator Bar */}
        <div className="relative z-10 p-5 space-y-3">
          
          {/* Creator Profile Row */}
          <div className="flex items-center gap-3">
            <img
              src={currentReel.author.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/60"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-extrabold text-white">{currentReel.author.name}</h4>
                {currentReel.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#0095F6]" />}
              </div>
              <p className="text-[10px] text-rose-400 font-bold">@{currentReel.author.username}</p>
            </div>

            <button className="ml-auto px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md">
              Follow
            </button>
          </div>

          {/* Caption Text */}
          <p className="text-xs text-slate-100 leading-relaxed line-clamp-2">
            {currentReel.caption}
          </p>

          {/* Audio Waveform Stream */}
          <div className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-3">
            <Music className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-200 truncate flex-1">{currentReel.audioTitle}</span>
            <div className="flex items-center gap-0.5 h-3">
              {[40, 70, 30, 90, 60].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full ${isPlaying && !isMuted ? 'bg-rose-500 animate-pulse' : 'bg-white/30'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Engagement Action Dock */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
          
          {/* Like Reel */}
          <button
            onClick={() => handleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform ${
              liked[currentReel.id] ? 'text-rose-500' : 'text-white'
            }`}>
              <Heart className={`w-5 h-5 ${liked[currentReel.id] ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="text-[10px] font-bold">{likesCounts[currentReel.id]}</span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{currentReel.commentsCount}</span>
          </button>

          {/* Repost Reel */}
          <button className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
            <Repeat className="w-5 h-5 text-emerald-400" />
          </button>

          {/* Bookmark */}
          <button className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
            <Bookmark className="w-5 h-5 text-amber-400" />
          </button>

        </div>

      </div>

      {/* Vertical Navigation Buttons */}
      <div className="hidden md:flex flex-col gap-2 ml-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full glass-panel text-white hover:bg-white/20 disabled:opacity-40 transition-all shadow-lg"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === reelsData.length - 1}
          className="p-3 rounded-full glass-panel text-white hover:bg-white/20 disabled:opacity-40 transition-all shadow-lg"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
