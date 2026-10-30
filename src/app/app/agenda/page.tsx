'use client';

import React, { useState } from 'react';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { Storage } from '../../../services/storage';
import { AgendaService } from '../../../services/agendaService';
import { SessionCard } from '../../../components/agenda/SessionCard';
import { Session, Speaker, SessionCategory } from '../../../types';
import { 
  Calendar, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Sparkles, 
  X,
  MapPin,
  Building2
} from 'lucide-react';

export default function AgendaPage() {
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 or 2
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewOnlyBookmarks, setViewOnlyBookmarks] = useState<boolean>(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const sessions = Storage.getSessions();
  const speakers = Storage.getSpeakers();
  const bookmarkedIds = Storage.getBookmarkedSessionIds();

  const categories: string[] = [
    'All',
    'Keynote',
    'Panel Discussion',
    'Deal Room',
    'Pitch Track',
    'Networking Reception',
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchesDay = s.day === selectedDay;
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesBookmark = !viewOnlyBookmarks || bookmarkedIds.includes(s.id);
    return matchesDay && matchesCategory && matchesBookmark;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Official Summit Programme</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
            Capital Connect Conclave Agenda
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B5] max-w-2xl">
            Explore keynote sessions, institutional panels, and 1:1 deal room allocations. Bookmark sessions to curate your personalized conclave schedule.
          </p>
        </div>

        {/* Filter & Day Selector */}
        <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Day Switcher */}
            <div className="flex items-center gap-2 bg-[#080E18] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setSelectedDay(1)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 1
                    ? 'bg-[#C7A875] text-[#080E18] shadow-sm'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 1 — Saturday, Nov 14
              </button>

              <button
                onClick={() => setSelectedDay(2)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 2
                    ? 'bg-[#C7A875] text-[#080E18] shadow-sm'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 2 — Sunday, Nov 15
              </button>
            </div>

            {/* My Agenda Toggle */}
            <button
              onClick={() => setViewOnlyBookmarks(!viewOnlyBookmarks)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                viewOnlyBookmarks
                  ? 'bg-[#172335] text-[#DFC394] border-[#C7A875]/40 shadow-sm'
                  : 'bg-[#111B2A] text-[#9AA6B5] border-white/10 hover:border-white/20'
              }`}
            >
              {viewOnlyBookmarks ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#DFC394]" />
                  <span>Showing My Schedule ({bookmarkedIds.length})</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-[#9AA6B5]" />
                  <span>Filter: My Schedule Only</span>
                </>
              )}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-white/5">
            <span className="text-xs text-[#9AA6B5] font-semibold mr-1 shrink-0">Track:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#172335] text-[#DFC394] border border-[#C7A875]/40'
                    : 'bg-white/[0.03] text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="card-glass rounded-2xl p-12 text-center border border-white/10 space-y-3">
            <Calendar className="w-10 h-10 text-[#9AA6B5] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#F5F3EF]">
              No sessions match your filter
            </h3>
            <p className="text-xs text-[#9AA6B5] max-w-sm mx-auto">
              {viewOnlyBookmarks
                ? "You haven't bookmarked any sessions for Day " + selectedDay + " yet."
                : 'No sessions found in this track for the selected day.'}
            </p>
            {viewOnlyBookmarks && (
              <button
                onClick={() => setViewOnlyBookmarks(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn mt-2"
              >
                Show All Sessions
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                speakers={speakers}
                onSelectSpeaker={(sp) => setSelectedSpeaker(sp)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C7A875]/40 shadow-lg">
                <img
                  src={selectedSpeaker.imageUrl}
                  alt={selectedSpeaker.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F5F3EF]">
                  {selectedSpeaker.name}
                </h3>
                <div className="text-xs text-[#DFC394]">{selectedSpeaker.designation}</div>
                <div className="text-xs text-[#9AA6B5]">{selectedSpeaker.organization}</div>
              </div>

              <p className="text-xs text-[#9AA6B5] leading-relaxed pt-2 border-t border-white/10">
                {selectedSpeaker.biography}
              </p>

              {selectedSpeaker.topic && (
                <div className="p-3 rounded-lg bg-[#111B2A] border border-white/5 text-[11px] text-[#7998B8] font-medium w-full">
                  Topic: {selectedSpeaker.topic}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
