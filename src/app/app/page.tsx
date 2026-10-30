'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { StorageService } from '@/services/storage';
import { AgendaService, ActivityFeedItem } from '@/services/agendaService';
import { AnnouncementService } from '@/services/announcementService';
import { Session, Speaker, Announcement, SimulationClock } from '@/types';
import { 
  Radio, 
  Clock, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Bell, 
  ArrowRight, 
  ChevronRight, 
  Mic, 
  X,
  Sparkles,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function LiveEventHubPage() {
  const [clock, setClock] = useState<SimulationClock>(StorageService.getSimulationClock());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeSpeakerModal, setActiveSpeakerModal] = useState<Speaker | null>(null);
  const [activeAnnouncementModal, setActiveAnnouncementModal] = useState<Announcement | null>(null);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([]);

  const loadData = () => {
    setClock(StorageService.getSimulationClock());
    setSessions(StorageService.getSessions());
    setSpeakers(StorageService.getSpeakers());
    setAnnouncements(AnnouncementService.getAnnouncements());
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

  const handleOpenAnnouncement = (ann: Announcement) => {
    setActiveAnnouncementModal(ann);
    if (!readAnnouncementIds.includes(ann.id)) {
      setReadAnnouncementIds(prev => [...prev, ann.id]);
    }
  };

  // 1. Current Live Session (Deterministic)
  const currentLiveSession = AgendaService.getCurrentlyLiveSession();

  // 2. Concurrent live sessions on other stages ("Also happening now")
  const concurrentSessions = currentLiveSession 
    ? AgendaService.getConcurrentLiveSessions(currentLiveSession.id)
    : [];

  // 3. Progress percentage of current session
  const sessionProgress = currentLiveSession 
    ? AgendaService.getSessionProgress(currentLiveSession, clock.currentTime)
    : 0;

  // 4. Speakers for current live session
  const currentLiveSpeakers = currentLiveSession
    ? speakers.filter(spk => currentLiveSession.speakerIds.includes(spk.id))
    : [];
  const primarySpeaker = currentLiveSpeakers[0] || speakers[0];

  // 5. Next 2-3 sessions
  const upcomingSessions = AgendaService.getUpcomingSessions(clock.currentDay, 3);

  // 6. Real-time chronological activity feed
  const activityFeed: ActivityFeedItem[] = AgendaService.getActivityFeed(clock);

  // 7. Context-aware spotlight label
  const spotlightLabel = (() => {
    if (!currentLiveSession) return 'Keynote Panellist Spotlight';
    const cat = currentLiveSession.category?.toLowerCase() || '';
    if (cat.includes('keynote')) return 'Keynote Speaker Spotlight';
    if (cat.includes('panel')) return 'Panel Discussion Spotlight';
    if (cat.includes('fireside')) return 'Fireside Chat Spotlight';
    if (cat.includes('workshop')) return 'Workshop Leader Spotlight';
    if (cat.includes('pitch')) return 'Pitch Showcase Spotlight';
    if (cat.includes('deal')) return 'Deal Room Host Spotlight';
    return `${currentLiveSession.category} Spotlight`;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F5F3EF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 md:py-8 w-full space-y-6 md:space-y-8 pb-28 md:pb-12">
        
        {/* ========================================================= */}
        {/* EDITORIAL LIVE STATUS BAR                                */}
        {/* ========================================================= */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#202C3D]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="live-pulse-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Event Live
            </span>
            <span className="text-xs font-mono font-semibold text-[#D2B47C] bg-[#101927] px-2.5 py-0.5 rounded border border-[#202C3D]">
              Day {clock.currentDay} of 2
            </span>
            <span className="text-xs font-mono text-[#91A0B4] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D2B47C]" />
              <span>Conclave Clock: <strong className="text-[#F5F3EF]">{clock.currentTime}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#91A0B4]">
            <MapPin className="w-3.5 h-3.5 text-[#D2B47C]" />
            <span>Cyber Convention Centre & Grand Ballroom</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRIMARY FOCUS: CURRENT LIVE SESSION                      */}
        {/* ========================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#D2B47C] font-semibold">
                Happening Right Now
              </h2>
            </div>
            {currentLiveSession && (
              <span className="text-xs font-mono text-[#91A0B4]">
                Ends at {currentLiveSession.endTime}
              </span>
            )}
          </div>

          {currentLiveSession ? (
            <div className="surface-card-elevated p-4 sm:p-7 md:p-8 relative overflow-hidden shadow-2xl transition-all">
              {/* Subtle Ambient Lighting */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D2B47C]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-between relative z-10">
                
                {/* Left: Session Editorial Core */}
                <div className="flex-1 space-y-4 max-w-3xl w-full">
                  {/* Stage, Floor & Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#101927] border border-[#202C3D] text-[#D2B47C] text-xs font-medium flex items-center gap-1.5 min-w-0">
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentLiveSession.stage || currentLiveSession.location}</span>
                    </span>

                    {currentLiveSession.floor && (
                      <span className="px-2.5 py-1 rounded-md bg-[#101927] border border-[#202C3D] text-[#91A0B4] text-xs font-mono">
                        {currentLiveSession.floor}
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-md bg-white/[0.04] text-[#91A0B4] text-xs font-medium">
                      {currentLiveSession.category}
                    </span>

                    <span className="font-mono text-xs text-[#91A0B4] bg-[#080D16] px-2.5 py-1 rounded border border-[#202C3D] whitespace-nowrap">
                      {currentLiveSession.startTime} – {currentLiveSession.endTime}
                    </span>
                  </div>

                  {/* Editorial Headline */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5F3EF] leading-tight tracking-tight">
                    {currentLiveSession.title}
                  </h1>

                  {/* Summary / Description */}
                  <p className="text-sm md:text-base text-[#91A0B4] leading-relaxed max-w-2xl font-light">
                    {currentLiveSession.description}
                  </p>

                  {/* Session Progress Bar */}
                  <div className="space-y-1.5 pt-1 max-w-xl">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#91A0B4]">
                      <span>{currentLiveSession.startTime}</span>
                      <span className="text-[#D2B47C] font-semibold">{sessionProgress}% elapsed</span>
                      <span>{currentLiveSession.endTime}</span>
                    </div>
                    <div className="w-full h-2 bg-[#101927] rounded-full overflow-hidden border border-[#202C3D]">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#D2B47C] rounded-full transition-all duration-500"
                        style={{ width: `${sessionProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Speaker Spotlight Card */}
                  {primarySpeaker && (
                    <div className="pt-3">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#91A0B4] mb-2 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#D2B47C]" />
                        <span>{spotlightLabel}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#101927] border border-[#202C3D]">
                        <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D2B47C]/40 shrink-0 bg-[#152235]">
                            <img
                              src={primarySpeaker.imageUrl || primarySpeaker.avatarUrl}
                              alt={primarySpeaker.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-[#F5F3EF] truncate">
                                {primarySpeaker.name}
                              </h3>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D2B47C]/15 text-[#D2B47C] shrink-0">
                                Speaker
                              </span>
                            </div>
                            <div className="text-xs text-[#91A0B4] truncate">
                              {primarySpeaker.designation || primarySpeaker.title} • <span className="text-[#F5F3EF]">{primarySpeaker.organization}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveSpeakerModal(primarySpeaker)}
                          className="w-full sm:w-auto min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#D2B47C] hover:bg-[#152235] border border-[#D2B47C]/30 transition-colors flex items-center justify-center shrink-0"
                        >
                          View Bio
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Multiple Active Stages Pill */}
                  {concurrentSessions.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[#91A0B4] font-mono text-[11px]">Also happening now:</span>
                      {concurrentSessions.map((cs) => (
                        <Link
                          key={cs.id}
                          href="/app/agenda"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] sm:min-h-0 rounded-md bg-[#101927] border border-[#202C3D] hover:border-[#D2B47C]/40 text-[#F5F3EF] transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-medium truncate max-w-[180px]">{cs.title}</span>
                          <span className="text-[10px] text-[#91A0B4]">({cs.stage})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Focused Primary Action Column */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 w-full lg:w-56 shrink-0 justify-center">
                  <Link
                    href={`/app/venue?highlight=${encodeURIComponent(currentLiveSession.stage || currentLiveSession.location)}`}
                    className="w-full min-h-[42px] px-4 py-2.5 rounded-xl champagne-btn text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Navigate to Stage</span>
                  </Link>

                  <button
                    onClick={(e) => handleToggleBookmark(currentLiveSession.id, e)}
                    className={`w-full min-h-[42px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                      bookmarkedIds.includes(currentLiveSession.id)
                        ? 'bg-[#D2B47C]/15 border-[#D2B47C] text-[#D2B47C]'
                        : 'bg-[#101927] hover:bg-[#152235] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(currentLiveSession.id) ? 'fill-[#D2B47C]' : ''}`} />
                    <span>{bookmarkedIds.includes(currentLiveSession.id) ? 'Saved to Schedule' : 'Save Session'}</span>
                  </button>

                  <Link
                    href="/app/agenda"
                    className="min-h-[40px] text-xs text-[#91A0B4] hover:text-[#D2B47C] text-center flex items-center justify-center gap-1 py-1.5 transition-colors"
                  >
                    <span>Full Programme Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          ) : (
            <div className="surface-card p-8 text-center space-y-3">
              <Clock className="w-10 h-10 text-[#D2B47C] mx-auto opacity-70" />
              <h3 className="text-xl font-serif font-bold text-[#F5F3EF]">
                Conclave Floor Intermission
              </h3>
              <p className="text-xs text-[#91A0B4] max-w-md mx-auto">
                No active plenary address is currently taking place. Delegates are invited to explore the bilateral Deal Pods on Level 2 or Barista Pavilion on Level 1.
              </p>
              <div className="pt-2">
                <Link
                  href="/app/agenda"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D2B47C]/15 border border-[#D2B47C]/30 text-xs text-[#D2B47C] font-semibold hover:bg-[#D2B47C]/25"
                >
                  <Calendar className="w-3.5 h-3.5" /> Check Next Scheduled Track
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* TWO-COLUMN EDITORIAL SPLIT: WHAT'S NEXT & ANNOUNCEMENTS    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* SECTION 3.3: WHAT'S NEXT (7 COLS) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-[#D2B47C] shrink-0" />
                <h2 className="text-base font-serif font-bold text-[#F5F3EF] truncate">
                  What&apos;s Next on Programme
                </h2>
              </div>
              <Link
                href="/app/agenda"
                className="text-xs text-[#D2B47C] hover:underline flex items-center gap-1 font-medium shrink-0 ml-2"
              >
                <span>Full Programme</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((ses) => {
                  const sesSpeakers = speakers.filter(s => ses.speakerIds.includes(s.id));
                  const isBookmarked = bookmarkedIds.includes(ses.id);

                  return (
                    <div
                      key={ses.id}
                      className="surface-interactive p-4 transition-all space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                          <span className="font-mono text-xs font-bold text-[#D2B47C] bg-[#152235] px-2 py-0.5 rounded border border-[#202C3D] whitespace-nowrap">
                            {ses.startTime}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-[#91A0B4] bg-white/[0.04] px-2 py-0.5 rounded whitespace-nowrap">
                            {ses.category}
                          </span>
                          {ses.liveStatus === 'delayed' && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
                              Delayed by 15m
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleBookmark(ses.id, e)}
                          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border text-xs transition-colors flex items-center justify-center shrink-0 ${
                            isBookmarked 
                              ? 'bg-[#D2B47C]/20 border-[#D2B47C] text-[#D2B47C]' 
                              : 'bg-[#101927] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF]'
                          }`}
                          title={isBookmarked ? 'Saved in My Schedule' : 'Save to My Schedule'}
                          aria-label={isBookmarked ? 'Saved in My Schedule' : 'Save to My Schedule'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D2B47C]' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#F5F3EF] group-hover:text-[#D2B47C] transition-colors leading-snug">
                          {ses.title}
                        </h4>
                        <p className="text-xs text-[#91A0B4] line-clamp-2 mt-1 leading-relaxed font-light">
                          {ses.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#202C3D] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#91A0B4] flex items-center gap-1.5 text-[11px] min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
                          <span className="truncate">{ses.stage || ses.location}</span>
                        </span>

                        {sesSpeakers.length > 0 && (
                          <div className="text-[11px] text-[#F5F3EF] font-medium truncate max-w-[200px]">
                            {sesSpeakers.map(s => s.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="surface-card p-6 text-center text-xs text-[#91A0B4]">
                  No upcoming sessions remaining for today. Explore Day 2 programme or evening networking receptions.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3.4: LIVE ANNOUNCEMENTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D2B47C] shrink-0" />
                <h2 className="text-base font-serif font-bold text-[#F5F3EF]">
                  Live Announcements
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#91A0B4] uppercase tracking-wider shrink-0">
                Conclave Broadcast
              </span>
            </div>

            <div className="space-y-2.5">
              {announcements.slice(0, 3).map((ann) => {
                const isUnread = !readAnnouncementIds.includes(ann.id);
                return (
                  <div
                    key={ann.id}
                    onClick={() => handleOpenAnnouncement(ann)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl border text-xs space-y-2 cursor-pointer transition-all hover:border-[#D2B47C]/40 ${
                      ann.priority === 'urgent'
                        ? 'bg-red-950/20 border-red-500/40'
                        : ann.priority === 'high'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-[#101927] border-[#202C3D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#F5F3EF] min-w-0 flex-1">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#D2B47C] shrink-0" />
                        )}
                        {ann.priority === 'urgent' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        )}
                        <span className="truncate">{ann.title}</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-[#D2B47C] shrink-0">
                        {ann.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#91A0B4] line-clamp-2 leading-relaxed break-words">
                      {ann.message}
                    </p>

                    <div className="pt-1.5 border-t border-white/5 text-[10px] text-[#91A0B4]/70 flex items-center justify-between gap-2">
                      <span className="truncate max-w-[160px] sm:max-w-none">{ann.author}</span>
                      <span className="text-[#D2B47C] font-semibold hover:underline shrink-0 flex items-center gap-1">
                        <span>Read full update</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SECTION 3.5: SUBTLE REAL-TIME EVENT ACTIVITY FEED         */}
        {/* ========================================================= */}
        <section className="surface-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#D2B47C] shrink-0" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#91A0B4] font-semibold truncate">
                Event Activity Feed
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#91A0B4] shrink-0">
              Synchronized Live
            </span>
          </div>

          <div className="divide-y divide-[#202C3D]">
            {activityFeed.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3 text-xs">
                <span className="w-16 min-w-[4rem] font-mono text-[11px] text-[#D2B47C] shrink-0 pt-0.5 font-semibold text-left">
                  {item.time}
                </span>
                <span className="text-[#F5F3EF] leading-relaxed flex-1 min-w-0 break-words">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ========================================================= */}
      {/* SPEAKER DETAILS MODAL / DRAWER                            */}
      {/* ========================================================= */}
      {activeSpeakerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card-elevated w-full max-w-lg p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setActiveSpeakerModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
              aria-label="Close speaker details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D2B47C] shrink-0 bg-[#152235]">
                <img
                  src={activeSpeakerModal.imageUrl || activeSpeakerModal.avatarUrl}
                  alt={activeSpeakerModal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-serif font-bold text-[#F5F3EF] truncate">
                  {activeSpeakerModal.name}
                </h3>
                <div className="text-xs text-[#D2B47C] font-semibold truncate">
                  {activeSpeakerModal.designation || activeSpeakerModal.title}
                </div>
                <div className="text-xs text-[#91A0B4] truncate">
                  {activeSpeakerModal.organization}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#91A0B4] leading-relaxed border-t border-[#202C3D] pt-3">
              <div className="font-mono uppercase text-[10px] text-[#D2B47C] font-semibold">
                Biography &amp; Track Background
              </div>
              <p>{activeSpeakerModal.biography || activeSpeakerModal.bio}</p>
            </div>

            {activeSpeakerModal.expertise && activeSpeakerModal.expertise.length > 0 && (
              <div className="space-y-2 text-xs border-t border-[#202C3D] pt-3">
                <div className="font-mono uppercase text-[10px] text-[#91A0B4]">
                  Domain Expertise
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeSpeakerModal.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="px-2.5 py-1 rounded-md bg-[#101927] border border-[#202C3D] text-[11px] text-[#F5F3EF]"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#202C3D] flex items-center justify-between gap-3">
              <Link
                href="/app/people"
                onClick={() => setActiveSpeakerModal(null)}
                className="min-h-[40px] flex items-center text-xs text-[#D2B47C] hover:underline font-semibold"
              >
                View in People Directory →
              </Link>
              <button
                onClick={() => setActiveSpeakerModal(null)}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#F5F3EF] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ANNOUNCEMENT FULL DETAIL MODAL                            */}
      {/* ========================================================= */}
      {activeAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card-elevated w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveAnnouncementModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
              aria-label="Close announcement"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D2B47C]/15 text-[#D2B47C] font-semibold">
                  {activeAnnouncementModal.category}
                </span>
                <span className="text-[10px] font-mono text-[#91A0B4]">
                  {activeAnnouncementModal.publishedAt}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F3EF] pt-1">
                {activeAnnouncementModal.title}
              </h3>
            </div>

            <p className="text-xs text-[#91A0B4] leading-relaxed">
              {activeAnnouncementModal.message}
            </p>

            <div className="pt-3 border-t border-[#202C3D] flex items-center justify-between text-xs text-[#91A0B4] gap-2">
              <span className="truncate">Issued by: <strong className="text-[#F5F3EF]">{activeAnnouncementModal.author}</strong></span>
              <button
                onClick={() => setActiveAnnouncementModal(null)}
                className="min-h-[40px] px-4 py-2 rounded-lg champagne-btn text-xs font-semibold shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
