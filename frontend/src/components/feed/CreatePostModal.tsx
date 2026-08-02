'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Mic, BarChart2, Sparkles, Calendar, MapPin, Send, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCreateModalOpen, addPost } from '@/store/feedSlice';
import { api } from '@/lib/api';

export function CreatePostModal() {
  const dispatch = useDispatch();
  const { isCreateModalOpen: isOpen, currentUser } = useSelector((state: RootState) => state.feed);

  const [activeType, setActiveType] = useState<'TEXT' | 'PHOTO' | 'AUDIO' | 'POLL'>('TEXT');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAiCaption = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.post('/ai/caption', { topic: caption || 'Modern Web Engineering', tone: 'creative' });
      if (res.data?.data?.caption) {
        setCaption(res.data.data.caption);
      }
    } catch (e) {
      setCaption('Exploring the frontiers of creative engineering & ambient UI design. ✨ #AuraNext #GenerativeAI');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const author = currentUser || {
      id: 'u-1',
      username: 'alex_creator',
      fullName: 'Alex Vance',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };

    const postPayload = {
      authorId: author.id,
      type: activeType,
      caption,
      location: 'San Francisco, CA',
      media: mediaUrl ? [{ url: mediaUrl, mediaType: 'image' }] : undefined,
      poll: activeType === 'POLL' ? { question: pollQuestion, options: pollOptions } : undefined,
    };

    try {
      const res = await api.post('/posts', postPayload);
      if (res.data?.data) {
        dispatch(addPost({
          ...res.data.data,
          author,
        }));
      }
    } catch (err) {
      // Fallback instant dispatch
      dispatch(addPost({
        id: `post-${Date.now()}`,
        authorId: author.id,
        type: activeType,
        caption,
        location: 'San Francisco, CA',
        likesCount: 1,
        commentsCount: 0,
        repostsCount: 0,
        viewsCount: 1,
        createdAt: new Date().toISOString(),
        media: mediaUrl ? [{ url: mediaUrl, mediaType: 'image' }] : undefined,
        poll: activeType === 'POLL' ? { question: pollQuestion, totalVotes: 0, options: pollOptions.map((text, idx) => ({ id: `opt-${idx+1}`, text, voteCount: 0 })) } : undefined,
        author,
      }));
    } finally {
      setIsSubmitting(false);
      dispatch(setCreateModalOpen(false));
      setCaption('');
      setMediaUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Create Aura Post</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Posting as @{currentUser?.username || 'alex_creator'}
            </span>
          </h2>
          <button
            onClick={() => dispatch(setCreateModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="flex items-center gap-1 mb-4 p-1 glass-pill rounded-2xl">
          {[
            { id: 'TEXT', label: 'Story & Text', icon: Sparkles },
            { id: 'PHOTO', label: 'Photo/Video', icon: ImageIcon },
            { id: 'AUDIO', label: 'Voice Note', icon: Mic },
            { id: 'POLL', label: 'Live Poll', icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-neon'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Post Content Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              placeholder="What creative frequency are you tuning into today?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full glass-input p-4 rounded-2xl text-xs resize-none focus:ring-2 ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAiCaption}
              disabled={isGeneratingAi}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-bold shadow-pinkNeon hover:scale-105 transition-all"
            >
              {isGeneratingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
              <span>AI Suggest</span>
            </button>
          </div>

          {/* Type Specific Fields: Photo URL */}
          {activeType === 'PHOTO' && (
            <input
              type="url"
              placeholder="Paste image or thumbnail URL (e.g. Unsplash image URL)..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            />
          )}

          {/* Type Specific Fields: Poll Options */}
          {activeType === 'POLL' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Poll question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full glass-input px-4 py-2 rounded-xl text-xs font-semibold"
              />
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const copy = [...pollOptions];
                    copy[idx] = e.target.value;
                    setPollOptions(copy);
                  }}
                  className="w-full glass-input px-4 py-2 rounded-xl text-xs"
                />
              ))}
            </div>
          )}

          {/* Action Tools & Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-slate-400">
              <button type="button" className="p-1.5 rounded-full hover:bg-white/10 hover:text-indigo-400 transition-colors">
                <MapPin className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-white/10 hover:text-purple-400 transition-colors">
                <Calendar className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => dispatch(setCreateModalOpen(false))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xs font-bold shadow-neon hover:scale-105 active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Publish</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
