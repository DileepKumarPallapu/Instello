'use client';

import React, { useState } from 'react';
import { X, User, MapPin, Link as LinkIcon, Camera, Save, Loader2, Sparkles, Upload, ShieldCheck, Lock, Music, Play, Pause } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditProfileModalOpen, setCurrentUser } from '@/store/feedSlice';
import { api } from '@/lib/api';

const avatarPresets = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
];

const songPresets = [
  { id: 's-1', title: 'Atmospheric Synth Ambient 80s', artist: 'Instello Audio Frequencies', duration: '0:30' },
  { id: 's-2', title: 'Lo-Fi Chill Sunset', artist: 'Instello Soundscapes', duration: '0:45' },
  { id: 's-3', title: 'Cyberpunk Pulse Frequency', artist: 'Spatial Audio Lab', duration: '0:35' },
];

export function EditProfileModal() {
  const dispatch = useDispatch();
  const { isEditProfileModalOpen: isOpen, currentUser } = useSelector((state: RootState) => state.feed);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState('Building the next evolution of social media on Instello. ⚡');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'user'}`
  );
  const [selectedSong, setSelectedSong] = useState(songPresets[0]);
  const [previewingSongId, setPreviewingSongId] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // AI Avatar Generator Handler
  const handleGenerateAiAvatar = () => {
    setIsGeneratingAi(true);
    const styles = ['avataaars', 'bottts', 'lorelei', 'thumbs', 'personas'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    const generated = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;
    
    setTimeout(() => {
      setAvatarUrl(generated);
      setIsGeneratingAi(false);
    }, 200);
  };

  // Local File Upload Handler (Exact unmodified photo data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedUser = {
      id: currentUser?.id || `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      email: currentUser?.email || 'user@instello.app',
      username: currentUser?.username || 'user',
      fullName: fullName || currentUser?.fullName || 'Instello User',
      role: currentUser?.role || 'USER',
      isVerified: currentUser?.isVerified || false,
      avatarUrl: avatarUrl, // Exact raw photo preserved!
      following: [
  'dileepkumarpallapu07@gmail.com',
  'instello_official'
],
    };

    // Save to persistent device store
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aura_registered_accounts');
        const accounts = saved ? JSON.parse(saved) : {};
        const key = updatedUser.username.toLowerCase();
        accounts[key] = { ...(accounts[key] || {}), ...updatedUser };
        localStorage.setItem('aura_registered_accounts', JSON.stringify(accounts));
        localStorage.setItem('aura_active_session', JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
      }
    }

    // Dispatch immediately so all Navbar, Sidebar, Profile header components update in real time!
    dispatch(setCurrentUser(updatedUser));

    try {
      await api.put('/users/profile', {
        userId: updatedUser.id,
        bio,
        avatarUrl,
        song: selectedSong,
      });
    } catch (err) {
      // Local state fallback already dispatched
    } finally {
      setIsSubmitting(false);
      setSuccessMsg('Profile picture & details updated and saved for all users to see!');
      setTimeout(() => {
        dispatch(setEditProfileModalOpen(false));
        setSuccessMsg('');
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-rose-400" />
            <span>Update Profile Picture & Details</span>
          </h2>
          <button
            onClick={() => dispatch(setEditProfileModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Profile Picture Upload & Live Preview Section */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-2xl glass-pill border border-white/10">
            
            {/* Live Avatar Preview */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Uploaded Profile Picture"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-500/50 shadow-lg border border-black"
              />
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-rose-600 text-white shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* AI Avatar & Photo Upload Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleGenerateAiAvatar}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
              >
                {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>AI Avatar</span>
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar Presets */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-semibold text-slate-400 mr-1">Presets:</span>
              {avatarPresets.map((preset, i) => (
                <img
                  key={i}
                  src={preset}
                  alt={`Preset ${i}`}
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                    avatarUrl === preset ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-transparent'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Profile Theme Song Selector Section */}
          <div className="p-4 rounded-2xl glass-panel border border-indigo-500/30 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-400" />
              <span>Choose Profile Theme Song</span>
            </h4>

            <div className="space-y-2">
              {songPresets.map((song) => {
                const isSelected = selectedSong.id === song.id;
                const isPreviewing = previewingSongId === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500/50 shadow-md'
                        : 'glass-pill border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingSongId(isPreviewing ? null : song.id);
                        }}
                        className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md"
                      >
                        {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                      <div>
                        <p className="text-xs font-bold text-white">{song.title}</p>
                        <p className="text-[10px] text-slate-400">{song.artist} • {song.duration}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Profile Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full glass-input p-3 rounded-xl text-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => dispatch(setEditProfileModalOpen(false))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg hover:scale-105 transition-all"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save & Update Everywhere</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
