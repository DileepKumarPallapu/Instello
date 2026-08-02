'use client';

import React, { useState } from 'react';
import { X, Sparkles, Star, Camera, Upload, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: any) => void;
}

export function CreateStoryModal({ isOpen, onClose, onStoryCreated }: CreateStoryModalProps) {
  const currentUser = useSelector((state: RootState) => state.feed.currentUser);

  const [storyText, setStoryText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [isCloseFriends, setIsCloseFriends] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    const newStory = {
      id: `story-${Date.now()}`,
      mediaUrl,
      caption: storyText,
      isCloseFriends,
      user: {
        username: currentUser?.username || 'you_creator',
        fullName: currentUser?.fullName || 'Current User',
        avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onStoryCreated(newStory);
      setIsPublishing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Post a 24h Story</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-4">
          
          {/* Story Preview Frame */}
          <div className="relative h-64 rounded-2xl overflow-hidden border border-white/20 group">
            <img src={mediaUrl} alt="Story Preview" className="w-full h-full object-cover" />
            
            {/* Story Text Overlay */}
            {storyText && (
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30">
                <span className="text-sm font-extrabold text-white text-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                  {storyText}
                </span>
              </div>
            )}

            {/* Change Story Photo Button */}
            <label className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20 cursor-pointer hover:bg-black/80 transition-all">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Story Text / Sticker</label>
            <input
              type="text"
              placeholder="Add text overlay or thought sticker..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            />
          </div>

          {/* Close Friends Audience Selector */}
          <div className="p-3 rounded-2xl glass-pill flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Close Friends Only</h4>
                <p className="text-[10px] text-slate-400">Share exclusively with Close Friends ring</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCloseFriends(!isCloseFriends)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isCloseFriends ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isCloseFriends ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Publish Story Button */}
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Publish 24h Story</span>
          </button>

        </form>

      </div>
    </div>
  );
}
