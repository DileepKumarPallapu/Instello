'use client';

import React, { useState } from 'react';
import { Compass, Flame, Radio, Sparkles, TrendingUp, Users, Heart, MessageSquare, Repeat2, Bookmark, Star, ShieldCheck, Crown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setActiveTab } from '@/store/feedSlice';
import { PostCard } from '@/components/feed/PostCard';
import { CreateStoryModal } from '@/components/feed/CreateStoryModal';

export default function Home() {
  const dispatch = useDispatch();
  const { activeTab, posts: reduxPosts } = useSelector((state: RootState) => state.feed);

  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  // Instello Stories Bar (Featuring Founder & Instello Official)
  const stories = [
    {
      id: 'story-mine',
      username: 'Your Story',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hasStory: false,
      isCloseFriends: false,
    },
    {
      id: 'story-founder',
      username: 'dileepkumarpallapu07@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      hasStory: true,
      isCloseFriends: true,
      isFounder: true,
    },
    {
      id: 'story-instello',
      username: 'instello_official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      hasStory: true,
      isCloseFriends: false,
      isFounder: true,
    },
    {
      id: 'story-elena',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      hasStory: true,
      isCloseFriends: false,
    },
  ];

  // Default Instello Feed Posts
  const defaultPosts = [
    {
      id: 'post-founder-1',
      author: {
        id: 'u-founder',
        username: 'dileepkumarpallapu07@gmail.com',
        fullName: 'Pallapu Dileep Kumar',
        role: 'FOUNDER & ARCHITECT 👑',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      type: 'PHOTO',
      caption: 'Welcome to Instello Platform! Built with Next.js 15, React 19, Express & Socket.io WebRTC Signal Gateway. Managed & Engineered by Founder Pallapu Dileep Kumar. 👑✨ #Instello #Founder',
      location: 'Global Community',
      isPinned: true,
      isCloseFriends: true,
      likesCount: 5420,
      commentsCount: 384,
      repostsCount: 1230,
      viewsCount: 45400,
      createdAt: 'Just now',
      media: [
        {
          id: 'm-founder',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
          mediaType: 'image',
        }
      ]
    },
    {
      id: 'post-instello-official',
      author: {
        id: 'u-instello',
        username: 'instello_official',
        fullName: 'Instello Platform Official',
        role: 'OFFICIAL PLATFORM • MANAGED BY FOUNDER 👑',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      },
      type: 'AUDIO',
      caption: 'Official Instello Audio Frequency Stream. Powered by spatial audio synthesis and high clarity equalizer controls. Created by Pallapu Dileep Kumar 🎧',
      location: 'Instello Spatial Studio',
      isPinned: false,
      isCloseFriends: false,
      likesCount: 3240,
      commentsCount: 192,
      repostsCount: 540,
      viewsCount: 28900,
      createdAt: '1h ago',
      media: [
        {
          id: 'm-instello-audio',
          url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          mediaType: 'audio',
          durationSeconds: 45,
        }
      ]
    },
    {
      id: 'post-elena-1',
      author: {
        id: 'u-2',
        username: 'elena_design',
        fullName: 'Elena Rostova',
        role: 'CREATOR',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      type: 'PHOTO',
      caption: 'Testing the new Apple Vision Pro Glassmorphism UI layout on Instello Platform! Loving the dark/light mode toggle. ☕',
      location: 'Berlin, Germany',
      isPinned: false,
      isCloseFriends: false,
      likesCount: 1420,
      commentsCount: 89,
      repostsCount: 210,
      viewsCount: 14500,
      createdAt: '3h ago',
      media: [
        {
          id: 'm-elena-1',
          url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80',
          mediaType: 'image',
        }
      ]
    }
  ];

  const postsToDisplay = reduxPosts.length > 0 ? reduxPosts : defaultPosts;

  // Filter Categories
  const filteredPosts = postsToDisplay.filter((post) => {
    if (activeTab === 'close_friends') return post.isCloseFriends;
    if (activeTab === 'reels') return post.type === 'AUDIO' || post.type === 'VIDEO';
    if (activeTab === 'saved_reels') return post.isBookmarked || post.isCloseFriends;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top 24-Hour Stories Bar */}
      <div className="glass-panel p-4 rounded-3xl overflow-x-auto no-scrollbar flex items-center gap-4">
        
        {/* Post Story Creator Button */}
        <div
          onClick={() => setIsCreateStoryOpen(true)}
          className="flex flex-col items-center gap-1.5 cursor-pointer min-w-[70px] group"
        >
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-rose-500/60 p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <img
              src={stories[0].avatar}
              alt="Your Story"
              className="w-full h-full rounded-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[65px]">Post Story</span>
        </div>

        {/* Story Bubbles */}
        {stories.slice(1).map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1.5 cursor-pointer min-w-[70px] group">
            <div
              className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                s.isCloseFriends
                  ? 'ring-2 ring-emerald-400 p-[2px] bg-emerald-500/20'
                  : s.isFounder
                  ? 'ring-2 ring-amber-400 p-[2px] bg-amber-500/20'
                  : 'insta-story-gradient'
              }`}
            >
              <img
                src={s.avatar}
                alt="Story"
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
            <span className="text-[10px] text-slate-300 font-bold truncate max-w-[65px] flex items-center gap-0.5">
              {s.isFounder && <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
              <span>@{s.username.split('@')[0]}</span>
            </span>
          </div>
        ))}

      </div>

      {/* Main Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'recommended', label: 'For You', icon: Sparkles },
          { id: 'close_friends', label: 'Close Friends ⭐', icon: Star, color: 'text-emerald-400' },
          { id: 'saved_reels', label: 'Saved Reels 🔖', icon: Bookmark, color: 'text-amber-400' },
          { id: 'following', label: 'Following', icon: Users },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'reels', label: 'Audio & Reels', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id as any))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
                  : 'glass-panel text-slate-300 hover:bg-white/10 hover:text-white border-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color || ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Post Story Modal */}
      <CreateStoryModal isOpen={isCreateStoryOpen} onClose={() => setIsCreateStoryOpen(false)} />

    </div>
  );
}
