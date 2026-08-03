'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Repeat2, Bookmark, CheckCircle2, MoreHorizontal, Share2, Volume2, VolumeX, Play, Pause, Star, Crown, ShieldAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addPost } from '@/store/feedSlice';

export function PostCard({ post }: { post: any }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.feed.currentUser);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isReposted, setIsReposted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    if (!isReposted) {
      const repostedPost = {
        id: `repost-${Date.now()}`,
        author: {
          id: currentUser?.id || 'u-me',
          username: currentUser?.username || 'you_user',
          fullName: currentUser?.fullName || 'You',
          avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
        type: post.type,
        caption: `🔁 Reposted from @${post.author.username}: "${post.caption}"`,
        media: post.media,
        likesCount: 1,
        commentsCount: 0,
        repostsCount: 1,
        createdAt: 'Just now',
      };
      dispatch(addPost(repostedPost));
    }
  };

  // STRICT FOUNDER AUTHOR CHECK: ONLY AND EXCLUSIVELY dileepkumarpallapu07@gmail.com
  const isFounderAuthor = post.author?.username?.toLowerCase() === 'dileepkumarpallapu07@gmail.com';

  return (
    <article className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xl space-y-4 transition-all hover:border-white/20">
      
      {/* Post Author Header */}
      <div className="flex items-center justify-between">
        <Link href={`/profile/${encodeURIComponent(post.author.username)}`} className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={post.author.avatarUrl}
              alt="Avatar"
              className={`w-11 h-11 rounded-full object-cover border-2 shadow-md group-hover:scale-105 transition-transform ${
                post.isCloseFriends
                  ? 'border-emerald-400 ring-2 ring-emerald-400/50'
                  : isFounderAuthor
                  ? 'border-amber-400 ring-2 ring-amber-500/60'
                  : 'border-rose-500/60'
              }`}
            />
            {post.isCloseFriends && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] px-1 py-0.2 rounded-full font-bold">⭐</span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>{post.author.fullName}</span>
                {isFounderAuthor && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              </h3>
              
              {post.author.isVerified && <CheckCircle2 className="w-4 h-4 text-[#0095F6] fill-[#0095F6]/20" />}
              
              {/* FOUNDER & ARCHITECT BADGE - EXCLUSIVELY FOR dileepkumarpallapu07@gmail.com */}
              {isFounderAuthor && (
                <span className="px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-wider border border-amber-400/40 flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-300" />
                  <span>FOUNDER & ARCHITECT 👑</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-rose-400 font-semibold">@{post.author.username} • {post.createdAt}</p>
          </div>
        </Link>

        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Caption */}
      <p className="text-xs text-slate-100 leading-relaxed font-medium">{post.caption}</p>

      {/* Media Attachments */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-2xl overflow-hidden glass-panel border border-white/10 relative group">
          {post.media[0].mediaType === 'audio' ? (
            <div className="p-4 bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-pink-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all"
                >
                  {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-white">Instello High-Clarity Audio Reel</p>
                  <p className="text-[10px] text-slate-300">45 Seconds • Spatial Frequency Stream</p>
                </div>
              </div>

              {/* Equalizer Visualizer */}
              <div className="flex items-center gap-1 h-6">
                {[40, 80, 50, 90, 30, 70, 100, 60, 40, 80].map((h, i) => (
                  <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-rose-400 animate-pulse' : 'bg-white/20'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          ) : (
            <img
              src={post.media[0].url}
              alt="Post Media"
              className="w-full h-auto max-h-96 object-cover rounded-2xl"
            />
          )}
        </div>
      )}

      {/* Post Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold text-slate-400">
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            isLiked ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 font-extrabold' : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{likesCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount || 0}</span>
        </button>

        {/* Repost Button */}
        <button
          onClick={handleRepost}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            isReposted ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          <Repeat2 className="w-4 h-4" />
          <span>{isReposted ? 'Reposted' : 'Repost'}</span>
        </button>

        {/* Save / Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-full transition-all ${
            isBookmarked ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
        </button>

      </div>

    </article>
  );
}
