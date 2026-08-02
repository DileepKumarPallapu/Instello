'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Radio, MessageSquare, BarChart3, Shield, Zap, LogOut, LogIn, Sun, Moon, Crown, Settings, Fingerprint, Flame } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logoutUser, setAuthModalOpen, toggleTheme } from '@/store/feedSlice';
import { SettingsModal } from '@/components/settings/SettingsModal';

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { currentUser, theme } = useSelector((state: RootState) => state.feed);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { label: 'Feed', icon: Home, href: '/' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'Audio Reels', icon: Radio, href: '/reels' },
    { label: 'Messages', icon: MessageSquare, href: '/messages', badge: '2' },
    { label: 'Creator Studio', icon: BarChart3, href: '/studio' },
    { label: 'Admin Portal', icon: Shield, href: '/admin' },
  ];

  return (
    <>
      <aside className="w-64 hidden lg:block sticky top-20 h-[calc(100vh-6rem)] p-4 flex flex-col justify-between">
        <div className="space-y-3">
          
          {/* Navigation Dock */}
          <div className="glass-panel rounded-3xl p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg scale-[1.02]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Settings Link Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400" />
                <span>Settings Hub</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-400 font-bold uppercase">
                Categories
              </span>
            </button>
          </div>

          {/* Instello Creator Signature Card */}
          <div className="glass-panel rounded-3xl p-4 bg-gradient-to-br from-amber-950/40 via-rose-950/40 to-purple-950/40 border border-amber-500/40 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Lead Creator & Designer</h4>
            </div>
            <p className="text-sm font-black text-white tracking-wide">
              Pallapu Dileep Kumar
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Chief Architect & Creative Designer of Instello. ✨
            </p>
          </div>

          {/* Dark / Light Theme Toggle Card */}
          <div
            onClick={() => dispatch(toggleTheme())}
            className="glass-panel p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span className="text-xs font-semibold text-slate-200">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400 font-bold uppercase">
              {theme}
            </span>
          </div>

        </div>

        {/* User Session Pill with LIVE AVATAR and Full User ID */}
        <div className="space-y-2">
          {currentUser ? (
            <div className="space-y-1">
              <Link
                href={`/profile/${encodeURIComponent(currentUser.username)}`}
                className="flex items-center gap-3 p-2.5 rounded-2xl glass-panel hover:ring-2 ring-indigo-500/50 transition-all border border-rose-500/30"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-white/40 ring-2 ring-rose-500/50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">@{currentUser.username}</p>
                  <p className="text-[10px] text-indigo-300 font-semibold truncate flex items-center gap-1">
                    <Fingerprint className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">ID: {currentUser.id}</span>
                  </p>
                </div>
              </Link>

              <button
                onClick={() => dispatch(logoutUser())}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-panel text-xs font-bold text-rose-400 hover:bg-rose-600/20 transition-all border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => dispatch(setAuthModalOpen({ open: true, mode: 'login' }))}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-xs font-bold text-white shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          <div className="px-2 py-1 text-[10px] text-slate-400 text-center space-y-0.5">
            <p className="font-bold text-amber-400">Created by Pallapu Dileep Kumar</p>
            <p>© 2026 INSTELLO</p>
          </div>
        </div>
      </aside>

      {/* Settings Modal Hub */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
