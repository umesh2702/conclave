'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { Storage } from '../../services/storage';
import { AttendeeService } from '../../services/attendeeService';
import { ConnectionService } from '../../services/connectionService';
import { MeetingService } from '../../services/meetingService';
import { AnnouncementService } from '../../services/announcementService';
import { AttendeeCard } from '../../components/directory/AttendeeCard';
import { MeetingRequestModal } from '../../components/meetings/MeetingRequestModal';
import { Attendee } from '../../types';
import { 
  QrCode, 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Users, 
  Calendar, 
  Network, 
  CheckCircle2, 
  XCircle, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Megaphone,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AttendeeDashboardPage() {
  const { currentUser, role, refresh } = useAuth();
  const [meetingModalRecipient, setMeetingModalRecipient] = useState<Attendee | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E18] text-[#9AA6B5]">
        Loading conclave profile...
      </div>
    );
  }

  const event = Storage.getEvent();
  const sessions = Storage.getSessions();
  const bookmarkedSessionIds = Storage.getBookmarkedSessionIds();
  const bookmarkedSessions = sessions.filter((s) => bookmarkedSessionIds.includes(s.id));
  const nextSession = sessions[0]; // First upcoming session

  const connectionsData = ConnectionService.getConnectionsForAttendee(currentUser.id);
  const meetings = MeetingService.getMeetingsForAttendee(currentUser.id);
  const announcements = AnnouncementService.getAnnouncements().slice(0, 3);
  const recommendations = AttendeeService.getRecommendationsFor(currentUser);

  const attendees = Storage.getAttendees();

  const handleAcceptConnection = (connId: string) => {
    ConnectionService.acceptConnection(connId);
    refresh();
  };

  const handleDeclineConnection = (connId: string) => {
    ConnectionService.declineConnection(connId);
    refresh();
  };

  const handleConfirmMeeting = (meetId: string) => {
    MeetingService.confirmMeeting(meetId);
    refresh();
  };

  const handleDeclineMeeting = (meetId: string) => {
    MeetingService.declineMeeting(meetId);
    refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Personalized Welcome Header */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C7A875]/10 via-[#7998B8]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C7A875]/15 text-[#DFC394] border border-[#C7A875]/30">
                  {currentUser.category} DELEGATE
                </span>
                <span className="text-xs text-[#9AA6B5]">•</span>
                <span className="text-xs text-[#9AA6B5] font-mono">{currentUser.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3EF]">
                Welcome back, {currentUser.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-[#9AA6B5]">
                {currentUser.designation} at <span className="text-[#F5F3EF] font-medium">{currentUser.organization}</span>
                {currentUser.founderProfile && ` • ${currentUser.founderProfile.stage} Stage (${currentUser.founderProfile.fundingRequirement} target)`}
                {currentUser.investorProfile && ` • ${currentUser.investorProfile.investmentCategory} (${currentUser.investorProfile.ticketSize} checks)`}
              </p>
            </div>

            {/* Quick Digital Pass Badge CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/app/pass"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#172335] hover:bg-[#1f2f47] border border-[#C7A875]/40 text-xs font-semibold text-[#DFC394] shadow-sm transition-all group"
              >
                <QrCode className="w-4 h-4 text-[#C7A875] group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] uppercase text-[#9AA6B5] tracking-wider font-mono">
                    Entry Badge
                  </div>
                  <span>View Digital Pass</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Announcements Ticker */}
        {announcements.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#111B2A]/90 border border-[#C7A875]/20 flex items-start gap-3">
            <Megaphone className="w-4 h-4 text-[#DFC394] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F5F3EF]">
                  {announcements[0].title}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#C7A875]/20 text-[#DFC394] font-semibold">
                  {announcements[0].category}
                </span>
              </div>
              <p className="text-[11px] text-[#9AA6B5] truncate mt-0.5">
                {announcements[0].message}
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Upcoming Session Card */}
            {nextSession && (
              <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DFC394]" />
                    <h3 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                      Next Scheduled Conclave Session
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#9AA6B5] bg-white/5 px-2 py-0.5 rounded">
                    {nextSession.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#DFC394] bg-[#172335] px-2 py-0.5 rounded border border-white/5">
                      {nextSession.startTime} – {nextSession.endTime}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#C7A875]/15 text-[#DFC394] border border-[#C7A875]/20">
                      {nextSession.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#F5F3EF]">
                    {nextSession.title}
                  </h4>
                  <p className="text-xs text-[#9AA6B5] leading-relaxed">
                    {nextSession.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#9AA6B5] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C7A875]" />
                    <span>{nextSession.location}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link
                    href="/app/agenda"
                    className="text-[#DFC394] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View full 2-day schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-[#9AA6B5]">
                    {bookmarkedSessions.length} session{bookmarkedSessions.length !== 1 ? 's' : ''} bookmarked
                  </span>
                </div>
              </div>
            )}

            {/* Pending Connection Requests (Inline Actionable) */}
            {connectionsData.received.length > 0 && (
              <div className="card-glass rounded-2xl p-6 border border-[#C7A875]/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-[#DFC394]" />
                    <h3 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                      Pending Connection Requests ({connectionsData.received.length})
                    </h3>
                  </div>
                  <Link
                    href="/app/connections"
                    className="text-xs text-[#9AA6B5] hover:text-[#DFC394]"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {connectionsData.received.map((conn) => {
                    const sender = attendees.find((a) => a.id === conn.requesterId);
                    if (!sender) return null;

                    return (
                      <div
                        key={conn.id}
                        className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#172335] shrink-0 border border-white/10">
                            {sender.avatarUrl ? (
                              <img
                                src={sender.avatarUrl}
                                alt={sender.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#DFC394]">
                                {sender.fullName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[#F5F3EF]">
                              {sender.fullName}
                            </div>
                            <div className="text-[11px] text-[#9AA6B5]">
                              {sender.designation} • {sender.organization} ({sender.category})
                            </div>
                            {conn.message && (
                              <p className="text-[11px] text-[#DFC394]/90 italic mt-1 bg-white/[0.02] p-1.5 rounded">
                                "{conn.message}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleAcceptConnection(conn.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDeclineConnection(conn.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9AA6B5] hover:text-[#F5F3EF] text-xs font-medium transition-colors"
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

            {/* Recommended Matches for You */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F5F3EF]">
                    Recommended for You
                  </h3>
                  <p className="text-xs text-[#9AA6B5]">
                    Matched based on your {currentUser.category} profile, sector focus, and stage
                  </p>
                </div>
                <Link
                  href="/app/people"
                  className="text-xs text-[#DFC394] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Explore Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((rec) => {
                  const existingConn = ConnectionService.getConnectionBetween(
                    currentUser.id,
                    rec.id
                  );
                  return (
                    <AttendeeCard
                      key={rec.id}
                      attendee={rec}
                      existingConnection={existingConn}
                      onConnectionChange={refresh}
                      onScheduleMeeting={(target) => setMeetingModalRecipient(target)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="space-y-8">
            {/* 1:1 Scheduled Meetings Snapshot */}
            <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#DFC394]" />
                  <h3 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                    Deal Room Meetings ({meetings.length})
                  </h3>
                </div>
                <Link
                  href="/app/meetings"
                  className="text-xs text-[#9AA6B5] hover:text-[#DFC394]"
                >
                  Manage
                </Link>
              </div>

              {meetings.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#9AA6B5] space-y-2">
                  <p>No 1:1 meetings scheduled yet.</p>
                  <Link
                    href="/app/people"
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#172335] text-[#DFC394] font-semibold text-xs border border-white/10"
                  >
                    Browse & Request Meetings
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((m) => {
                    const otherId = m.requesterId === currentUser.id ? m.recipientId : m.requesterId;
                    const otherPerson = attendees.find((a) => a.id === otherId);
                    const isIncoming = m.recipientId === currentUser.id && m.status === 'pending';

                    return (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-[#111B2A] border border-white/5 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              m.status === 'confirmed'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : m.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-red-500/15 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {m.status}
                          </span>
                          <span className="font-mono text-[10px] text-[#DFC394]">
                            {m.timeSlot}
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-[#F5F3EF]">
                            {otherPerson?.fullName || 'Delegate'}
                          </div>
                          <div className="text-[11px] text-[#9AA6B5]">
                            {otherPerson?.organization} • {m.location}
                          </div>
                        </div>

                        {isIncoming && (
                          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                            <button
                              onClick={() => handleConfirmMeeting(m.id)}
                              className="flex-1 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleDeclineMeeting(m.id)}
                              className="flex-1 py-1 rounded bg-white/5 text-[#9AA6B5] text-[11px] hover:bg-white/10 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Personal Bookmarked Schedule */}
            <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#7998B8]" />
                  <h3 className="text-xs font-bold text-[#A6C5E8] uppercase tracking-wider">
                    My Bookmarked Agenda ({bookmarkedSessions.length})
                  </h3>
                </div>
                <Link
                  href="/app/agenda"
                  className="text-xs text-[#9AA6B5] hover:text-[#DFC394]"
                >
                  All Sessions
                </Link>
              </div>

              {bookmarkedSessions.length === 0 ? (
                <p className="text-xs text-[#9AA6B5] py-4 text-center">
                  You haven't bookmarked any sessions yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {bookmarkedSessions.slice(0, 3).map((ses) => (
                    <div
                      key={ses.id}
                      className="p-3 rounded-xl bg-[#111B2A] border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-[#DFC394] font-semibold">
                          {ses.startTime}
                        </span>
                        <span className="text-[#9AA6B5]">{ses.location.split('(')[0]}</span>
                      </div>
                      <div className="font-bold text-[#F5F3EF] truncate">{ses.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Conclave Secretariat Support Card */}
            <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C7A875]" />
                <span>On-Site Secretariat Desk</span>
              </div>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                Need assistance with deal pod booking or badge credentials? Visit the ULink Live Desk on Level 1.
              </p>
              <div className="pt-2 text-[11px] text-[#F5F3EF]">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#9AA6B5]">Help Desk:</span>
                  <span>Grand Ballroom Entrance</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#9AA6B5]">Helpline:</span>
                  <span className="font-mono text-[#DFC394]">+91 040 4890 8800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Meeting Request Modal */}
      {meetingModalRecipient && (
        <MeetingRequestModal
          recipient={meetingModalRecipient}
          isOpen={!!meetingModalRecipient}
          onClose={() => setMeetingModalRecipient(null)}
          onSuccess={refresh}
        />
      )}

      <Footer />
    </div>
  );
}
