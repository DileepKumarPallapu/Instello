'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, MessageSquare, Shield, LogIn, UserPlus, Sun, Moon, Crown, Heart, X, Flame } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCreateModalOpen, setAuthModalOpen, toggleTheme } from '@/store/feedSlice';

export function Navbar() {
  const dispatch = useDispatch();
  const { currentUser, theme } = useSelector((state: RootState) => state.feed);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      type: 'LIKE_POST',
      user: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'liked your creation on Instello ❤️',
      time: '2m ago',
      mediaPreview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'notif-2',
      type: 'LIKE_STORY',
      user: 'sound_architect',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
      text: 'liked your Close Friends story ⭐',
      time: '15m ago',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-2.5 backdrop-blur-glass transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* INSTELLO BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 p-0.5 shadow-2xl group-hover:scale-105 transition-transform duration-200 ring-2 ring-amber-500/40">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400 group-hover:animate-bounce" />
              <Crown className="w-3 h-3 text-white absolute top-1 right-1" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-rose-500 to-purple-400 bg-clip-text text-transparent uppercase">
              INSTELLO
            </span>
            <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase -mt-1 flex items-center gap-1">
              <Crown className="w-2.5 h-2.5" /> By Pallapu Dileep Kumar
            </span>
          </div>
        </Link>

        {/* Global Instant Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Instello creators, reels, audio frequencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              className="w-full glass-input pl-10 pr-4 py-2 rounded-full text-xs placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Instant Dropdown Search Results */}
          {isSearching && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in duration-150">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Matching Instello Creators</p>
              <Link href={`/profile/${searchQuery}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${searchQuery}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-white">@{searchQuery}</p>
                  <p className="text-[10px] text-slate-400">View Profile</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2.5 relative">
          
          {/* Creator Attribution Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Designed by Pallapu Dileep Kumar</span>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2.5 rounded-full glass-pill hover:bg-white/10 transition-colors text-amber-400 hover:scale-110 active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-full glass-pill hover:bg-white/10 transition-colors text-slate-300 hover:text-rose-400"
            title="Instello Notifications"
          >
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </button>

          <button
            onClick={() => dispatch(setCreateModalOpen(true))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Create Post</span>
          </button>

          <Link href="/messages" className="relative p-2.5 rounded-full glass-pill hover:bg-white/10 transition-colors text-slate-300 hover:text-white">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          </Link>

          <Link href="/admin" className="p-2.5 rounded-full glass-pill hover:bg-white/10 transition-colors text-slate-300 hover:text-white">
            <Shield className="w-5 h-5" />
          </Link>

          {/* User Auth Session Pill */}
          {currentUser ? (
            <Link
              href={`/profile/${encodeURIComponent(currentUser.username)}`}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full glass-pill hover:ring-2 ring-indigo-500/50 transition-all border border-rose-500/30"
            >
              <img
                src={currentUser.avatarUrl}
                alt="Live User Avatar"
                className="w-7 h-7 rounded-full object-cover border border-white/40 ring-1 ring-rose-500/50"
              />
              <span className="text-xs font-bold text-white hidden md:inline pr-1 truncate max-w-[120px]">
                @{currentUser.username}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => dispatch(setAuthModalOpen({ open: true, mode: 'login' }))}
                className="px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => dispatch(setAuthModalOpen({ open: true, mode: 'register' }))}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Notifications Drawer */}
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 glass-panel rounded-3xl p-4 shadow-2xl border border-white/20 z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="text-xs font-bold text-white">Instello Activity</h3>
                </div>
                <button onClick={() => setIsNotificationsOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-2xl glass-pill hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <img src={item.avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <div>
                        <p className="text-[11px] text-slate-200">
                          <span className="font-bold text-white">@{item.user}</span> {item.text}
                        </p>
                        <span className="text-[9px] text-slate-400">{item.time}</span>
                      </div>
                    </div>
                    {item.mediaPreview && (
                      <img src={item.mediaPreview} alt="Media Preview" className="w-8 h-8 rounded-lg object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
