'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { Storage } from '../../services/storage';
import { CheckInService } from '../../services/checkInService';
import { AgendaService } from '../../services/agendaService';
import { AnnouncementService } from '../../services/announcementService';
import { CheckInScanner } from '../../components/admin/CheckInScanner';
import { AttendeeTable } from '../../components/admin/AttendeeTable';
import { LiveControlPanel } from '../../components/admin/LiveControlPanel';
import { Session, SessionCategory } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  ScanLine, 
  Calendar, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Network, 
  Download, 
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  Radio
} from 'lucide-react';

export default function AdminConsolePage() {
  const { currentUser, role, switchRole, refresh, resetAllData } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'live-control' | 'checkin' | 'attendees' | 'agenda' | 'announcements' | 'networking' | 'settings'
  >('live-control');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annCategory, setAnnCategory] = useState<'General' | 'Deal Room' | 'Schedule' | 'Venue'>('General');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [annSuccess, setAnnSuccess] = useState(false);

  // New Session state
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [sessionDay, setSessionDay] = useState(1);
  const [sessionStartTime, setSessionStartTime] = useState('11:00 AM');
  const [sessionEndTime, setSessionEndTime] = useState('12:00 PM');
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDesc, setSessionDesc] = useState('');
  const [sessionLocation, setSessionLocation] = useState('Main Conclave Hall (Level 1)');
  const [sessionCat, setSessionCat] = useState<SessionCategory>('Panel Discussion');

  const attendees = Storage.getAttendees();
  const sessions = Storage.getSessions();
  const connections = Storage.getConnections();
  const meetings = Storage.getMeetings();
  const announcements = Storage.getAnnouncements();
  const checkInStats = CheckInService.getCheckInStats();
  const event = Storage.getEvent();

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    AnnouncementService.createAnnouncement({
      title: annTitle,
      message: annMessage,
      category: annCategory,
      priority: annPriority,
      author: 'Conclave Secretariat',
    });

    setAnnTitle('');
    setAnnMessage('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 2000);
    refresh();
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;

    AgendaService.createSession({
      day: sessionDay,
      date: sessionDay === 1 ? 'Day 1 — Saturday, Nov 14' : 'Day 2 — Sunday, Nov 15',
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      title: sessionTitle,
      description: sessionDesc,
      location: sessionLocation,
      category: sessionCat,
      speakerIds: [],
    });

    setSessionTitle('');
    setSessionDesc('');
    setNewSessionOpen(false);
    refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Header & Role Notice */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ORGANIZER CONSOLE</span>
              </span>
              <span className="text-xs text-[#9AA6B5]">•</span>
              <span className="text-xs text-[#DFC394] font-medium">Startup Synerz Command Center</span>
            </div>

            <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
              Event Operations & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6B5]">
              Real-time monitoring of enrolled delegates, fast-track QR desk check-in, deal room bookings, and programme publishing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Reset entire conclave demo state to original seed data?')) {
                  resetAllData();
                }
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#9AA6B5] hover:text-[#F5F3EF] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Conclave Data</span>
            </button>
          </div>
        </div>

        {/* Executive Metric Cards (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
              <span>Enrolled Delegates</span>
              <Users className="w-4 h-4 text-[#7998B8]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F3EF]">
              {checkInStats.total}
            </div>
            <div className="text-[11px] text-[#9AA6B5] flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{attendees.filter(a => a.category === 'Founder').length}</span> Founders •{' '}
              <span className="text-[#DFC394] font-semibold">{attendees.filter(a => a.category === 'Investor').length}</span> Investors
            </div>
          </div>

          <div className="card-glass rounded-2xl p-5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
              <span>Verified Check-Ins</span>
              <ScanLine className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {checkInStats.checkedIn}{' '}
              <span className="text-sm font-normal text-[#9AA6B5]">
                / {checkInStats.total}
              </span>
            </div>
            <div className="w-full bg-[#172335] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${checkInStats.percentage}%` }}
              />
            </div>
            <div className="text-[10px] text-emerald-300/80">
              {checkInStats.percentage}% physical badge issuance
            </div>
          </div>

          <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
              <span>Networking Volume</span>
              <Network className="w-4 h-4 text-[#DFC394]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC394]">
              {connections.length}
            </div>
            <div className="text-[11px] text-[#9AA6B5]">
              {connections.filter((c) => c.status === 'accepted').length} accepted connections
            </div>
          </div>

          <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
              <span>Deal Pod Bookings</span>
              <Calendar className="w-4 h-4 text-[#7998B8]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F3EF]">
              {meetings.length}
            </div>
            <div className="text-[11px] text-emerald-400">
              {meetings.filter((m) => m.status === 'confirmed').length} confirmed 1:1 sessions
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10 no-scrollbar">
          {[
            { id: 'live-control', label: 'Live Event Control', icon: Radio },
            { id: 'checkin', label: 'QR Desk Scanner', icon: ScanLine },
            { id: 'attendees', label: 'Attendee Registry', icon: Users },
            { id: 'agenda', label: 'Programme & Sessions', icon: Calendar },
            { id: 'announcements', label: 'Broadcast Updates', icon: Megaphone },
            { id: 'networking', label: 'Networking Monitor', icon: Network },
            { id: 'settings', label: 'Conclave Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#172335] text-[#DFC394] border border-[#C7A875]/30 shadow-sm'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.id === 'live-control' && active ? 'text-emerald-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.id === 'live-control' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 0: Live Event Control Centre */}
        {activeTab === 'live-control' && (
          <div className="space-y-6">
            <LiveControlPanel onUpdate={refresh} />
          </div>
        )}

        {/* Tab 1: Check-in Scanner */}
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <CheckInScanner onCheckInCompleted={refresh} />
          </div>
        )}

        {/* Tab 2: Attendee Registry */}
        {activeTab === 'attendees' && (
          <div className="space-y-6">
            <AttendeeTable onUpdate={refresh} />
          </div>
        )}

        {/* Tab 3: Agenda Management */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F5F3EF]">
                  Session Schedule Management
                </h3>
                <p className="text-xs text-[#9AA6B5]">
                  Manage conclave tracks, times, hall locations, and speaker assignments.
                </p>
              </div>

              <button
                onClick={() => setNewSessionOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Session</span>
              </button>
            </div>

            {/* Sessions Table */}
            <div className="card-glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#172335]/70 text-[#9AA6B5] border-b border-white/10">
                      <th className="py-3 px-4 font-semibold">Day & Time</th>
                      <th className="py-3 px-4 font-semibold">Session Title</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Venue / Hall</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sessions.map((ses) => (
                      <tr key={ses.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-[#DFC394]">
                          Day {ses.day}: {ses.startTime} – {ses.endTime}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#F5F3EF]">
                          {ses.title}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-white/5 border border-white/10">
                            {ses.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#9AA6B5]">
                          {ses.location}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Published
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Broadcast Announcements */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcement Form */}
            <div className="lg:col-span-1 card-glass rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Megaphone className="w-4 h-4 text-[#DFC394]" />
                <h3 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                  Broadcast Alert
                </h3>
              </div>

              {annSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Announcement published live!</span>
                </div>
              )}

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Deal Pod Pavilions Now Open"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
                  >
                    <option value="General">General</option>
                    <option value="Deal Room">Deal Room</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Venue">Venue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Message Body *</label>
                  <textarea
                    required
                    rows={4}
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="Details for all attendees..."
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold champagne-btn shadow-md text-xs"
                >
                  Broadcast to Attendees
                </button>
              </form>
            </div>

            {/* Existing Announcements Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Active Conclave Broadcasts ({announcements.length})
              </h3>

              <div className="space-y-3">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="card-glass rounded-xl p-4 border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F5F3EF]">
                          {a.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#C7A875]/20 text-[#DFC394]">
                          {a.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9AA6B5] font-mono">
                        {new Date(a.publishedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#9AA6B5] leading-relaxed">
                      {a.message}
                    </p>

                    <div className="text-[10px] text-white/40 pt-1">
                      Published by {a.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Networking & Meeting Monitor */}
        {activeTab === 'networking' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#F5F3EF]">
              Real-time Conclave Networking Activity
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connections list */}
              <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold uppercase text-[#DFC394]">
                    Introductions & Connection Requests ({connections.length})
                  </span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {connections.map((c) => {
                    const req = attendees.find((a) => a.id === c.requesterId);
                    const rec = attendees.find((a) => a.id === c.recipientId);

                    return (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg bg-[#111B2A] border border-white/5 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-[#F5F3EF]">{req?.fullName || 'Delegate'}</span>
                          <span className="text-[#9AA6B5] mx-1.5">→</span>
                          <span className="font-semibold text-[#DFC394]">{rec?.fullName || 'Delegate'}</span>
                        </div>

                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                            c.status === 'accepted'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1:1 Meetings list */}
              <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold uppercase text-[#7998B8]">
                    Deal Room Pod Allocations ({meetings.length})
                  </span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {meetings.map((m) => {
                    const req = attendees.find((a) => a.id === m.requesterId);
                    const rec = attendees.find((a) => a.id === m.recipientId);

                    return (
                      <div
                        key={m.id}
                        className="p-3 rounded-lg bg-[#111B2A] border border-white/5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#DFC394]">
                            {m.timeSlot} • {m.location}
                          </span>
                          <span
                            className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                              m.status === 'confirmed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-300'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>

                        <div className="font-medium text-[#F5F3EF]">
                          {req?.fullName} & {rec?.fullName}
                        </div>

                        <div className="text-[11px] text-[#9AA6B5] truncate">
                          Agenda: {m.purpose}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Conclave Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl card-glass rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Conclave Configuration
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                Event parameters managed by Startup Synerz Operations
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9AA6B5] mb-1">Event Name</label>
                <input
                  type="text"
                  readOnly
                  value={event.name}
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3.5 py-2.5 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">Venue Location</label>
                <input
                  type="text"
                  readOnly
                  value={event.venue}
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3.5 py-2.5 text-xs text-[#F5F3EF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Conclave Dates</label>
                  <input
                    type="text"
                    readOnly
                    value={event.dates}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3.5 py-2.5 text-xs text-[#F5F3EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Technology Partner</label>
                  <input
                    type="text"
                    readOnly
                    value="UCreates (ULink Live)"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3.5 py-2.5 text-xs text-[#DFC394]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Session Modal */}
      {newSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <h3 className="text-base font-bold text-[#F5F3EF]">
              Add New Conclave Session
            </h3>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Day</label>
                  <select
                    value={sessionDay}
                    onChange={(e) => setSessionDay(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value={1}>Day 1 (Nov 14)</option>
                    <option value={2}>Day 2 (Nov 15)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Track Category</label>
                  <select
                    value={sessionCat}
                    onChange={(e) => setSessionCat(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value="Keynote">Keynote</option>
                    <option value="Panel Discussion">Panel Discussion</option>
                    <option value="Deal Room">Deal Room</option>
                    <option value="Pitch Track">Pitch Track</option>
                    <option value="Networking Reception">Networking Reception</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Start Time</label>
                  <input
                    type="text"
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#9AA6B5] mb-1">End Time</label>
                  <input
                    type="text"
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Global LP Sentiment in Indian DeepTech"
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">Location / Stage</label>
                <input
                  type="text"
                  value={sessionLocation}
                  onChange={(e) => setSessionLocation(e.target.value)}
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sessionDesc}
                  onChange={(e) => setSessionDesc(e.target.value)}
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewSessionOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#9AA6B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold champagne-btn"
                >
                  Publish Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
