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
  BookmarkCheck, 
  Filter, 
  Sparkles, 
  X,
  MapPin,
  Building2,
  Navigation,
  Layers,
  Radio,
  ExternalLink,
  Mic,
  ArrowRight
} from 'lucide-react';

export default function AgendaPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewOnlyBookmarks, setViewOnlyBookmarks] = useState<boolean>(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

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

  const categories: string[] = [
    'All',
    'Keynote',
    'Panel Discussion',
    'Deal Room',
    'Pitch Track',
    'Networking Reception',
  ];

  // Extract all unique stages
  const stageOptions = [
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

  const liveSession = sessions.find(s => s.liveStatus === 'live');

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1524] via-[#0E1A2E] to-[#12223D] border border-white/[0.08] p-6 md:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC394]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFC394]/10 border border-[#DFC394]/20 text-xs font-semibold text-[#DFC394] uppercase tracking-wider mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>Physical Conclave Programme</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF]">
                Conclave Agenda &amp; Stage Programme
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA6B5] mt-1 max-w-2xl">
                Explore plenary keynotes, sovereign wealth panels, deeptech firesides, and bilateral deal room tracks across all stages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/app/venue"
                className="px-4 py-2.5 rounded-xl bg-[#080E18]/80 hover:bg-[#12223D] border border-[#DFC394]/30 text-xs font-semibold text-[#DFC394] flex items-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Venue &amp; Stage Guide</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter & Day Controls */}
        <div className="rounded-2xl bg-[#0E1A2E]/80 border border-white/[0.08] p-5 space-y-5">
          {/* Top Row: Day Selector + My Schedule Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Day Switcher */}
            <div className="flex items-center gap-2 bg-[#080E18] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setSelectedDay(1)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 1
                    ? 'bg-[#DFC394] text-[#080E18] shadow-sm'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 1 — Saturday, Nov 14
              </button>

              <button
                onClick={() => setSelectedDay(2)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 2
                    ? 'bg-[#DFC394] text-[#080E18] shadow-sm'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 2 — Sunday, Nov 15
              </button>
            </div>

            {/* My Schedule Toggle */}
            <button
              onClick={() => setViewOnlyBookmarks(!viewOnlyBookmarks)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                viewOnlyBookmarks
                  ? 'bg-[#DFC394] text-[#080E18] border-[#DFC394] shadow-sm'
                  : 'bg-[#080E18] text-[#9AA6B5] border-white/10 hover:text-[#F5F3EF]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${viewOnlyBookmarks ? 'fill-[#080E18]' : ''}`} />
              <span>My Schedule ({bookmarkedIds.length})</span>
            </button>
          </div>

          {/* Middle Row: Stage Filters */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-[#DFC394] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Navigation className="w-3 h-3" /> Stages:
            </span>
            {stageOptions.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedStage === stage
                    ? 'bg-[#12223D] text-[#DFC394] border border-[#DFC394]/40 font-semibold'
                    : 'bg-[#080E18]/60 text-[#9AA6B5] hover:text-[#F5F3EF] border border-white/[0.04]'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          {/* Bottom Row: Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-[#7998B8] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Tracks:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#7998B8]/20 text-[#A6C5E8] border border-[#7998B8]/40 font-semibold'
                    : 'bg-[#080E18]/60 text-[#9AA6B5] hover:text-[#F5F3EF] border border-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
            <span>
              Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} for Day {selectedDay}
              {selectedStage !== 'All' ? ` • ${selectedStage}` : ''}
              {selectedCategory !== 'All' ? ` • ${selectedCategory}` : ''}
            </span>
            {viewOnlyBookmarks && (
              <button
                onClick={() => setViewOnlyBookmarks(false)}
                className="text-[#DFC394] hover:underline"
              >
                Show all sessions
              </button>
            )}
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-16 bg-[#0E1A2E]/40 rounded-2xl border border-white/[0.06] space-y-3">
              <Calendar className="w-10 h-10 text-[#9AA6B5] mx-auto opacity-40" />
              <h3 className="text-base font-serif font-semibold text-[#F5F3EF]">
                No sessions match your filter criteria
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                {viewOnlyBookmarks
                  ? 'You have not added any sessions to your schedule for this day and stage.'
                  : 'Try selecting All Stages or All Tracks.'}
              </p>
              <button
                onClick={() => {
                  setSelectedStage('All');
                  setSelectedCategory('All');
                  setViewOnlyBookmarks(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#080E18] text-[#DFC394] text-xs font-semibold border border-white/10"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  speakers={speakers}
                  onBookmarkChange={loadData}
                  onSelectSpeaker={(sp) => setSelectedSpeaker(sp)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Speaker Dossier Modal */}
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-[#0E1A2E] border border-white/[0.1] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9AA6B5] hover:text-[#F5F3EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-4 border-b border-white/[0.08]">
              <img
                src={selectedSpeaker.avatarUrl}
                alt={selectedSpeaker.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#DFC394]/40"
              />
              <div>
                <h3 className="text-xl font-serif font-bold text-[#F5F3EF]">
                  {selectedSpeaker.name}
                </h3>
                <p className="text-xs text-[#DFC394] font-medium">{selectedSpeaker.title}</p>
                <p className="text-xs text-[#9AA6B5]">{selectedSpeaker.organization}</p>
              </div>
            </div>

            <div className="py-4 space-y-2">
              <h4 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                Biography
              </h4>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                {selectedSpeaker.bio}
              </p>
            </div>

            {selectedSpeaker.expertise && (
              <div className="pb-4 flex flex-wrap gap-1.5">
                {selectedSpeaker.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#080E18] text-[#DFC394] border border-[#DFC394]/20"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                href="/app/speakers"
                onClick={() => setSelectedSpeaker(null)}
                className="text-xs text-[#DFC394] hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Full Speaker Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
