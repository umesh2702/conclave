'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { useAuth } from '../../../context/AuthContext';
import { Storage } from '../../../services/storage';
import { MeetingService } from '../../../services/meetingService';
import { MeetingRequestModal } from '../../../components/meetings/MeetingRequestModal';
import { Attendee, Meeting, MeetingStatus } from '../../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Building2, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function MeetingsPage() {
  const { currentUser, refresh } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newMeetingModalOpen, setNewMeetingModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Attendee | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E18] text-[#9AA6B5]">
        Loading meetings...
      </div>
    );
  }

  const attendees = Storage.getAttendees();
  const allMeetings = MeetingService.getMeetingsForAttendee(currentUser.id);

  const filteredMeetings = allMeetings.filter((m) => {
    if (filterStatus === 'All') return true;
    return m.status === filterStatus.toLowerCase();
  });

  const handleConfirm = (id: string) => {
    MeetingService.confirmMeeting(id);
    refresh();
  };

  const handleDecline = (id: string) => {
    MeetingService.declineMeeting(id);
    refresh();
  };

  const handleCancel = (id: string) => {
    if (confirm('Cancel this scheduled meeting?')) {
      MeetingService.cancelMeeting(id);
      refresh();
    }
  };

  const getOtherPerson = (m: Meeting): Attendee | undefined => {
    const otherId = m.requesterId === currentUser.id ? m.recipientId : m.requesterId;
    return attendees.find((a) => a.id === otherId);
  };

  const openNewMeetingModal = () => {
    // Pick first attendee that isn't self
    const candidates = attendees.filter((a) => a.id !== currentUser.id);
    if (candidates.length > 0) {
      setSelectedRecipient(candidates[0]);
      setNewMeetingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Deal Pod Schedule</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
              1:1 Meeting Scheduler
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B5]">
              Pre-allocated 20-minute executive meetings in Level 2 Deal Pod Pavilions.
            </p>
          </div>

          <button
            onClick={openNewMeetingModal}
            className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold champagne-btn shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Deal Room Session</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card-glass rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Confirmed', 'Pending', 'Declined', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-[#C7A875] text-[#080E18] shadow-sm'
                    : 'bg-[#172335] text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#9AA6B5]">
            Total Meetings: <strong className="text-[#F5F3EF]">{filteredMeetings.length}</strong>
          </div>
        </div>

        {/* Meetings Grid / List */}
        {filteredMeetings.length === 0 ? (
          <div className="card-glass rounded-2xl p-12 text-center border border-white/10 space-y-3">
            <Calendar className="w-10 h-10 text-[#9AA6B5] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#F5F3EF]">
              No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} meetings scheduled
            </h3>
            <p className="text-xs text-[#9AA6B5] max-w-sm mx-auto">
              Request a meeting directly with any founder or investor from the directory to lock in a deal pod.
            </p>
            <Link
              href="/app/people"
              className="inline-block px-4 py-2 rounded-xl text-xs font-semibold champagne-btn mt-2"
            >
              Browse Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMeetings.map((m) => {
              const other = getOtherPerson(m);
              const isIncoming = m.recipientId === currentUser.id && m.status === 'pending';
              const isOutgoing = m.requesterId === currentUser.id && m.status === 'pending';

              return (
                <div
                  key={m.id}
                  className="card-glass rounded-xl p-5 border border-white/10 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Status & Timing */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'confirmed'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : m.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/15 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {m.status}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#DFC394]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{m.timeSlot}</span>
                      </div>
                    </div>

                    {/* Participant Details */}
                    {other && (
                      <div className="flex items-start gap-3 pt-1">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#172335] shrink-0 border border-white/10">
                          {other.avatarUrl ? (
                            <img
                              src={other.avatarUrl}
                              alt={other.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#DFC394]">
                              {other.fullName[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/app/people/${other.id}`}
                            className="font-bold text-sm text-[#F5F3EF] hover:text-[#DFC394] transition-colors truncate block"
                          >
                            {other.fullName}
                          </Link>
                          <div className="text-xs text-[#DFC394]">{other.designation}</div>
                          <div className="text-xs text-[#9AA6B5] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{other.organization} ({other.category})</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purpose */}
                    <div className="p-3 rounded-lg bg-[#111B2A] border border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-[#9AA6B5] tracking-wider">
                        Discussion Agenda:
                      </span>
                      <p className="text-xs text-[#F5F3EF] leading-relaxed">
                        {m.purpose}
                      </p>
                    </div>

                    {/* Location Pod */}
                    <div className="flex items-center gap-1.5 text-xs text-[#DFC394]">
                      <MapPin className="w-3.5 h-3.5 text-[#C7A875]" />
                      <span>{m.location}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-[#9AA6B5] font-mono">
                      ID: {m.id}
                    </span>

                    <div className="flex items-center gap-2">
                      {isIncoming && (
                        <>
                          <button
                            onClick={() => handleConfirm(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Slot</span>
                          </button>
                          <button
                            onClick={() => handleDecline(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {isOutgoing && (
                        <button
                          onClick={() => handleCancel(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9AA6B5] hover:text-red-400 border border-white/5 transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}

                      {m.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(m.id)}
                          className="px-2.5 py-1 rounded text-[11px] text-[#9AA6B5] hover:text-red-400 transition-colors"
                        >
                          Cancel Meeting
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Meeting Request Modal */}
      {newMeetingModalOpen && selectedRecipient && (
        <MeetingRequestModal
          recipient={selectedRecipient}
          isOpen={newMeetingModalOpen}
          onClose={() => setNewMeetingModalOpen(false)}
          onSuccess={refresh}
        />
      )}

      <Footer />
    </div>
  );
}
