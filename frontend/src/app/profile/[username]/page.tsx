'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, MapPin, Link as LinkIcon, Sparkles, Pin, Edit3, LogOut, Camera, Grid, Bookmark, Heart, MessageSquare, Film, Music, Play, Pause, Plus, Archive, Fingerprint, Crown, Flame, ShieldAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditProfileModalOpen, setAuthModalOpen, logoutUser } from '@/store/feedSlice';
import { PostCard } from '@/components/feed/PostCard';
import { api } from '@/lib/api';

// Helper to look up any registered user from local device storage
const findUserFromDeviceStore = (targetUsername: string) => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aura_registered_accounts');
      if (saved) {
        const accounts = JSON.parse(saved);
        const key = targetUsername.toLowerCase();
        if (accounts[key]) {
          return accounts[key];
        }
        // Match partial or email
        const found = Object.values(accounts).find(
          (acc: any) => acc.username?.toLowerCase() === key || acc.email?.toLowerCase() === key
        );
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.feed.currentUser);
  const allPosts = useSelector((state: RootState) => state.feed.posts);

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'liked' | 'comments' | 'archive'>('posts');
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [rawUsername, setRawUsername] = useState<string>('');
  const [isFollowingFounder, setIsFollowingFounder] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [highlights, setHighlights] = useState([
    { id: 'h-1', title: '✈️ Travels', avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80' },
    { id: 'h-2', title: '🎧 Beats', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80' },
    { id: 'h-3', title: '✨ Design', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' },
    { id: 'h-4', title: '🔥 Moments', avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80' },
  ]);

  useEffect(() => {
    params.then((p) => {
      if (p?.username) {
        const decoded = decodeURIComponent(p.username);
        setRawUsername(decoded);
        fetchProfile(decoded);
      }
    });
  }, [currentUser]);

  const fetchProfile = async (uname: string) => {
    try {
      const res = await api.get(`/users/profile/${encodeURIComponent(uname)}`);
      if (res.data?.data) {
        setProfileData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cleanUsername = rawUsername || currentUser?.username || 'user';
  const isOwnProfile = currentUser && currentUser.username.toLowerCase() === cleanUsername.toLowerCase();

  // Query device storage for target user
  const targetDeviceUser = findUserFromDeviceStore(cleanUsername);

  // STRICT FOUNDER ACCOUNT CHECK: ONLY AND EXCLUSIVELY dileepkumarpallapu07@gmail.com
  const isFounderAccount = cleanUsername.toLowerCase() === 'dileepkumarpallapu07@gmail.com';

  // Dynamic user identity resolution for ALL users
  const displayFullName = isOwnProfile && currentUser?.fullName
    ? currentUser.fullName
    : (targetDeviceUser?.fullName || profileData?.user?.fullName || cleanUsername.split('@')[0].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

  const uniqueUserId = isOwnProfile && currentUser?.id
    ? currentUser.id
    : (targetDeviceUser?.id || profileData?.user?.id || `USR-${Math.abs(cleanUsername.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))}`);

  const userAvatar = isOwnProfile && currentUser?.avatarUrl
    ? currentUser.avatarUrl
    : (targetDeviceUser?.avatarUrl || profileData?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`);

  const userRole = isFounderAccount 
    ? 'FOUNDER & ARCHITECT' 
    : (isOwnProfile && currentUser?.role ? currentUser.role : (targetDeviceUser?.role || profileData?.user?.role || 'USER'));

  const user = {
    id: uniqueUserId,
    username: cleanUsername,
    fullName: displayFullName,
    role: userRole,
    isVerified: isFounderAccount || (isOwnProfile && currentUser?.isVerified) || (targetDeviceUser?.isVerified) || false,
    avatarUrl: userAvatar,
  };

  const profile = profileData?.profile || {
    bio: isFounderAccount
      ? 'Lead Creator, Chief Architect & Founder of Instello. ⚡'
      : (isOwnProfile ? 'Building the next evolution of social media on Instello. ⚡' : `Welcome to @${user.username}'s space on Instello.`),
    avatarUrl: user.avatarUrl,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    website: 'https://instello.app/' + user.username,
    location: 'Global Community',
    skills: isFounderAccount ? ['Instello Founder', 'Digital Arts', 'Spatial Web'] : ['Instello Creator', 'Digital Arts'],
  };

  // Toggle Live Audio Playback
  const handleToggleSong = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3');
    }

    if (isPlayingSong) {
      audioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingSong(true)).catch(() => setIsPlayingSong(true));
    }
  };

  const userPosts = allPosts.filter((p: any) => p.author?.username?.toLowerCase() === cleanUsername.toLowerCase());
  const userReels = allPosts.filter((p: any) => p.type === 'AUDIO' || p.type === 'VIDEO');
  const savedReels = allPosts.slice(0, 2);
  const likedPosts = allPosts;

  return (
    <div className="space-y-6">
      
      {/* Profile Header Container */}
      <div className="glass-panel rounded-3xl overflow-hidden relative shadow-2xl">
        
        {/* Cover Banner */}
        <div className="h-44 w-full relative">
          <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
        </div>

        {/* Profile Info Bar */}
        <div className="p-6 relative -mt-16 pt-0 space-y-4">
          <div className="flex items-end justify-between">
            <div className="relative group cursor-pointer" onClick={() => isOwnProfile && dispatch(setEditProfileModalOpen(true))}>
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className={`w-24 h-24 rounded-full object-cover border-4 border-black shadow-lg group-hover:scale-105 transition-transform ${
                  isFounderAccount ? 'ring-4 ring-amber-500/80' : 'ring-4 ring-rose-500/50'
                }`}
              />
              {isOwnProfile && (
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-rose-600 text-white shadow-md">
                  <Camera className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Edit Profile / Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => dispatch(setEditProfileModalOpen(true))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg hover:scale-105 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-pill text-rose-400 hover:bg-rose-600/20 text-xs font-bold transition-all border border-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsFollowingFounder(!isFollowingFounder)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all ${
                    isFollowingFounder
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFollowingFounder ? 'Following (Default)' : `Follow @${user.username}`}</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-1.5">
                <span>{user.fullName}</span>
                {isFounderAccount && <Crown className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />}
              </h1>

              {user.isVerified && <CheckCircle2 className="w-5 h-5 text-[#0095F6] fill-[#0095F6]/20" />}
              
              {/* FOUNDER & ARCHITECT TAG - EXCLUSIVELY FOR dileepkumarpallapu07@gmail.com */}
              {isFounderAccount ? (
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-[10px] font-black tracking-wider uppercase border border-amber-400/50 shadow-neon flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>FOUNDER & ARCHITECT 👑</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  {user.role}
                </span>
              )}

              {/* Explicit Unique User ID Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                <Fingerprint className="w-3 h-3 text-indigo-400" />
                <span>ID: {user.id}</span>
              </span>
            </div>

            <p className="text-xs text-rose-400 font-bold mt-1">@{user.username}</p>
          </div>

          {/* Profile Song / Audio Track Bar with Live Audio */}
          <div className="p-3.5 rounded-2xl glass-panel border border-indigo-500/40 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-pink-950/40 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSong}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-neon hover:scale-105 transition-all"
              >
                {isPlayingSong ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Atmospheric Synth Ambient 80s
                </p>
                <p className="text-[10px] text-slate-300">Profile Theme Song • Instello Audio Frequencies</p>
              </div>
            </div>
            <div className="flex items-center gap-1 h-5">
              {[40, 70, 30, 90, 60, 40, 80, 50, 90, 100, 60].map((h, i) => (
                <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlayingSong ? 'bg-gradient-to-t from-indigo-400 to-rose-400 animate-pulse' : 'bg-white/20'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-xl">{profile.bio}</p>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" className="flex items-center gap-1 text-purple-300 hover:underline">
                <LinkIcon className="w-3.5 h-3.5" /> {profile.website}
              </a>
            )}
          </div>

          {/* Story Highlights Bar */}
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Story Highlights</h4>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
              
              {/* Add Highlight */}
              {isOwnProfile && (
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white group-hover:border-rose-500 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">New</span>
                </div>
              )}

              {/* Highlights Items */}
              {highlights.map((h) => (
                <div key={h.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-14 h-14 rounded-full p-0.5 border-2 border-rose-500/60 group-hover:scale-105 transition-transform">
                    <img src={h.avatar} alt="Highlight" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold">{h.title}</span>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>

      {/* Profile Navigation Activity Tabs */}
      <div className="flex items-center justify-around border-t border-b border-white/10 py-3 text-xs font-bold text-slate-400 overflow-x-auto no-scrollbar">
        {[
          { id: 'posts', label: 'POSTS', icon: Grid },
          { id: 'reels', label: 'REELS', icon: Film },
          { id: 'saved', label: 'SAVED REELS', icon: Bookmark },
          { id: 'liked', label: 'LIKES', icon: Heart },
          { id: 'comments', label: 'COMMENTS', icon: MessageSquare },
          { id: 'archive', label: 'ARCHIVE', icon: Archive },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 whitespace-nowrap px-2 ${
                isActive ? 'text-white border-rose-500 font-extrabold' : 'border-transparent hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          <div>
            {userPosts.length > 0 ? (
              userPosts.map((post: any) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-8 glass-panel rounded-2xl">
                <Grid className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No published posts yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 gap-3">
            {userReels.map((reel: any) => (
              <div key={reel.id} className="relative h-64 rounded-2xl overflow-hidden glass-panel group cursor-pointer border border-white/10">
                <img src={reel.media?.[0]?.url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'} alt="Reel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white line-clamp-1">{reel.caption}</span>
                  <span className="text-[10px] text-rose-400 flex items-center gap-1">
                    <Film className="w-3 h-3" /> Audio Reel Stream
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Bookmark className="w-4 h-4" /> Your Saved Reels & Bookmarks Collection
            </p>
            {savedReels.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-pink-500 flex items-center gap-1">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" /> Posts & Creations You Liked
            </p>
            {likedPosts.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="glass-panel p-6 rounded-3xl text-center space-y-2 border border-white/10">
            <Archive className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Archived Posts & Stories</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Only you can see your archived posts and past stories.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
