'use client';

import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, ShieldCheck, Lock, CheckCheck, Plus, Sparkles, X, Trash2, Paperclip, Image as ImageIcon, Film, Music, FileText, UserCheck, MapPin, UserPlus, Heart, Mic, Search, Crown, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setVideoCallActive } from '@/store/feedSlice';
import { io } from 'socket.io-client';

const songTracks = [
  { id: 't-1', title: 'Sunset Chill Frequencies', duration: '0:30' },
  { id: 't-2', title: 'Cyberpunk Synth Pulse', duration: '0:45' },
  { id: 't-3', title: 'Lo-Fi Ambient Beats', duration: '0:35' },
];

const initialSuggestedFriends = [
  {
    id: 'f-1',
    name: 'Pallapu Dileep Kumar',
    username: 'dileepkumarpallapu07@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    isFounder: true,
    isFollowing: true,
  },
  {
    id: 'f-2',
    name: 'Elena Rostova',
    username: 'elena_design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    isFounder: false,
    isFollowing: true,
  },
  {
    id: 'f-3',
    name: 'Alex Vance',
    username: 'alex_creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isFounder: false,
    isFollowing: false,
  },
];

export default function MessagesPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.feed.currentUser);

  const [notes, setNotes] = useState<any[]>([
    {
      id: 'note-1',
      username: 'dileepkumarpallapu07@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: 'Building Instello Messenger ⚡',
      song: 'Sunset Chill Frequencies',
      isMine: false,
      isFounder: true,
    },
    {
      id: 'note-2',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Encrypted P2P Audio Chat active ✨',
      song: 'Cyberpunk Synth Pulse',
      isMine: false,
    },
  ]);

  const [myNoteText, setMyNoteText] = useState('');
  const [selectedNoteSong, setSelectedNoteSong] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAttachmentDrawerOpen, setIsAttachmentDrawerOpen] = useState(false);
  const [isAddFriendsModalOpen, setIsAddFriendsModalOpen] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendsList, setFriendsList] = useState(initialSuggestedFriends);

  const [activeChat, setActiveChat] = useState({
    id: 'group-1',
    name: 'Elena Rostova',
    username: 'elena_design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
  });

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm-1',
      senderId: 'u-2',
      content: 'Hey! Ready for the encrypted Instello live messenger audio session today?',
      liked: false,
      createdAt: '10:42 AM',
    },
    {
      id: 'm-2',
      senderId: currentUser?.id || 'u-1',
      content: 'Yes! WebRTC P2P encrypted channel active. Sent you a voice audio note. 🚀',
      liked: true,
      createdAt: '10:45 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.emit('chat:join_room', { roomId: activeChat.id });

    socket.on('chat:new_message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChat.id]);

  const handleShareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myNoteText.trim()) return;

    const newNote = {
      id: `note-mine`,
      username: currentUser?.username || 'you_user',
      avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: myNoteText,
      song: selectedNoteSong,
      isMine: true,
    };

    setNotes([newNote, ...notes.filter(n => !n.isMine)]);
    setMyNoteText('');
    setSelectedNoteSong(null);
    setIsNoteModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'u-1',
      content: inputText,
      type: 'TEXT',
      liked: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  // Toggle Like / Heart on Message
  const handleToggleLikeMessage = (msgId: string) => {
    setMessages(messages.map(m => m.id === msgId ? { ...m, liked: !m.liked } : m));
  };

  // Send Voice Note Handler
  const handleSendVoiceNote = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      const newMsg = {
        id: `msg-voice-${Date.now()}`,
        senderId: currentUser?.id || 'u-1',
        type: 'VOICE',
        duration: '0:14',
        content: 'Voice Audio Note 🎙️',
        liked: false,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setIsRecordingVoice(false);
    }, 1200);
  };

  // Attach Media Items
  const handleAttachMedia = (type: string, payload: any) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'u-1',
      type,
      ...payload,
      liked: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setIsAttachmentDrawerOpen(false);
  };

  // Upload Local File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (type === 'PHOTO') {
            handleAttachMedia('PHOTO', { mediaUrl: reader.result, content: `Shared Photo: ${file.name}` });
          } else {
            handleAttachMedia('FILE', { fileName: file.name, fileSize: `${(file.size / 1024).toFixed(1)} KB`, content: `Shared Document: ${file.name}` });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Friend Follow Status
  const handleToggleFollowFriend = (friendId: string) => {
    setFriendsList(friendsList.map(f => f.id === friendId ? { ...f, isFollowing: !f.isFollowing } : f));
  };

  const filteredFriends = friendsList.filter(f =>
    f.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-7.5rem)] glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row relative">
      
      {/* Left Contacts & Insta Notes Section */}
      <div className="w-full md:w-1/3 border-r border-white/10 p-4 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Header with Add Friends Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Messages & Friends</h2>
            
            <button
              onClick={() => setIsAddFriendsModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friends</span>
            </button>
          </div>

          {/* 24-Hour Insta Notes Bubble Bar */}
          <div className="glass-panel p-3 rounded-2xl overflow-x-auto no-scrollbar flex items-center gap-3">
            
            {/* Share Your Insta Note Button */}
            <div
              onClick={() => setIsNoteModalOpen(true)}
              className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer group"
            >
              <div className="relative w-12 h-12 rounded-full border border-white/20 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Your Note"
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
                  + Note
                </div>
              </div>
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-[60px]">Share Note</span>
            </div>

            {/* Friend 24h Thought Bubbles with Song Badge */}
            {notes.map((n) => (
              <div key={n.id} className="flex flex-col items-center gap-1 min-w-[65px] relative group cursor-pointer">
                
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg max-w-[90px] truncate flex items-center gap-1">
                  {n.song && <Music className="w-2.5 h-2.5 text-amber-300 animate-spin" />}
                  <span>{n.text}</span>
                  {n.isMine && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(n.id);
                      }}
                      className="text-rose-400 hover:text-rose-300 ml-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <img
                  src={n.avatar}
                  alt="Note Avatar"
                  className={`w-12 h-12 rounded-full object-cover border mt-2 group-hover:scale-105 transition-transform ${
                    n.isFounder ? 'border-amber-400 ring-2 ring-amber-500/40' : 'border-white/20'
                  }`}
                />
                <span className="text-[10px] text-slate-300 font-medium truncate max-w-[60px]">
                  @{n.username}
                </span>
              </div>
            ))}

          </div>

          {/* Active Chats & Followed Friends List */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Direct Chats & Friends</p>
            
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setActiveChat({
                  id: friend.id,
                  name: friend.name,
                  username: friend.username,
                  avatar: friend.avatar,
                  isOnline: true,
                })}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  activeChat.id === friend.id
                    ? 'bg-indigo-600/20 border border-indigo-500/30'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
                    <span>{friend.name}</span>
                    {friend.isFounder && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">@{friend.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Main Active Messenger Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-black/20">
        
        {/* Active Chat Security Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between glass-pill">
          <div className="flex items-center gap-3">
            <img
              src={activeChat.avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xs font-bold text-slate-100">{activeChat.name}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> End-to-End Encrypted (Signal Protocol 256-bit)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setVideoCallActive({ active: true, user: activeChat }))}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setVideoCallActive({ active: true, user: activeChat }))}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-purple-400 transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed with Like Message Reactions */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === (currentUser?.id || 'u-1');
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl text-xs leading-relaxed space-y-2 relative ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-br-none shadow-lg'
                      : 'glass-panel text-slate-100 rounded-bl-none'
                  }`}
                >
                  {/* Text Content */}
                  {msg.content && <p>{msg.content}</p>}

                  {/* Voice Note Attachment */}
                  {msg.type === 'VOICE' && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/20">
                      <Mic className="w-5 h-5 text-rose-400 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">Voice Audio Note</p>
                        <div className="flex items-center gap-1 h-3 mt-1">
                          {[30, 80, 50, 90, 40, 70, 60, 100].map((h, i) => (
                            <div key={i} className="w-1 bg-rose-400 rounded-full" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-300">{msg.duration}</span>
                    </div>
                  )}

                  {/* Photo Attachment */}
                  {msg.type === 'PHOTO' && msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="Shared Photo" className="w-full rounded-xl object-cover border border-white/20" />
                  )}

                  {/* Video Attachment */}
                  {msg.type === 'VIDEO' && (
                    <div className="relative rounded-xl overflow-hidden border border-white/20 p-2 bg-black/40 flex items-center gap-2">
                      <Film className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-xs font-bold text-white">{msg.title || 'Video Clip'}</p>
                        <p className="text-[9px] text-slate-300">HD Stream • 1080p</p>
                      </div>
                    </div>
                  )}

                  {/* Like Reaction Badge */}
                  {msg.liked && (
                    <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg border border-black animate-in zoom-in duration-150">
                      <Heart className="w-3 h-3 fill-white" />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                    <span className="text-[9px] opacity-70">{msg.createdAt}</span>
                    
                    {/* Double-tap / Click Heart to Like Message */}
                    <button
                      onClick={() => handleToggleLikeMessage(msg.id)}
                      className={`text-[10px] hover:scale-110 transition-transform ${msg.liked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                      title="Like Message"
                    >
                      <Heart className={`w-3.5 h-3.5 inline ${msg.liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Encrypted Input & Attachment Composer */}
        <div className="p-3 border-t border-white/10 relative">
          
          {/* Multi-Media Drawer */}
          {isAttachmentDrawerOpen && (
            <div className="absolute bottom-16 left-3 bg-[#121212] glass-panel rounded-3xl p-3 border border-white/20 shadow-2xl grid grid-cols-3 gap-2 w-72 z-50 animate-in fade-in duration-150">
              <label className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors text-indigo-400">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[10px] font-bold text-slate-200">Photo</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'PHOTO')} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => handleAttachMedia('VIDEO', { title: 'High Clarity HD Video Clip', content: 'Shared HD Video Reel Clip 🎥' })}
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/10 transition-colors text-purple-400"
              >
                <Film className="w-5 h-5" />
                <span className="text-[10px] font-bold text-slate-200">Video</span>
              </button>

              <button
                type="button"
                onClick={() => handleAttachMedia('SONG', { title: 'Atmospheric Synth Frequency', content: 'Shared Profile Audio Track 🎵' })}
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/10 transition-colors text-amber-400"
              >
                <Music className="w-5 h-5" />
                <span className="text-[10px] font-bold text-slate-200">Song</span>
              </button>

              <label className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors text-emerald-400">
                <FileText className="w-5 h-5" />
                <span className="text-[10px] font-bold text-slate-200">File</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'FILE')} className="hidden" />
              </label>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAttachmentDrawerOpen(!isAttachmentDrawerOpen)}
              className="p-2.5 rounded-full glass-pill hover:bg-white/10 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Note Button */}
            <button
              type="button"
              onClick={handleSendVoiceNote}
              disabled={isRecordingVoice}
              className={`p-2.5 rounded-full transition-all ${
                isRecordingVoice
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'glass-pill text-slate-300 hover:text-rose-400 hover:bg-white/10'
              }`}
              title="Send Voice Audio Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type encrypted message or double-tap message to like..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 glass-input px-4 py-2.5 rounded-full text-xs"
            />

            <button
              type="submit"
              className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Add Friends / Search Creators Modal */}
      {isAddFriendsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-rose-400" />
                <span>Add Friends & Follow Creators</span>
              </h3>
              <button onClick={() => setIsAddFriendsModalOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by User ID, name, or handle..."
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs"
              />
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{friend.name}</span>
                        {friend.isFounder && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </p>
                      <p className="text-[10px] text-slate-400">@{friend.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFollowFriend(friend.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      friend.isFollowing
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                    }`}
                  >
                    {friend.isFollowing ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{friend.isFollowing ? 'Following' : 'Follow & Add'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Share a 24h Insta Note with Song</span>
              </h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleShareNote} className="space-y-4">
              <input
                type="text"
                maxLength={60}
                required
                placeholder="Share what's on your mind..."
                value={myNoteText}
                onChange={(e) => setMyNoteText(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-medium"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg"
              >
                Share Note
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
