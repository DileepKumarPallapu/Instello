'use client';

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Ban, UserCheck, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      if (res.data?.data) {
        setReports(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (repId: string, action: 'ban' | 'verify') => {
    setReports(reports.filter(r => r.id !== repId));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/30 bg-gradient-to-r from-rose-950/60 via-purple-950/40 to-slate-950/80">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-6 h-6 text-rose-400" />
          <h1 className="text-xl font-extrabold text-white">Admin Moderation & Governance</h1>
        </div>
        <p className="text-xs text-slate-300">
          Content safety queue, spam filter reports, verification requests, and account security enforcement.
        </p>
      </div>

      {/* Reports Queue List */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Active Moderation Queue</span>
        </h3>

        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-4 rounded-2xl glass-pill flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-400">Reported: @{report.reportedUsername}</span>
                  <span className="text-[10px] text-slate-400">by @{report.reporterUsername}</span>
                </div>
                <p className="text-xs text-slate-200 mt-1">{report.reason}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(report.id, 'verify')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1 transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Dismiss
                </button>
                <button
                  onClick={() => handleAction(report.id, 'ban')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-neon flex items-center gap-1 transition-all"
                >
                  <Ban className="w-3.5 h-3.5" /> Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
