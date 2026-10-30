'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { MeetingService } from '@/services/meetingService';
import { ConnectionService } from '@/services/connectionService';
import { AgendaService } from '@/services/agendaService';
import { AttendeeService } from '@/services/attendeeService';
import { DigitalPassCard } from '@/components/pass/DigitalPassCard';
import { Attendee, Meeting, Connection, Session } from '@/types';
import { 
  User, 
  QrCode, 
  Calendar, 
  Handshake, 
  Bookmark, 
  Settings, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Copy, 
  ExternalLink,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function MyProfilePage() {
  const { currentUser, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<'pass' | 'meetings' | 'saved' | 'settings'>('pass');
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [connections, setConnections] = useState<ReturnType<typeof ConnectionService.getConnectionsForAttendee>>({ all: [], sent: [], received: [], accepted: [], declined: [] });
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'syndicate_only' | 'hidden'>(currentUser?.visibilitySettings || 'public');
  const [savedNotice, setSavedNotice] = useState(false);

  const loadData = () => {
    if (!currentUser) return;
    const userMeetings = MeetingService.getMeetingsForAttendee(currentUser.id);
    const userConnections = ConnectionService.getConnectionsForAttendee(currentUser.id);
    const userSaved = AgendaService.getBookmarkedSessions();
    setMeetings(userMeetings);
    setConnections(userConnections);
    setSavedSessions(userSaved);
    if (currentUser.visibilitySettings) {
      setVisibility(currentUser.visibilitySettings);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080D16] text-[#91A0B4] text-xs">
        Loading profile...
      </div>
    );
  }

  const handleUpdateVisibility = (newVal: 'public' | 'syndicate_only' | 'hidden') => {
    setVisibility(newVal);
    AttendeeService.updateAttendee(currentUser.id, { visibilitySettings: newVal });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    refresh();
  };

  const handleConfirmMeeting = (meetingId: string) => {
    MeetingService.confirmMeeting(meetingId);
    loadData();
  };

  const handleDeclineMeeting = (meetingId: string) => {
    MeetingService.declineMeeting(meetingId);
    loadData();
  };

  const handleRemoveBookmark = (sessionId: string) => {
    AgendaService.toggleBookmark(sessionId);
    loadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F5F3EF]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full space-y-6 pb-28 md:pb-12">
        
        {/* Top Header Card */}
        <div className="surface-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#152235] border-2 border-[#D2B47C]/40 shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#D2B47C]">
                  {currentUser.fullName[0]}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F3EF] truncate">
                  {currentUser.fullName}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#D2B47C]/15 text-[#D2B47C] border border-[#D2B47C]/30 shrink-0">
                  {currentUser.category}
                </span>
              </div>
              <div className="text-xs text-[#91A0B4] mt-0.5 truncate">
                {currentUser.designation} • <span className="text-[#F5F3EF]">{currentUser.organization}</span>
              </div>
              <div className="text-[11px] text-[#91A0B4] mt-0.5 flex items-center gap-2">
                <span>{currentUser.location}</span>
                <span>•</span>
                <span className="font-mono text-[#D2B47C]">ID: {currentUser.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 sm:flex items-center justify-around gap-2 sm:gap-3 border-t md:border-t-0 md:border-l border-[#202C3D] pt-3 md:pt-0 md:pl-5 w-full sm:w-auto">
            <div className="text-center px-1 sm:px-2">
              <div className="text-lg font-bold font-mono text-[#D2B47C]">{meetings.length}</div>
              <div className="text-[10px] text-[#91A0B4] uppercase truncate">Meetings</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#202C3D]" />
            <div className="text-center px-1 sm:px-2">
              <div className="text-lg font-bold font-mono text-[#D2B47C]">{connections.accepted.length}</div>
              <div className="text-[10px] text-[#91A0B4] uppercase truncate">Connections</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#202C3D]" />
            <div className="text-center px-1 sm:px-2">
              <div className="text-lg font-bold font-mono text-[#D2B47C]">{savedSessions.length}</div>
              <div className="text-[10px] text-[#91A0B4] uppercase truncate">Saved Tracks</div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#202C3D] pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'pass'
                ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/30 shadow-sm'
                : 'text-[#91A0B4] hover:text-[#F5F3EF]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Event Pass &amp; Credential</span>
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'meetings'
                ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/30 shadow-sm'
                : 'text-[#91A0B4] hover:text-[#F5F3EF]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Meetings ({meetings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'saved'
                ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/30 shadow-sm'
                : 'text-[#91A0B4] hover:text-[#F5F3EF]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Sessions ({savedSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/30 shadow-sm'
                : 'text-[#91A0B4] hover:text-[#F5F3EF]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Privacy &amp; Preferences</span>
          </button>
        </div>

        {/* TAB 1: DIGITAL PASS */}
        {activeTab === 'pass' && (
          <div className="space-y-6 pt-2">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h2 className="text-xl font-serif font-bold text-[#F5F3EF]">
                Official Conclave Entry Pass
              </h2>
              <p className="text-xs text-[#91A0B4]">
                Authorized delegate credential for Capital Connect Conclave 2026. Present this QR code on your mobile device at fast-track registration kiosks.
              </p>
            </div>

            <DigitalPassCard attendee={currentUser} />

            <div className="surface-card p-5 max-w-xl mx-auto space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#D2B47C] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Venue Access Protocols</span>
              </div>
              <p className="text-[#91A0B4] leading-relaxed">
                Your pass is cryptographically hashed with token <code className="text-[#F5F3EF] font-mono">{currentUser.tokenHash}</code>. Access includes all Stage A &amp; Stage B sessions, catering pavilions, and registered Deal Room suites.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: MY MEETINGS */}
        {activeTab === 'meetings' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#F5F3EF]">
                  1:1 Deal Pod Schedule
                </h2>
                <p className="text-xs text-[#91A0B4]">
                  Bilateral discovery sessions scheduled in Deal Pod Pavilions on Level 2.
                </p>
              </div>
              <Link
                href="/app/people"
                className="w-full sm:w-auto text-center px-3.5 py-2 min-h-[40px] flex items-center justify-center rounded-lg champagne-btn text-xs font-semibold"
              >
                Schedule New Meeting
              </Link>
            </div>

            {meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((m) => {
                  const isRequester = m.requesterId === currentUser.id;
                  const partnerId = isRequester ? m.recipientId : m.requesterId;
                  const partner = AttendeeService.getAttendeeById(partnerId);

                  return (
                    <div
                      key={m.id}
                      className="surface-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#D2B47C] bg-[#152235] px-2 py-0.5 rounded border border-[#202C3D]">
                            {m.timeSlot}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                            m.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : m.status === 'declined'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {m.status}
                          </span>
                          <span className="text-[10px] text-[#91A0B4] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#D2B47C]" /> {m.location}
                          </span>
                        </div>

                        <div className="font-semibold text-sm text-[#F5F3EF]">
                          With {partner ? partner.fullName : 'Conclave Delegate'} ({partner?.organization})
                        </div>
                        <p className="text-[#91A0B4] line-clamp-1">{m.purpose}</p>
                      </div>

                      {/* Action for incoming pending */}
                      {!isRequester && m.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleConfirmMeeting(m.id)}
                            className="px-3.5 py-2 min-h-[40px] rounded-lg champagne-btn text-xs font-semibold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleDeclineMeeting(m.id)}
                            className="px-3 py-2 min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#91A0B4]"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {m.status === 'confirmed' && (
                        <Link
                          href={`/app/venue?highlight=${encodeURIComponent(m.location)}`}
                          className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#152235] border border-[#202C3D] hover:border-[#D2B47C]/40 text-xs text-[#D2B47C] flex items-center gap-1 shrink-0"
                        >
                          <span>Locate Pod</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="surface-card p-10 text-center text-xs text-[#91A0B4] space-y-2">
                <div>No 1:1 meetings currently scheduled.</div>
                <Link href="/app/people" className="text-[#D2B47C] hover:underline font-semibold inline-block py-1">
                  Browse the Delegates Directory to request a Deal Pod meeting →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED SESSIONS */}
        {activeTab === 'saved' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#F5F3EF]">
                  My Saved Sessions
                </h2>
                <p className="text-xs text-[#91A0B4]">
                  Keynotes, panels, and masterclasses bookmarked for your personalised schedule.
                </p>
              </div>
              <Link
                href="/app/agenda"
                className="text-xs text-[#D2B47C] hover:underline font-semibold min-h-[40px] flex items-center"
              >
                Browse Full Programme →
              </Link>
            </div>

            {savedSessions.length > 0 ? (
              <div className="space-y-3">
                {savedSessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="surface-card p-4 rounded-xl flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#D2B47C] bg-[#152235] px-2 py-0.5 rounded border border-[#202C3D]">
                          Day {ses.day} • {ses.startTime}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#91A0B4] bg-white/[0.04] px-2 py-0.5 rounded">
                          {ses.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#F5F3EF] truncate">{ses.title}</h4>
                      <div className="text-[11px] text-[#91A0B4] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D2B47C]" />
                        <span>{ses.stage || ses.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href="/app/agenda"
                        className="px-3.5 py-2 min-h-[40px] flex items-center justify-center rounded-lg bg-[#152235] border border-[#202C3D] hover:border-[#D2B47C]/40 text-xs text-[#F5F3EF]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(ses.id)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="surface-card p-10 text-center text-xs text-[#91A0B4] space-y-2">
                <div>You have not saved any sessions to your schedule yet.</div>
                <Link href="/app/agenda" className="text-[#D2B47C] hover:underline font-semibold">
                  Visit the Programme to bookmark tracks →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRIVACY & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 pt-2">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F5F3EF]">
                Directory Visibility &amp; Event Preferences
              </h2>
              <p className="text-xs text-[#91A0B4]">
                Control who can discover your delegate card and send meeting requests.
              </p>
            </div>

            <div className="surface-card p-5 space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#202C3D] hover:border-[#D2B47C]/30 cursor-pointer bg-[#080D16]">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public'}
                    onChange={() => handleUpdateVisibility('public')}
                    className="mt-1 text-[#D2B47C] focus:ring-[#D2B47C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#F5F3EF] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D2B47C]" />
                      <span>Public Directory Listing (Recommended)</span>
                    </div>
                    <div className="text-[11px] text-[#91A0B4] mt-0.5">
                      Your profile, thesis, and startup details are visible to all vetted delegates, founders, and institutional allocators.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#202C3D] hover:border-[#D2B47C]/30 cursor-pointer bg-[#080D16]">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'syndicate_only'}
                    onChange={() => handleUpdateVisibility('syndicate_only')}
                    className="mt-1 text-[#D2B47C] focus:ring-[#D2B47C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#F5F3EF] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Institutional &amp; Syndicate Only</span>
                    </div>
                    <div className="text-[11px] text-[#91A0B4] mt-0.5">
                      Only verified Venture Capitalists, Angels, and Family Offices can view your profile and initiate contact.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#202C3D] hover:border-[#D2B47C]/30 cursor-pointer bg-[#080D16]">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'hidden'}
                    onChange={() => handleUpdateVisibility('hidden')}
                    className="mt-1 text-[#D2B47C] focus:ring-[#D2B47C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#F5F3EF] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#91A0B4]" />
                      <span>Stealth / Private Attendee</span>
                    </div>
                    <div className="text-[11px] text-[#91A0B4] mt-0.5">
                      Hidden from the open directory. You can still scan into stages and attend pre-arranged meetings.
                    </div>
                  </div>
                </label>
              </div>

              {savedNotice && (
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Visibility preferences updated successfully!</span>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
