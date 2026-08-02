'use client';

import React, { useState } from 'react';
import { X, Bell, Ban, Archive, Shield, Music, UserCheck, Check, Trash2, KeyRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const currentUser = useSelector((state: RootState) => state.feed.currentUser);

  const [activeCategory, setActiveCategory] = useState<'notifications' | 'blocked' | 'archive' | 'security'>('notifications');

  // Notifications State
  const [likesNotif, setLikesNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [repostsNotif, setRepostsNotif] = useState(true);

  // Blocked Users State
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'b-1', username: 'spam_bot_99', name: 'Spam Bot' },
    { id: 'b-2', username: 'troll_user', name: 'Anonymous User' },
  ]);

  // Archive State
  const [archivedItems, setArchivedItems] = useState([
    { id: 'arc-1', caption: 'Late night sound design experiment...', date: 'Aug 1, 2026', media: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' },
    { id: 'arc-2', caption: 'Spatial web interface prototype 🚀', date: 'Jul 28, 2026', media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
  ]);

  if (!isOpen) return null;

  const handleUnblock = (id: string) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
  };

  const handleUnarchive = (id: string) => {
    setArchivedItems(archivedItems.filter(a => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col md:flex-row h-[520px]">
        
        {/* Settings Category Navigation Sidebar */}
        <div className="w-full md:w-56 border-r border-white/10 p-4 space-y-1 bg-black/30">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Settings</h3>
            <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-white/10 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'blocked', label: 'Blocked Accounts', icon: Ban },
            { id: 'archive', label: 'Archive & Storage', icon: Archive },
            { id: 'security', label: 'Privacy & Security', icon: Shield },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Details Panel */}
        <div className="flex-1 p-6 overflow-y-auto relative flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {activeCategory === 'notifications' && <><Bell className="w-4 h-4 text-rose-400" /> Notifications Settings</>}
                {activeCategory === 'blocked' && <><Ban className="w-4 h-4 text-rose-400" /> Blocked Accounts</>}
                {activeCategory === 'archive' && <><Archive className="w-4 h-4 text-amber-400" /> Archived Posts & Stories</>}
                {activeCategory === 'security' && <><Shield className="w-4 h-4 text-purple-400" /> Account & Device Security</>}
              </h2>
              <button onClick={onClose} className="hidden md:block p-1 rounded-full hover:bg-white/10 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. NOTIFICATIONS CATEGORY */}
            {activeCategory === 'notifications' && (
              <div className="space-y-4">
                {[
                  { label: 'Likes & Reactions', desc: 'Notify when someone likes your posts or stories', state: likesNotif, setState: setLikesNotif },
                  { label: 'Comments & Replies', desc: 'Notify when someone comments on your creations', state: commentsNotif, setState: setCommentsNotif },
                  { label: 'Reposts & Quotes', desc: 'Notify when someone reposts your audio or reels', state: repostsNotif, setState: setRepostsNotif },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl glass-pill">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.label}</h4>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.setState(!item.state)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        item.state ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${item.state ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 2. BLOCKED ACCOUNTS CATEGORY */}
            {activeCategory === 'blocked' && (
              <div className="space-y-3">
                {blockedUsers.length > 0 ? (
                  blockedUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl glass-pill">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                          🚫
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">@{u.username}</p>
                          <p className="text-[10px] text-slate-400">{u.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnblock(u.id)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all border border-white/10"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">No blocked accounts found.</p>
                )}
              </div>
            )}

            {/* 3. ARCHIVE CATEGORY */}
            {activeCategory === 'archive' && (
              <div className="space-y-3">
                {archivedItems.length > 0 ? (
                  archivedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl glass-pill">
                      <div className="flex items-center gap-3">
                        <img src={item.media} alt="Archive" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{item.caption}</p>
                          <p className="text-[10px] text-slate-400">Archived on {item.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnarchive(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                      >
                        Restore
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">Archive is currently empty.</p>
                )}
              </div>
            )}

            {/* 4. SECURITY & PRIVACY CATEGORY */}
            {activeCategory === 'security' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl glass-pill space-y-1">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white">Password Security</h4>
                  </div>
                  <p className="text-[10px] text-slate-400">Your account password is saved securely on this device.</p>
                </div>

                <div className="p-3.5 rounded-2xl glass-pill space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">Device Active Session</h4>
                  </div>
                  <p className="text-[10px] text-emerald-400">Active session saved on Windows Web Browser</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg"
            >
              Done & Save Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
