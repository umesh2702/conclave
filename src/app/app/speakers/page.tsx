'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  X, 
  Radio, 
  Tag, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { StorageService } from '@/services/storage';
import { AgendaService } from '@/services/agendaService';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Speaker, Session } from '@/types';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const loadData = () => {
    const spks = StorageService.getSpeakers();
    const ses = StorageService.getSessions();
    const bms = StorageService.getBookmarkedSessionIds();
    setSpeakers(spks);
    setSessions(ses);
    setBookmarkedIds(bms);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, []);

  const toggleBookmark = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    AgendaService.toggleBookmark(sessionId);
    setBookmarkedIds(StorageService.getBookmarkedSessionIds());
  };

  // Collect all unique expertise tags
  const allExpertiseTags = ['All', ...Array.from(new Set(
    speakers.flatMap(s => s.expertise || [])
  ))];

  // Filtered speakers
  const filteredSpeakers = speakers.filter(speaker => {
    const matchesSearch = 
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (speaker.title || speaker.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (speaker.expertise && speaker.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesExpertise = 
      selectedExpertise === 'All' || 
      (speaker.expertise && speaker.expertise.includes(selectedExpertise));

    return matchesSearch && matchesExpertise;
  });

  // Get sessions for a given speaker
  const getSpeakerSessions = (speaker: Speaker): Session[] => {
    return sessions.filter(s => 
      (speaker.sessionIds && speaker.sessionIds.includes(s.id)) ||
      s.speakerIds.includes(speaker.id)
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1524] via-[#0E1A2E] to-[#12223D] border border-white/[0.08] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC394]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFC394]/10 border border-[#DFC394]/20 text-[#DFC394] text-xs font-medium uppercase tracking-wider mb-3">
            <Mic className="w-3.5 h-3.5" />
            Conclave Thought Leaders & Allocators
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF] tracking-tight">
            Distinguished Speakers & Panellists
          </h1>
          <p className="text-sm md:text-base text-[#9AA6B5] mt-1 max-w-2xl">
            Meet the sovereign allocators, frontier deep tech founders, and venture capitalists 
            commanding the stages at Capital Connect Conclave 2026.
          </p>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA6B5]" />
              <input
                type="text"
                placeholder="Search by speaker name, title, organization, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E18]/80 border border-white/[0.08] text-sm text-[#F5F3EF] placeholder-[#9AA6B5]/60 focus:outline-none focus:border-[#DFC394]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6B5] hover:text-[#F5F3EF]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expertise Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
            {allExpertiseTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedExpertise(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedExpertise === tag
                    ? 'bg-[#DFC394] text-[#080E18] font-semibold'
                    : 'bg-[#080E18]/60 text-[#9AA6B5] hover:text-[#F5F3EF] border border-white/[0.06]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker) => {
          const spkSessions = getSpeakerSessions(speaker);
          const hasLiveSession = spkSessions.some(s => s.liveStatus === 'live');

          return (
            <div
              key={speaker.id}
              onClick={() => setActiveSpeaker(speaker)}
              className="group cursor-pointer rounded-2xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.08] hover:border-[#DFC394]/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#DFC394]/5 relative overflow-hidden"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DFC394]/20 to-transparent group-hover:via-[#DFC394]" />

              <div>
                {/* Speaker Header with Avatar */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={speaker.avatarUrl}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/[0.1] group-hover:border-[#DFC394]/40 transition-colors"
                    />
                    {hasLiveSession && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0E1A2E] flex items-center justify-center animate-pulse" title="Currently Live on Stage">
                        <Radio className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif text-lg font-bold text-[#F5F3EF] truncate group-hover:text-[#DFC394] transition-colors">
                        {speaker.name}
                      </h3>
                      {speaker.featured && (
                        <span className="shrink-0 text-[10px] font-bold text-[#DFC394] bg-[#DFC394]/10 px-2 py-0.5 rounded border border-[#DFC394]/20">
                          KEYNOTE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#DFC394] font-medium truncate mt-0.5">
                      {speaker.title}
                    </p>
                    <p className="text-xs text-[#9AA6B5] truncate">
                      {speaker.organization}
                    </p>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-xs text-[#9AA6B5] mt-4 line-clamp-2 leading-relaxed">
                  {speaker.bio}
                </p>

                {/* Expertise Badges */}
                {speaker.expertise && speaker.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {speaker.expertise.slice(0, 3).map((exp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#080E18] text-[#9AA6B5] border border-white/[0.04]"
                      >
                        {exp}
                      </span>
                    ))}
                    {speaker.expertise.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#080E18] text-[#9AA6B5]/60">
                        +{speaker.expertise.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sessions Count & Action */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#9AA6B5] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#DFC394]" />
                  {spkSessions.length} {spkSessions.length === 1 ? 'Session' : 'Sessions'}
                </span>
                <span className="text-[#DFC394] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Dossier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-16 bg-[#0E1A2E]/40 rounded-2xl border border-white/[0.06]">
          <Mic className="w-10 h-10 text-[#9AA6B5] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-serif font-semibold text-[#F5F3EF]">No speakers matched your filter</h3>
          <p className="text-xs text-[#9AA6B5] mt-1">Try modifying your search term or select &quot;All&quot; expertise domains.</p>
        </div>
      )}

      {/* Speaker Dossier Modal */}
      {activeSpeaker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveSpeaker(null)}
        >
          <div 
            className="bg-[#0E1A2E] border border-white/[0.1] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveSpeaker(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-white/[0.08]">
              <img
                src={activeSpeaker.avatarUrl}
                alt={activeSpeaker.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#DFC394]/30 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-serif font-bold text-[#F5F3EF]">
                    {activeSpeaker.name}
                  </h2>
                  {activeSpeaker.featured && (
                    <span className="text-[10px] font-bold text-[#DFC394] bg-[#DFC394]/10 px-2 py-0.5 rounded border border-[#DFC394]/20">
                      KEYNOTE
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#DFC394] font-medium mt-1">
                  {activeSpeaker.title}
                </p>
                <p className="text-sm text-[#9AA6B5]">
                  {activeSpeaker.organization}
                </p>

                {activeSpeaker.linkedinUrl && (
                  <a
                    href={activeSpeaker.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#7998B8] hover:text-[#DFC394] mt-2 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Professional Profile
                  </a>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="py-6 border-b border-white/[0.08] space-y-3">
              <h4 className="text-xs font-semibold text-[#DFC394] uppercase tracking-wider">
                Executive Biography
              </h4>
              <p className="text-sm text-[#9AA6B5] leading-relaxed">
                {activeSpeaker.bio}
              </p>

              {/* Areas of Expertise */}
              {activeSpeaker.expertise && activeSpeaker.expertise.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-[#F5F3EF] mb-2">Areas of Practice & Expertise:</div>
                  <div className="flex flex-wrap gap-2">
                    {activeSpeaker.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#080E18] text-[#DFC394] border border-[#DFC394]/20"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conclave Programme Sessions */}
            <div className="pt-6">
              <h4 className="text-xs font-semibold text-[#DFC394] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Programme Participation ({getSpeakerSessions(activeSpeaker).length})
              </h4>

              <div className="space-y-3">
                {getSpeakerSessions(activeSpeaker).map((session) => {
                  const isBookmarked = bookmarkedIds.includes(session.id);
                  return (
                    <div
                      key={session.id}
                      className={`p-4 rounded-xl border transition-all ${
                        session.liveStatus === 'live'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-[#080E18]/80 border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#DFC394] font-semibold">
                            Day {session.day} • {session.startTime} – {session.endTime}
                          </span>
                          {session.liveStatus === 'live' && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                              <Radio className="w-3 h-3" /> LIVE NOW
                            </span>
                          )}
                          {session.liveStatus === 'completed' && (
                            <span className="text-[10px] text-[#9AA6B5] bg-white/[0.04] px-1.5 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => toggleBookmark(session.id, e)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked 
                              ? 'bg-[#DFC394]/20 border-[#DFC394] text-[#DFC394]' 
                              : 'bg-white/[0.04] border-white/[0.08] text-[#9AA6B5] hover:text-[#F5F3EF]'
                          }`}
                          title={isBookmarked ? 'Bookmarked in My Schedule' : 'Bookmark Session'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#DFC394]' : ''}`} />
                        </button>
                      </div>

                      <h5 className="font-serif text-base font-semibold text-[#F5F3EF]">
                        {session.title}
                      </h5>

                      <p className="text-xs text-[#9AA6B5] mt-1 line-clamp-2 leading-relaxed">
                        {session.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
                        <span className="text-[#9AA6B5] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7998B8]" /> {session.stage || session.location}
                        </span>
                        <Link
                          href={`/app/agenda`}
                          onClick={() => setActiveSpeaker(null)}
                          className="text-[#DFC394] hover:underline flex items-center gap-1 font-medium"
                        >
                          View in Agenda <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
}
