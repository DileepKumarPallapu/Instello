'use client';

import React, { useState } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, ScreenShare, ShieldCheck, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setVideoCallActive } from '@/store/feedSlice';

export function VideoCallModal() {
  const dispatch = useDispatch();
  const { isVideoCallActive, activeCallUser } = useSelector((state: RootState) => state.feed);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  if (!isVideoCallActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col h-[600px] relative">
        
        {/* Call Stream Canvas Header */}
        <div className="p-4 glass-pill flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                WebRTC P2P Call: {activeCallUser?.name || 'Elena Rostova'}
              </h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                End-to-End Encrypted (AES-256)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-white/10 px-3 py-1 rounded-full">
            04:12
          </span>
        </div>

        {/* Video Video Grid */}
        <div className="flex-1 relative bg-slate-950/80 flex items-center justify-center p-6 gap-4">
          
          {/* Main Remote Peer Video */}
          <div className="flex-1 h-full rounded-2xl overflow-hidden glass-panel relative flex items-center justify-center border border-indigo-500/30">
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={activeCallUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt="Remote User"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/50"
                />
                <span className="text-sm font-bold text-white">{activeCallUser?.name || 'Elena Rostova'}</span>
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80"
                alt="Stream Feed"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Local User Self Preview Thumbnail */}
          <div className="absolute bottom-10 right-10 w-48 h-32 rounded-2xl overflow-hidden glass-panel border-2 border-indigo-500 shadow-neon">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="Self"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Bottom Floating Control Dock */}
        <div className="p-4 glass-panel border-t border-white/10 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-rose-600 text-white' : 'glass-pill text-slate-200 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-all ${
              isVideoOff ? 'bg-rose-600 text-white' : 'glass-pill text-slate-200 hover:text-white'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button className="p-4 rounded-full glass-pill text-slate-200 hover:text-indigo-400 transition-all">
            <ScreenShare className="w-5 h-5" />
          </button>

          <button
            onClick={() => dispatch(setVideoCallActive({ active: false }))}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-neon hover:scale-105 active:scale-95 transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
