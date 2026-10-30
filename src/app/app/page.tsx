'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { AgendaService } from '@/services/agendaService';
import { AnnouncementService } from '@/services/announcementService';
import { ConnectionService } from '@/services/connectionService';
import { MeetingService } from '@/services/meetingService';
import { Session, Speaker, Announcement, SimulationClock } from '@/types';
import { 
  Radio, 
  Clock, 
  MapPin, 
  Navigation, 
  Calendar, 
  Bookmark, 
  Bell, 
  AlertTriangle, 
  Megaphone, 
  Users, 
  QrCode, 
  Mic, 
  Layers, 
  Handshake, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Timer, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function LiveEventHubPage() {
  const { currentUser, refresh } = useAuth();
  const [clock, setClock] = useState<SimulationClock>(StorageService.getSimulationClock());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedTimelineDay, setSelectedTimelineDay] = useState<number>(1);

  const loadData = () => {
    const clk = StorageService.getSimulationClock();
    const sess = StorageService.getSessions();
    const spks = StorageService.getSpeakers();
    const anns = AnnouncementService.getAnnouncements();
    const bms = StorageService.getBookmarkedSessionIds();
    setClock(clk);
    setSessions(sess);
    setSpeakers(spks);
    setAnnouncements(anns);
    setBookmarkedIds(bms);
    setSelectedTimelineDay(clk.currentDay);
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

  // 1. Current Live Session
  const liveSession = sessions.find(s => s.liveStatus === 'live');

  // Speakers for live session
  const liveSessionSpeakers = liveSession 
    ? speakers.filter(spk => liveSession.speakerIds.includes(spk.id))
    : [];

  // 2. Upcoming Sessions (for current day, chronological)
  const currentDaySessions = sessions.filter(s => s.day === clock.currentDay);
  const upcomingSessions = currentDaySessions
    .filter(s => s.liveStatus === 'upcoming' || s.liveStatus === 'delayed')
    .slice(0, 3);

  // 3. Timeline sessions for selected timeline day
  const timelineSessions = sessions.filter(s => s.day === selectedTimelineDay);

  // 4. Urgent announcements vs general announcements
  const urgentAnnouncements = announcements.filter(a => a.priority === 'urgent' || a.priority === 'high');
  const normalAnnouncements = announcements.filter(a => a.priority !== 'urgent' && a.priority !== 'high');

  // 5. Secondary Pillar Networking data for current user
  const userConnections = currentUser ? ConnectionService.getConnectionsForAttendee(currentUser.id) : null;
  const userMeetings = currentUser ? MeetingService.getMeetingsForAttendee(currentUser.id) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION A: EVENT STATUS HEADER                            */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-gradient-to-r from-[#0C1524] via-[#0E1A2E] to-[#12223D] border border-white/[0.08] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC394]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              {/* Live Badge & Event Day */}
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  CONCLAVE LIVE NOW
                </span>

                <span className="text-xs font-mono font-semibold text-[#DFC394] bg-[#DFC394]/10 px-2.5 py-0.5 rounded border border-[#DFC394]/20">
                  DAY {clock.currentDay} OF 2
                </span>

                <span className="text-xs text-[#9AA6B5] flex items-center gap-1 bg-[#080E18]/80 px-2.5 py-0.5 rounded border border-white/[0.06] font-mono">
                  <Clock className="w-3 h-3 text-[#DFC394]" /> Simulated Time: {clock.currentTime}
                </span>
              </div>

              {/* Title & Brand */}
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#F5F3EF] tracking-tight">
                Capital Connect Conclave 2026
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA6B5] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Nov 14–15, 2026</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#DFC394]">
                  <MapPin className="w-3.5 h-3.5" /> HICC Cyberabad Grand Complex, Hyderabad
                </span>
                <span>•</span>
                <span className="text-[#7998B8]">Startup Synerz &amp; ULink Live Layer</span>
              </p>
            </div>

            {/* Quick Digital Pass Button */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/app/pass"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#080E18]/80 hover:bg-[#12223D] border border-[#DFC394]/40 text-xs font-semibold text-[#DFC394] shadow-sm transition-all group"
              >
                <QrCode className="w-4 h-4 text-[#DFC394] group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] uppercase text-[#9AA6B5] font-mono tracking-wider">
                    Fast-Track QR Pass
                  </div>
                  <span>{currentUser ? currentUser.id : 'Delegate Badge'}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* URGENT ANNOUNCEMENT TICKER (IF ACTIVE)                    */}
        {/* ========================================================= */}
        {urgentAnnouncements.length > 0 && (
          <div className="rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/20 border-l-4 border-l-amber-500 border border-amber-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Important Conclave Advisory ({urgentAnnouncements.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#9AA6B5]">Live Organizer Feed</span>
            </div>
            {urgentAnnouncements.map(ann => (
              <div key={ann.id} className="pt-1 text-xs text-[#F5F3EF]">
                <strong className="text-amber-200">{ann.title}:</strong> {ann.message}
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION B: CURRENTLY HAPPENING (DOMINANT HERO)            */}
        {/* ========================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-lg font-serif font-bold text-[#F5F3EF] tracking-tight">
                Currently Happening on Stage
              </h2>
            </div>
            <span className="text-xs text-[#DFC394] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Synchronized with Conclave Floor
            </span>
          </div>

          {liveSession ? (
            <div className="rounded-2xl bg-gradient-to-br from-[#12223D] via-[#0E1A2E] to-[#0A1424] border-2 border-emerald-500/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* Pulsing ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                {/* Session Main Details */}
                <div className="space-y-4 max-w-3xl">
                  {/* Status, Stage, and Time Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 animate-pulse">
                      <Radio className="w-3.5 h-3.5" /> LIVE IN PROGRESS
                    </span>

                    <span className="px-3 py-1 rounded-full bg-[#DFC394]/15 text-[#DFC394] text-xs font-semibold border border-[#DFC394]/30 flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {liveSession.stage || liveSession.location}
                    </span>

                    {liveSession.floor && (
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#9AA6B5] text-xs font-mono">
                        {liveSession.floor}
                      </span>
                    )}

                    <span className="font-mono text-xs text-[#9AA6B5] bg-[#080E18]/80 px-2.5 py-1 rounded border border-white/[0.06]">
                      {liveSession.startTime} – {liveSession.endTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F3EF] leading-tight">
                    {liveSession.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#9AA6B5] leading-relaxed">
                    {liveSession.description}
                  </p>

                  {/* Speakers Row */}
                  {liveSessionSpeakers.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#DFC394] mb-2 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5" /> Speaking Right Now:
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        {liveSessionSpeakers.map(spk => (
                          <Link
                            key={spk.id}
                            href="/app/speakers"
                            className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#080E18]/60 hover:bg-[#080E18] border border-white/[0.06] hover:border-[#DFC394]/40 transition-colors group"
                          >
                            <img
                              src={spk.avatarUrl}
                              alt={spk.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#DFC394]/40"
                            />
                            <div>
                              <div className="text-xs font-bold text-[#F5F3EF] group-hover:text-[#DFC394] transition-colors">
                                {spk.name}
                              </div>
                              <div className="text-[10px] text-[#9AA6B5]">
                                {spk.title} • {spk.organization}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 justify-center">
                  <Link
                    href="/app/venue"
                    className="px-5 py-3 rounded-xl bg-[#DFC394] hover:bg-[#ebd3ab] text-[#080E18] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#DFC394]/10 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Take Me to Stage (Venue)</span>
                  </Link>

                  <button
                    onClick={(e) => handleToggleBookmark(liveSession.id, e)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                      bookmarkedIds.includes(liveSession.id)
                        ? 'bg-[#DFC394]/20 border-[#DFC394] text-[#DFC394]'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-[#9AA6B5] hover:text-[#F5F3EF]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(liveSession.id) ? 'fill-[#DFC394]' : ''}`} />
                    <span>{bookmarkedIds.includes(liveSession.id) ? 'Bookmarked in My Schedule' : 'Bookmark Session'}</span>
                  </button>

                  <Link
                    href="/app/agenda"
                    className="text-xs text-[#9AA6B5] hover:text-[#DFC394] text-center flex items-center justify-center gap-1 pt-1"
                  >
                    <span>View full session dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0E1A2E]/70 border border-white/[0.08] p-8 text-center space-y-3">
              <Timer className="w-10 h-10 text-[#DFC394] mx-auto opacity-70" />
              <h3 className="text-xl font-serif font-bold text-[#F5F3EF]">
                Conclave Floor Intermission
              </h3>
              <p className="text-xs text-[#9AA6B5] max-w-md mx-auto">
                No session is currently presenting on the main plenary stage. Delegates are invited to explore the Dining Pavilion on Level 1 or bilateral Deal Pods on Level 2.
              </p>
              <div className="pt-2">
                <Link
                  href="/app/agenda"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DFC394]/15 border border-[#DFC394]/30 text-xs text-[#DFC394] font-semibold hover:bg-[#DFC394]/25"
                >
                  <Calendar className="w-3.5 h-3.5" /> Check Next Scheduled Track
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION C & E: 2-COLUMN SPLIT (UP NEXT + ANNOUNCEMENTS)   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* UP NEXT (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DFC394]" />
                <h2 className="text-base font-serif font-bold text-[#F5F3EF]">
                  Up Next on Programme
                </h2>
              </div>
              <Link
                href="/app/agenda"
                className="text-xs text-[#DFC394] hover:underline flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((ses, idx) => {
                  const sesSpeakers = speakers.filter(s => ses.speakerIds.includes(s.id));
                  const isBookmarked = bookmarkedIds.includes(ses.id);

                  return (
                    <div
                      key={ses.id}
                      className="rounded-xl bg-[#0E1A2E]/80 border border-white/[0.08] hover:border-[#DFC394]/40 p-4 transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#DFC394] bg-[#DFC394]/10 px-2 py-0.5 rounded border border-[#DFC394]/20">
                            {ses.startTime}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-[#9AA6B5] bg-white/[0.04] px-2 py-0.5 rounded">
                            {ses.category}
                          </span>
                          {ses.liveStatus === 'delayed' && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Delayed by 15m
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleBookmark(ses.id, e)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            isBookmarked 
                              ? 'bg-[#DFC394]/20 border-[#DFC394] text-[#DFC394]' 
                              : 'bg-white/[0.04] border-white/[0.08] text-[#9AA6B5] hover:text-[#F5F3EF]'
                          }`}
                          title="Bookmark to My Schedule"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#DFC394]' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-[#F5F3EF] group-hover:text-[#DFC394] transition-colors">
                          {ses.title}
                        </h4>
                        <p className="text-xs text-[#9AA6B5] line-clamp-2 mt-1 leading-relaxed">
                          {ses.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                        <span className="text-[#9AA6B5] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7998B8]" />
                          {ses.stage || ses.location}
                        </span>

                        {sesSpeakers.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#9AA6B5] truncate max-w-[180px]">
                              {sesSpeakers.map(s => s.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 rounded-xl bg-[#0E1A2E]/40 border border-white/[0.04] text-center text-xs text-[#9AA6B5]">
                  No further sessions scheduled for today. Explore Day 2 programme or evening networking receptions.
                </div>
              )}
            </div>
          </div>

          {/* DEDICATED LIVE ANNOUNCEMENTS FEED (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#DFC394]" />
                <h2 className="text-base font-serif font-bold text-[#F5F3EF]">
                  Conclave Announcements
                </h2>
              </div>
              <span className="text-[11px] text-[#9AA6B5] font-mono">Live Broadcast</span>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 4).map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    ann.priority === 'urgent'
                      ? 'bg-red-950/30 border-red-500/40'
                      : ann.priority === 'high'
                      ? 'bg-amber-950/25 border-amber-500/30'
                      : 'bg-[#0E1A2E]/70 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F5F3EF] flex items-center gap-1.5">
                      {ann.priority === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                      {ann.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#DFC394]">
                      {ann.category}
                    </span>
                  </div>
                  <p className="text-[#9AA6B5] leading-relaxed">
                    {ann.message}
                  </p>
                  <div className="pt-1 text-[10px] text-[#9AA6B5]/70 flex items-center justify-between">
                    <span>By {ann.author}</span>
                    <span>{ann.publishedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION D: LIVE PROGRAMME TIMELINE                        */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-[#0E1A2E]/50 border border-white/[0.08] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F5F3EF] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#DFC394]" />
                Day {selectedTimelineDay} Conclave Programme Timeline
              </h2>
              <p className="text-xs text-[#9AA6B5] mt-0.5">
                Real-time chronological tracker for stages, keynotes, and syndicate deal rooms
              </p>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center gap-2 bg-[#080E18] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
              <button
                onClick={() => setSelectedTimelineDay(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTimelineDay === 1
                    ? 'bg-[#DFC394] text-[#080E18]'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 1 (Nov 14)
              </button>
              <button
                onClick={() => setSelectedTimelineDay(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTimelineDay === 2
                    ? 'bg-[#DFC394] text-[#080E18]'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 2 (Nov 15)
              </button>
            </div>
          </div>

          {/* Timeline List */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
            {timelineSessions.map((session) => {
              const isLive = session.liveStatus === 'live';
              const isCompleted = session.liveStatus === 'completed';
              const isDelayed = session.liveStatus === 'delayed';
              const isCancelled = session.liveStatus === 'cancelled';
              const sesSpeakers = speakers.filter(s => session.speakerIds.includes(s.id));
              const isBookmarked = bookmarkedIds.includes(session.id);

              return (
                <div key={session.id} className="relative group">
                  {/* Timeline Bullet Indicator */}
                  <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    isLive 
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-lg shadow-emerald-500/50 animate-pulse'
                      : isCompleted 
                      ? 'bg-[#080E18] border-white/20 text-[#9AA6B5]'
                      : isDelayed
                      ? 'bg-amber-500 border-amber-300 text-white'
                      : isCancelled
                      ? 'bg-red-500 border-red-300 text-white'
                      : 'bg-[#080E18] border-[#DFC394] text-[#DFC394]'
                  }`}>
                    {isLive && <Radio className="w-3 h-3" />}
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {isDelayed && <Clock className="w-3 h-3" />}
                    {isCancelled && <Ban className="w-3 h-3" />}
                    {!isLive && !isCompleted && !isDelayed && !isCancelled && (
                      <span className="w-2 h-2 rounded-full bg-[#DFC394]" />
                    )}
                  </div>

                  {/* Timeline Card */}
                  <div className={`rounded-xl p-4 sm:p-5 border transition-all ${
                    isLive 
                      ? 'bg-gradient-to-r from-emerald-950/30 to-[#0E1A2E] border-emerald-500/50 shadow-lg'
                      : isCompleted 
                      ? 'bg-[#080E18]/40 border-white/[0.04] opacity-65'
                      : 'bg-[#080E18]/80 border-white/[0.06] hover:border-white/[0.15]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#DFC394]">
                          {session.startTime} – {session.endTime}
                        </span>

                        <span className="text-[10px] font-semibold text-[#9AA6B5] bg-white/[0.06] px-2 py-0.5 rounded">
                          {session.category}
                        </span>

                        {isLive && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                            <Radio className="w-3 h-3" /> LIVE NOW
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] text-[#9AA6B5] bg-white/[0.04] px-1.5 py-0.2 rounded">
                            Concluded
                          </span>
                        )}
                        {isDelayed && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                            Delayed
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={(e) => handleToggleBookmark(session.id, e)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            isBookmarked 
                              ? 'bg-[#DFC394]/20 border-[#DFC394] text-[#DFC394]' 
                              : 'bg-white/[0.04] border-white/[0.08] text-[#9AA6B5] hover:text-[#F5F3EF]'
                          }`}
                          title="Bookmark to My Schedule"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#DFC394]' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-base font-serif font-bold ${isCancelled ? 'line-through text-[#9AA6B5]' : 'text-[#F5F3EF]'}`}>
                      {session.title}
                    </h4>

                    <p className="text-xs text-[#9AA6B5] mt-1 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[#9AA6B5] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7998B8]" />
                        {session.stage || session.location}
                        {session.floor && ` • ${session.floor}`}
                      </span>

                      {sesSpeakers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#DFC394] text-[11px] font-medium">
                            {sesSpeakers.map(s => s.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION F: EVENT QUICK ACCESS GRID                        */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <h2 className="text-base font-serif font-bold text-[#F5F3EF] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DFC394]" />
            Conclave Quick Navigation & Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/app/agenda"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-[#DFC394]/10 text-[#DFC394] group-hover:scale-110 transition-transform mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Full Agenda</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">Stages & Tracks</div>
            </Link>

            <Link
              href="/app/speakers"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-[#7998B8]/10 text-[#7998B8] group-hover:scale-110 transition-transform mb-2">
                <Mic className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Speakers</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">Dossier & Bio</div>
            </Link>

            <Link
              href="/app/venue"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mb-2">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Venue Guide</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">HICC Floor Map</div>
            </Link>

            <Link
              href="/app/people"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Directory</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">Delegates & VCs</div>
            </Link>

            <Link
              href="/app/meetings"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform mb-2">
                <Handshake className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Deal Pods</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">1:1 Meetings</div>
            </Link>

            <Link
              href="/app/pass"
              className="p-4 rounded-xl bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border border-white/[0.06] hover:border-[#DFC394]/40 flex flex-col items-center text-center transition-all group"
            >
              <div className="p-3 rounded-xl bg-[#DFC394]/10 text-[#DFC394] group-hover:scale-110 transition-transform mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-[#F5F3EF]">Digital Pass</div>
              <div className="text-[10px] text-[#9AA6B5] mt-0.5">Entry Credential</div>
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECONDARY PILLAR: PERSONAL NETWORKING SNAPSHOT             */}
        {/* ========================================================= */}
        {currentUser && (
          <section className="pt-4 border-t border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[#F5F3EF]">
                  My Bilateral Conclave Activity
                </h3>
                <p className="text-xs text-[#9AA6B5]">
                  Supporting networking pillar for {currentUser.fullName} ({currentUser.category})
                </p>
              </div>
              <Link
                href="/app/connections"
                className="text-xs text-[#DFC394] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage Network</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Deal Pod Meetings */}
              <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9AA6B5] flex items-center gap-1.5 font-medium">
                    <Handshake className="w-3.5 h-3.5 text-[#DFC394]" /> Confirmed Deal Pods
                  </span>
                  <span className="font-mono text-xs font-bold text-[#DFC394]">
                    {userMeetings.filter(m => m.status === 'confirmed').length} Scheduled
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA6B5]">
                  Private 1:1 suites on Level 2 reserved for bilateral discussions.
                </p>
                <Link
                  href="/app/meetings"
                  className="text-xs text-[#DFC394] hover:underline flex items-center gap-1 pt-1 font-medium"
                >
                  View Meeting Pod Schedule <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Connection Requests */}
              <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9AA6B5] flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#7998B8]" /> Network Connections
                  </span>
                  <span className="font-mono text-xs font-bold text-[#DFC394]">
                    {userConnections?.accepted.length || 0} Connected
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA6B5]">
                  {userConnections?.received.length || 0} incoming requests pending review.
                </p>
                <Link
                  href="/app/connections"
                  className="text-xs text-[#DFC394] hover:underline flex items-center gap-1 pt-1 font-medium"
                >
                  Review Connection Requests <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Secretariat Assistance */}
              <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9AA6B5] flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> On-Site Operations
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                    DESK ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA6B5]">
                  ULink Live support &amp; delegate liaison located at Level 1 Concourse.
                </p>
                <Link
                  href="/app/venue"
                  className="text-xs text-[#DFC394] hover:underline flex items-center gap-1 pt-1 font-medium"
                >
                  Locate Operations Desk <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
