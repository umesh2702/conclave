'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { useAuth } from '../../../context/AuthContext';
import { Storage } from '../../../services/storage';
import { ConnectionService } from '../../../services/connectionService';
import { MeetingRequestModal } from '../../../components/meetings/MeetingRequestModal';
import { Attendee, Connection } from '../../../types';
import { 
  Network, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  UserPlus, 
  Search, 
  Building2, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function ConnectionsPage() {
  const { currentUser, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<'accepted' | 'received' | 'sent'>('accepted');
  const [search, setSearch] = useState('');
  const [meetingTarget, setMeetingTarget] = useState<Attendee | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E18] text-[#9AA6B5]">
        Loading connections...
      </div>
    );
  }

  const attendees = Storage.getAttendees();
  const connectionsData = ConnectionService.getConnectionsForAttendee(currentUser.id);

  const handleAccept = (connId: string) => {
    ConnectionService.acceptConnection(connId);
    refresh();
  };

  const handleDecline = (connId: string) => {
    ConnectionService.declineConnection(connId);
    refresh();
  };

  const handleCancel = (connId: string) => {
    ConnectionService.cancelConnection(connId);
    refresh();
  };

  const getOtherAttendee = (conn: Connection): Attendee | undefined => {
    const otherId = conn.requesterId === currentUser.id ? conn.recipientId : conn.requesterId;
    return attendees.find((a) => a.id === otherId);
  };

  const currentList =
    activeTab === 'accepted'
      ? connectionsData.accepted
      : activeTab === 'received'
      ? connectionsData.received
      : connectionsData.sent;

  const filteredList = currentList.filter((conn) => {
    const person = getOtherAttendee(conn);
    if (!person) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      person.fullName.toLowerCase().includes(q) ||
      person.organization.toLowerCase().includes(q) ||
      person.designation.toLowerCase().includes(q) ||
      person.industry.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
              <Network className="w-3.5 h-3.5" />
              <span>Conclave Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
              Connection Management
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B5]">
              Track inbound investor introductions, outbound founder requests, and confirmed relationships.
            </p>
          </div>

          <Link
            href="/app/people"
            className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold champagne-btn shadow-md flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Discover More Delegates</span>
          </Link>
        </div>

        {/* Tab & Search Bar */}
        <div className="card-glass rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#080E18] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'accepted'
                  ? 'bg-[#172335] text-[#DFC394] shadow-sm'
                  : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
              }`}
            >
              Connected ({connectionsData.accepted.length})
            </button>

            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'received'
                  ? 'bg-[#172335] text-[#DFC394] shadow-sm'
                  : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
              }`}
            >
              <span>Received</span>
              {connectionsData.received.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C7A875] text-[#080E18] text-[10px] font-bold flex items-center justify-center">
                  {connectionsData.received.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sent'
                  ? 'bg-[#172335] text-[#DFC394] shadow-sm'
                  : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
              }`}
            >
              Sent ({connectionsData.sent.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9AA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in connections..."
              className="w-full rounded-xl bg-[#111B2A] border border-white/10 pl-9 pr-4 py-2 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
            />
          </div>
        </div>

        {/* Connections List */}
        {filteredList.length === 0 ? (
          <div className="card-glass rounded-2xl p-12 text-center border border-white/10 space-y-3">
            <Network className="w-10 h-10 text-[#9AA6B5] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#F5F3EF]">
              No {activeTab} connections found
            </h3>
            <p className="text-xs text-[#9AA6B5] max-w-sm mx-auto">
              {activeTab === 'received'
                ? 'You have answered all incoming connection requests.'
                : activeTab === 'sent'
                ? "You haven't sent any pending connection requests."
                : 'Connect with participants from the conclave directory to begin scheduling deal meetings.'}
            </p>
            <Link
              href="/app/people"
              className="inline-block px-4 py-2 rounded-xl text-xs font-semibold champagne-btn mt-2"
            >
              Explore Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((conn) => {
              const person = getOtherAttendee(conn);
              if (!person) return null;

              return (
                <div
                  key={conn.id}
                  className="card-glass rounded-xl p-5 border border-white/10 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#172335] shrink-0 border border-white/10">
                          {person.avatarUrl ? (
                            <img
                              src={person.avatarUrl}
                              alt={person.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#DFC394]">
                              {person.fullName[0]}
                            </div>
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/app/people/${person.id}`}
                            className="font-bold text-sm text-[#F5F3EF] hover:text-[#DFC394] transition-colors"
                          >
                            {person.fullName}
                          </Link>
                          <div className="text-xs text-[#DFC394]">{person.designation}</div>
                          <div className="text-xs text-[#9AA6B5] flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{person.organization}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/5 border border-white/10 text-[#9AA6B5]">
                        {person.category}
                      </span>
                    </div>

                    {conn.message && (
                      <p className="text-xs text-[#9AA6B5] italic bg-[#111B2A] p-2.5 rounded-lg border border-white/5">
                        "{conn.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/app/people/${person.id}`}
                      className="text-[#9AA6B5] hover:text-[#F5F3EF] flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {activeTab === 'received' && (
                        <>
                          <button
                            onClick={() => handleAccept(conn.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDecline(conn.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {activeTab === 'sent' && (
                        <button
                          onClick={() => handleCancel(conn.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9AA6B5] hover:text-red-400 border border-white/5 transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}

                      {activeTab === 'accepted' && (
                        <button
                          onClick={() => setMeetingTarget(person)}
                          className="px-3 py-1.5 rounded-lg bg-[#C7A875]/20 text-[#DFC394] hover:bg-[#C7A875]/30 border border-[#C7A875]/30 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Deal Room</span>
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
      {meetingTarget && (
        <MeetingRequestModal
          recipient={meetingTarget}
          isOpen={!!meetingTarget}
          onClose={() => setMeetingTarget(null)}
          onSuccess={refresh}
        />
      )}

      <Footer />
    </div>
  );
}
