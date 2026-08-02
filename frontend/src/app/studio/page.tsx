'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Eye, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

export default function StudioPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/creator');
      if (res.data?.data) {
        setAnalytics(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const overview = analytics?.overview || {
    totalReach: 489000,
    reachGrowth: '+24.5%',
    monthlyViews: 142500,
    viewsGrowth: '+18.2%',
    subscriberCount: 384,
    monthlyRevenue: 3836.16,
  };

  const chart = analytics?.impressionsChart || [
    { day: 'Mon', views: 14200 },
    { day: 'Tue', views: 18900 },
    { day: 'Wed', views: 22400 },
    { day: 'Thu', views: 19800 },
    { day: 'Fri', views: 27600 },
    { day: 'Sat', views: 31200 },
    { day: 'Sun', views: 28400 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-950/80">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-extrabold text-white">Creator Studio & Insights</h1>
        </div>
        <p className="text-xs text-slate-300">
          Professional audience metrics, daily impressions reach, subscriber revenue, and AI studio.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-400">{overview.reachGrowth}</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">{overview.totalReach.toLocaleString()}</h3>
          <p className="text-xs text-slate-400">Total Reach</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-400">{overview.viewsGrowth}</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">{overview.monthlyViews.toLocaleString()}</h3>
          <p className="text-xs text-slate-400">Monthly Impressions</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-pink-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold text-indigo-400">+12 this week</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">{overview.subscriberCount}</h3>
          <p className="text-xs text-slate-400">VIP Subscribers</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-400">Active</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">${overview.monthlyRevenue.toLocaleString()}</h3>
          <p className="text-xs text-slate-400">Monthly Earnings</p>
        </div>
      </div>

      {/* Analytics Impressions Visualizer Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white">Daily Impressions Stream</h3>
        <div className="flex items-end gap-3 h-48 pt-4">
          {chart.map((item: any, idx: number) => {
            const heightPct = Math.round((item.views / 35000) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-indigo-600 via-purple-600 to-pink-500 group-hover:scale-105 transition-all duration-300 shadow-neon"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[11px] font-semibold text-slate-400">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
