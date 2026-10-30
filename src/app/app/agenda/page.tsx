'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { StorageService } from '@/services/storage';
import { AgendaService } from '@/services/agendaService';
import { SessionCard } from '@/components/agenda/SessionCard';
import { Session, Speaker, SessionCategory } from '@/types';
import { 
  Calendar, 
  Clock, 
  Bookmark, 
  Filter, 
  MapPin, 
  Radio, 
  X, 
  Compass, 
  Mic, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ProgrammePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [viewOnlyBookmarks, setViewOnlyBookmarks] = useState<boolean>(false);
  const [detailSession, setDetailSession] = useState<Session | null>(null);

  const loadData = () => {
    setSessions(StorageService.getSessions());
    setSpeakers(StorageService.getSpeakers());
    setBookmarkedIds(StorageService.getBookmarkedSessionIds());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, []);

  const handleToggleBookmark = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    AgendaService.toggleBookmark(sessionId);
    setBookmarkedIds(StorageService.getBookmarkedSessionIds());
  };

  const categories = [
    'All',
    'Keynote',
    'Panel Discussion',
    'Deal Room',
    'Pitch Track',
    'Networking Reception',
  ];

  const stages = [
    'All',
    'Main Conclave Hall (Stage A)',
    'Venture Stage (Stage B)',
    'Deal Pod Pavilions',
    'Sky Terrace & Lounge',
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchesDay = s.day === selectedDay;
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || s.stage === selectedStage || s.location.includes(selectedStage);
    const matchesBookmark = !viewOnlyBookmarks || bookmarkedIds.includes(s.id);
    return matchesDay && matchesCategory && matchesStage && matchesBookmark;
  });

  const liveSession = sessions.find((s) => s.day === selectedDay && s.liveStatus === 'live');
  const detailSpeakers = detailSession 
    ? speakers.filter((spk) => detailSession.speakerIds.includes(spk.id))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F5F3EF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8 w-full space-y-5 sm:space-y-6 pb-28 md:pb-12">
        
        {/* Header & Day Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-[#202C3D]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D2B47C] font-semibold">
                Official Programme
              </span>
              {liveSession && (
                <span className="live-pulse-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Session Active
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF] tracking-tight">
              Conclave Schedule &amp; Stage Programme
            </h1>
          </div>

          {/* Segmented Day Switcher & My Schedule Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto">
            <div className="grid grid-cols-2 bg-[#101927] p-1 rounded-xl border border-[#202C3D] w-full sm:w-auto">
              <button
                onClick={() => setSelectedDay(1)}
                className={`flex items-center justify-center px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === 1
                    ? 'bg-[#D2B47C] text-[#080D16] shadow-sm'
                    : 'text-[#91A0B4] hover:text-[#F5F3EF]'
                }`}
              >
                Day 1 (Nov 14)
              </button>
              <button
                onClick={() => setSelectedDay(2)}
                className={`flex items-center justify-center px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === 2
                    ? 'bg-[#D2B47C] text-[#080D16] shadow-sm'
                    : 'text-[#91A0B4] hover:text-[#F5F3EF]'
                }`}
              >
                Day 2 (Nov 15)
              </button>
            </div>

            <button
              onClick={() => setViewOnlyBookmarks(!viewOnlyBookmarks)}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold border transition-all w-full sm:w-auto ${
                viewOnlyBookmarks
                  ? 'bg-[#D2B47C]/15 border-[#D2B47C] text-[#D2B47C]'
                  : 'bg-[#101927] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${viewOnlyBookmarks ? 'fill-[#D2B47C]' : ''}`} />
              <span>My Schedule ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="surface-card p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <span className="text-[#91A0B4] font-mono text-[11px] mr-1 hidden sm:inline shrink-0">Track:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[36px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/40 font-semibold'
                      : 'bg-[#080D16] text-[#91A0B4] hover:text-[#F5F3EF] border border-[#202C3D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stage Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <span className="text-[#91A0B4] font-mono text-[11px] shrink-0">Stage:</span>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full sm:w-auto min-h-[40px] bg-[#080D16] border border-[#202C3D] text-xs text-[#F5F3EF] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D2B47C]/50"
              >
                {stages.map((stg) => (
                  <option key={stg} value={stg} className="bg-[#101927] text-[#F5F3EF]">
                    {stg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chronological Sessions Timeline */}
        <div className="space-y-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                speakers={speakers}
                isBookmarked={bookmarkedIds.includes(session.id)}
                onToggleBookmark={handleToggleBookmark}
                onOpenDetails={(s) => setDetailSession(s)}
              />
            ))
          ) : (
            <div className="surface-card p-12 text-center space-y-3">
              <Calendar className="w-10 h-10 text-[#D2B47C] mx-auto opacity-70" />
              <h3 className="text-lg font-serif font-bold text-[#F5F3EF]">
                No sessions match the selected filters
              </h3>
              <p className="text-xs text-[#91A0B4] max-w-sm mx-auto">
                Try switching between Day 1 and Day 2 or resetting the category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStage('All');
                  setViewOnlyBookmarks(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#D2B47C] font-semibold border border-[#202C3D]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </main>

      {/* ========================================================= */}
      {/* SESSION DETAIL DRAWER / MODAL                             */}
      {/* ========================================================= */}
      {detailSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card-elevated w-full max-w-xl p-5 sm:p-7 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setDetailSession(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
              aria-label="Close session details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 pr-10">
              <span className="font-mono text-xs font-bold text-[#D2B47C] bg-[#101927] px-2.5 py-1 rounded border border-[#202C3D] whitespace-nowrap">
                {detailSession.startTime} – {detailSession.endTime}
              </span>

              <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-[#91A0B4] whitespace-nowrap">
                {detailSession.category}
              </span>

              {detailSession.liveStatus === 'live' && (
                <span className="live-pulse-badge whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Now
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F3EF] leading-snug">
                {detailSession.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#91A0B4] leading-relaxed font-light">
                {detailSession.description}
              </p>
            </div>

            {/* Stage Location Card */}
            <div className="p-3.5 rounded-xl bg-[#101927] border border-[#202C3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-[#D2B47C]/10 text-[#D2B47C] shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#F5F3EF] truncate">
                    {detailSession.stage || detailSession.location}
                  </div>
                  <div className="text-[11px] text-[#91A0B4] truncate">
                    {detailSession.floor || 'Level 1'} • Cyber Convention Centre
                  </div>
                </div>
              </div>

              <Link
                href={`/app/venue?highlight=${encodeURIComponent(detailSession.stage || detailSession.location)}`}
                onClick={() => setDetailSession(null)}
                className="min-h-[40px] px-3.5 py-2 rounded-lg champagne-btn text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Navigate to Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Speakers List */}
            {detailSpeakers.length > 0 && (
              <div className="space-y-2.5 border-t border-[#202C3D] pt-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#D2B47C] font-semibold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Featured Panellists &amp; Speakers ({detailSpeakers.length})</span>
                </div>

                <div className="space-y-2">
                  {detailSpeakers.map((spk) => (
                    <div
                      key={spk.id}
                      className="p-3 rounded-xl bg-[#101927] border border-[#202C3D] flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D2B47C]/40 shrink-0 bg-[#152235]">
                        <img
                          src={spk.imageUrl || spk.avatarUrl}
                          alt={spk.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#F5F3EF] truncate">
                          {spk.name}
                        </div>
                        <div className="text-[11px] text-[#91A0B4] truncate">
                          {spk.designation || spk.title} • {spk.organization}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-[#202C3D] flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleToggleBookmark(detailSession.id, e)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  bookmarkedIds.includes(detailSession.id)
                    ? 'bg-[#D2B47C]/15 border-[#D2B47C] text-[#D2B47C]'
                    : 'bg-[#101927] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(detailSession.id) ? 'fill-[#D2B47C]' : ''}`} />
                <span>{bookmarkedIds.includes(detailSession.id) ? 'In My Schedule' : 'Add to My Schedule'}</span>
              </button>

              <button
                onClick={() => setDetailSession(null)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#F5F3EF] border border-[#202C3D] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
