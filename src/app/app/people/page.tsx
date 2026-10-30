'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { AttendeeService } from '@/services/attendeeService';
import { ConnectionService } from '@/services/connectionService';
import { AttendeeCard } from '@/components/directory/AttendeeCard';
import { MeetingRequestModal } from '@/components/meetings/MeetingRequestModal';
import { Attendee, Speaker, Session, Connection } from '@/types';
import { 
  Users, 
  Mic, 
  Search, 
  Filter, 
  Handshake, 
  X, 
  Building2, 
  Check, 
  Clock, 
  Calendar, 
  Compass, 
  TrendingUp, 
  Briefcase, 
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function PeopleConsolidatedPage() {
  const { currentUser, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<'delegates' | 'speakers' | 'connections'>('delegates');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Modals & Drawers
  const [meetingTarget, setMeetingTarget] = useState<Attendee | null>(null);
  const [detailAttendee, setDetailAttendee] = useState<Attendee | null>(null);
  const [detailSpeaker, setDetailSpeaker] = useState<Speaker | null>(null);

  const loadData = () => {
    setAttendees(StorageService.getAttendees());
    setSpeakers(StorageService.getSpeakers());
    setSessions(StorageService.getSessions());
    setConnections(StorageService.getConnections());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, []);

  const categories = [
    'All',
    'Founder',
    'Investor',
    'Mentor',
    'Financial Institution',
    'Ecosystem Partner',
  ];

  const industries = [
    'All',
    'AI & Deep Tech',
    'Enterprise SaaS',
    'Fintech & Payments',
    'Clean Energy & Climate',
    'Healthtech & Biotech',
    'Robotics & Hardware',
  ];

  // Filtered Delegates
  const filteredAttendees = AttendeeService.getAttendees({
    category: selectedCategory,
    industry: selectedIndustry,
    stage: selectedStage,
    searchQuery: search,
  });

  // Filtered Speakers
  const filteredSpeakers = speakers.filter((speaker) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      speaker.name.toLowerCase().includes(q) ||
      speaker.organization.toLowerCase().includes(q) ||
      (speaker.designation || speaker.title || '').toLowerCase().includes(q) ||
      (speaker.expertise && speaker.expertise.some((e) => e.toLowerCase().includes(q)))
    );
  });

  // My Connections
  const myConnections = currentUser ? ConnectionService.getConnectionsForAttendee(currentUser.id) : null;

  const handleAcceptConnection = (connId: string) => {
    ConnectionService.acceptConnection(connId);
    loadData();
  };

  const handleDeclineConnection = (connId: string) => {
    ConnectionService.declineConnection(connId);
    loadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F5F3EF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8 w-full space-y-5 sm:space-y-6 pb-28 md:pb-12">
        
        {/* Header & Primary Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-[#202C3D]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D2B47C] font-semibold">
                Conclave Directory
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#152235] text-[#91A0B4] border border-[#202C3D]">
                {attendees.length} Verified Participants
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF] tracking-tight">
              People, Speakers &amp; Connections
            </h1>
          </div>

          {/* Consolidated Three Primary Views */}
          <div className="flex items-center bg-[#101927] p-1 rounded-xl border border-[#202C3D] self-stretch sm:self-start md:self-auto overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('delegates')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'delegates'
                  ? 'bg-[#D2B47C] text-[#080D16] shadow-sm'
                  : 'text-[#91A0B4] hover:text-[#F5F3EF]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Delegates ({attendees.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('speakers')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'speakers'
                  ? 'bg-[#D2B47C] text-[#080D16] shadow-sm'
                  : 'text-[#91A0B4] hover:text-[#F5F3EF]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speakers ({speakers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'connections'
                  ? 'bg-[#D2B47C] text-[#080D16] shadow-sm'
                  : 'text-[#91A0B4] hover:text-[#F5F3EF]'
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>My Network</span>
              {myConnections && myConnections.received.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D2B47C] text-[#080D16] text-[9px] font-bold flex items-center justify-center">
                  {myConnections.received.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Search & Filter Bar */}
        <div className="surface-card p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#91A0B4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'speakers'
                    ? 'Search speakers by name, topic, or expertise...'
                    : 'Search delegates by name, company, or industry...'
                }
                className="w-full min-h-[40px] bg-[#080D16] border border-[#202C3D] rounded-xl pl-9 pr-9 py-2 text-xs text-[#F5F3EF] placeholder-[#91A0B4] focus:outline-none focus:border-[#D2B47C]/50"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="w-8 h-8 min-w-[32px] min-h-[32px] absolute right-1.5 top-1/2 -translate-y-1/2 text-[#91A0B4] hover:text-[#F5F3EF] flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Delegate Category Filter (Only on Delegates Tab) */}
            {activeTab === 'delegates' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto min-h-[40px] bg-[#080D16] border border-[#202C3D] rounded-xl px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#D2B47C]/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#101927]">
                      Category: {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full sm:w-auto min-h-[40px] bg-[#080D16] border border-[#202C3D] rounded-xl px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#D2B47C]/50 hidden md:block"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-[#101927]">
                      Sector: {ind}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: DELEGATES DIRECTORY                               */}
        {/* ========================================================= */}
        {activeTab === 'delegates' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#91A0B4] flex items-center justify-between pb-1">
              <span>Showing {filteredAttendees.length} curated delegates</span>
              {(selectedCategory !== 'All' || selectedIndustry !== 'All' || search) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedIndustry('All');
                    setSearch('');
                  }}
                  className="text-[#D2B47C] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredAttendees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttendees.map((attendee) => {
                  const existingConn = connections.find(
                    (c) =>
                      (c.requesterId === currentUser?.id && c.recipientId === attendee.id) ||
                      (c.recipientId === currentUser?.id && c.requesterId === attendee.id)
                  );

                  return (
                    <AttendeeCard
                      key={attendee.id}
                      attendee={attendee}
                      existingConnection={existingConn}
                      onConnectionChange={loadData}
                      onScheduleMeeting={(att) => setMeetingTarget(att)}
                      onOpenDetails={(att) => setDetailAttendee(att)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="surface-card p-12 text-center text-xs text-[#91A0B4]">
                No delegates match your current search query or filter parameters.
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SPEAKERS DOSSIER                                  */}
        {/* ========================================================= */}
        {activeTab === 'speakers' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#91A0B4]">
              Showing {filteredSpeakers.length} distinguished keynote speakers &amp; allocators
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSpeakers.map((speaker) => {
                const speakerSessions = sessions.filter((s) => s.speakerIds.includes(speaker.id));

                return (
                  <div
                    key={speaker.id}
                    onClick={() => setDetailSpeaker(speaker)}
                    className="surface-interactive p-5 rounded-xl cursor-pointer flex flex-col justify-between h-full group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D2B47C]/40 shrink-0 bg-[#152235]">
                          <img
                            src={speaker.imageUrl || speaker.avatarUrl}
                            alt={speaker.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#F5F3EF] group-hover:text-[#D2B47C] transition-colors truncate">
                            {speaker.name}
                          </h3>
                          <div className="text-xs text-[#D2B47C] font-medium truncate">
                            {speaker.designation || speaker.title}
                          </div>
                          <div className="text-[11px] text-[#91A0B4] truncate">
                            {speaker.organization}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#91A0B4] line-clamp-2 leading-relaxed font-light">
                        {speaker.biography || speaker.bio}
                      </p>

                      {speaker.expertise && speaker.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {speaker.expertise.slice(0, 3).map((exp) => (
                            <span
                              key={exp}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#080D16] border border-[#202C3D] text-[#91A0B4]"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Associated Sessions */}
                    <div className="pt-3 border-t border-[#202C3D] mt-3 flex items-center justify-between text-xs">
                      <span className="text-[#91A0B4] text-[11px]">
                        {speakerSessions.length} Scheduled Track{speakerSessions.length === 1 ? '' : 's'}
                      </span>
                      <span className="text-[#D2B47C] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        <span>View Bio &amp; Sessions</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: MY NETWORK & CONNECTIONS                          */}
        {/* ========================================================= */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            {myConnections ? (
              <>
                {/* Pending Incoming Requests */}
                {myConnections.received.length > 0 && (
                  <div className="surface-card p-5 space-y-3 border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-[#F5F3EF]">
                        Incoming Connection Requests ({myConnections.received.length})
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {myConnections.received.map((conn) => {
                        const requester = AttendeeService.getAttendeeById(conn.requesterId);
                        if (!requester) return null;

                        return (
                          <div
                            key={conn.id}
                            className="p-3.5 rounded-xl bg-[#080D16] border border-[#202C3D] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#152235] border border-white/10 overflow-hidden flex items-center justify-center font-bold text-[#D2B47C]">
                                {requester.avatarUrl ? (
                                  <img src={requester.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  requester.fullName[0]
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-[#F5F3EF]">{requester.fullName}</div>
                                <div className="text-[11px] text-[#91A0B4]">{requester.designation} • {requester.organization}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleAcceptConnection(conn.id)}
                                className="px-3 py-1.5 rounded-lg champagne-btn text-xs font-semibold"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineConnection(conn.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#91A0B4]"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Established / Accepted Connections */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#91A0B4]">
                    Established Bilateral Connections ({myConnections.accepted.length})
                  </div>

                  {myConnections.accepted.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myConnections.accepted.map((conn) => {
                        const otherId = conn.requesterId === currentUser?.id ? conn.recipientId : conn.requesterId;
                        const otherAttendee = AttendeeService.getAttendeeById(otherId);
                        if (!otherAttendee) return null;

                        return (
                          <AttendeeCard
                            key={otherAttendee.id}
                            attendee={otherAttendee}
                            existingConnection={conn}
                            onConnectionChange={loadData}
                            onScheduleMeeting={(att) => setMeetingTarget(att)}
                            onOpenDetails={(att) => setDetailAttendee(att)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="surface-card p-8 text-center text-xs text-[#91A0B4]">
                      You have not connected with any delegates yet. Explore the Delegates tab to send connection requests!
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="surface-card p-8 text-center text-xs text-[#91A0B4]">
                Please log in to view your personalized conclave network.
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* ATTENDEE DETAIL DRAWER                                    */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* ATTENDEE DETAIL DRAWER                                    */}
      {/* ========================================================= */}
      {detailAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card-elevated w-full max-w-lg p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setDetailAttendee(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
              aria-label="Close attendee details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D2B47C] shrink-0 bg-[#152235]">
                {detailAttendee.avatarUrl ? (
                  <img src={detailAttendee.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#D2B47C]">
                    {detailAttendee.fullName[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-serif font-bold text-[#F5F3EF] truncate">
                  {detailAttendee.fullName}
                </h3>
                <div className="text-xs text-[#D2B47C] font-semibold truncate">
                  {detailAttendee.designation} • {detailAttendee.organization}
                </div>
                <div className="text-xs text-[#91A0B4] mt-0.5 truncate">
                  {detailAttendee.location} • {detailAttendee.category}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#91A0B4] leading-relaxed border-t border-[#202C3D] pt-3">
              <div className="font-mono uppercase text-[10px] text-[#D2B47C] font-semibold">
                Delegate Profile &amp; Bio
              </div>
              <p>{detailAttendee.bio}</p>
            </div>

            {/* Founder Profile Details */}
            {detailAttendee.founderProfile && (
              <div className="p-3.5 rounded-xl bg-[#101927] border border-[#202C3D] text-xs space-y-2">
                <div className="font-bold text-[#F5F3EF] flex items-center justify-between">
                  <span>Startup: {detailAttendee.founderProfile.startupName}</span>
                  <span className="text-[#D2B47C] font-mono">{detailAttendee.founderProfile.stage} Stage</span>
                </div>
                <p className="text-[#91A0B4]">{detailAttendee.founderProfile.shortDescription}</p>
                <div className="text-[11px] text-[#D2B47C] font-mono">
                  Capital Requirement: {detailAttendee.founderProfile.fundingRequirement}
                </div>
              </div>
            )}

            {/* Investor Profile Details */}
            {detailAttendee.investorProfile && (
              <div className="p-3.5 rounded-xl bg-[#101927] border border-[#202C3D] text-xs space-y-2">
                <div className="font-bold text-[#F5F3EF] flex items-center justify-between">
                  <span>{detailAttendee.investorProfile.investmentCategory}</span>
                  <span className="text-[#D2B47C] font-mono">Ticket: {detailAttendee.investorProfile.ticketSize}</span>
                </div>
                <p className="text-[#91A0B4]">{detailAttendee.investorProfile.thesisSummary}</p>
                <div className="text-[11px] text-[#91A0B4]">
                  Sectors: {detailAttendee.investorProfile.preferredSectors.join(', ')}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#202C3D] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMeetingTarget(detailAttendee);
                  setDetailAttendee(null);
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl champagne-btn text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book 1:1 Deal Pod Slot</span>
              </button>

              <button
                onClick={() => setDetailAttendee(null)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#F5F3EF] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SPEAKER DETAIL DRAWER                                     */}
      {/* ========================================================= */}
      {detailSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card-elevated w-full max-w-lg p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setDetailSpeaker(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
              aria-label="Close speaker details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D2B47C] shrink-0 bg-[#152235]">
                <img
                  src={detailSpeaker.imageUrl || detailSpeaker.avatarUrl}
                  alt={detailSpeaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-serif font-bold text-[#F5F3EF] truncate">
                  {detailSpeaker.name}
                </h3>
                <div className="text-xs text-[#D2B47C] font-semibold truncate">
                  {detailSpeaker.designation || detailSpeaker.title}
                </div>
                <div className="text-xs text-[#91A0B4] truncate">
                  {detailSpeaker.organization}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#91A0B4] leading-relaxed border-t border-[#202C3D] pt-3">
              <div className="font-mono uppercase text-[10px] text-[#D2B47C] font-semibold">
                Biography &amp; Industry Track Record
              </div>
              <p>{detailSpeaker.biography || detailSpeaker.bio}</p>
            </div>

            {/* Speaking Sessions */}
            <div className="space-y-2 border-t border-[#202C3D] pt-3">
              <div className="font-mono uppercase text-[10px] text-[#D2B47C] font-semibold">
                Conclave Speaking Sessions
              </div>
              <div className="space-y-2">
                {sessions
                  .filter((s) => s.speakerIds.includes(detailSpeaker.id))
                  .map((ses) => (
                    <div
                      key={ses.id}
                      className="p-3 rounded-lg bg-[#101927] border border-[#202C3D] text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#F5F3EF] truncate">{ses.title}</div>
                        <div className="text-[11px] text-[#91A0B4] truncate">Day {ses.day} • {ses.startTime} • {ses.stage}</div>
                      </div>
                      <Link
                        href="/app/agenda"
                        onClick={() => setDetailSpeaker(null)}
                        className="text-[11px] text-[#D2B47C] hover:underline shrink-0"
                      >
                        View in Programme →
                      </Link>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#202C3D] flex justify-end">
              <button
                onClick={() => setDetailSpeaker(null)}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#F5F3EF] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Request Modal */}
      {meetingTarget && (
        <MeetingRequestModal
          isOpen={true}
          recipient={meetingTarget}
          onClose={() => setMeetingTarget(null)}
          onSuccess={loadData}
        />
      )}

      <Footer />
    </div>
  );
}
