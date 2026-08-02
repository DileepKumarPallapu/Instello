'use client';

import React from 'react';
import { Compass, Flame, Radio, MapPin, Search } from 'lucide-react';

export default function ExplorePage() {
  const trendingTopics = [
    { tag: '#SpatialDesign2026', category: 'UI Architecture', posts: '42.8k posts' },
    { tag: '#GenerativeAura', category: 'AI & Synthesis', posts: '28.4k posts' },
    { tag: '#WebAudioLounges', category: 'Live Audio', posts: '19.1k posts' },
    { tag: '#NextJS15AppRouter', category: 'Web Engineering', posts: '15.6k posts' },
  ];

  const exploreGrid = [
    { id: 1, title: 'Spatial Light Synthesis', author: '@alex_creator', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', span: 'col-span-2 row-span-2' },
    { id: 2, title: 'Berlin Studio Lounge', author: '@elena_design', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80', span: 'col-span-1 row-span-1' },
    { id: 3, title: 'Generative Frequencies', author: '@sound_architect', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', span: 'col-span-1 row-span-1' },
    { id: 4, title: 'Futuristic Glassmorphism', author: '@aura_ui', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80', span: 'col-span-2 row-span-1' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/80">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-extrabold text-white">Explore & Discover</h1>
        </div>
        <p className="text-xs text-slate-300">
          Discover trending audio streams, visual art, spatial creators, and nearby real-time events.
        </p>
      </div>

      {/* Trending Topics Carousel Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Trending Hashtags</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {trendingTopics.map((topic, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-indigo-500/50 cursor-pointer group transition-all">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">{topic.category}</span>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mt-0.5">{topic.tag}</h3>
              <p className="text-xs text-slate-400 mt-2">{topic.posts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual & Audio Media Grid Gallery */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Featured Creations</h2>
        <div className="grid grid-cols-3 gap-3">
          {exploreGrid.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 ${item.span} h-48`}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-indigo-300">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
