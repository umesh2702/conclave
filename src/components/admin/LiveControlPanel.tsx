'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Ban, 
  MapPin, 
  Navigation, 
  Megaphone, 
  Mic, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Layers,
  ChevronDown,
  Calendar,
  Users
} from 'lucide-react';
import { StorageService } from '@/services/storage';
import { AgendaService } from '@/services/agendaService';
import { AnnouncementService } from '@/services/announcementService';
import { SimulationService, SIMULATION_PRESETS } from '@/services/simulationService';
import { Session, Speaker, Announcement, SimulationClock, SessionLiveStatus } from '@/types';

interface LiveControlPanelProps {
  onUpdate: () => void;
}

export function LiveControlPanel({ onUpdate }: LiveControlPanelProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [clock, setClock] = useState<SimulationClock>(StorageService.getSimulationClock());
  const [selectedDay, setSelectedDay] = useState<number>(clock.currentDay || 1);

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [annCategory, setAnnCategory] = useState<'General' | 'Deal Room' | 'Schedule' | 'Venue'>('Schedule');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Edit session inline state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editStage, setEditStage] = useState('');

  // Speaker modal / add state
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false);
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [newSpeakerTitle, setNewSpeakerTitle] = useState('');
  const [newSpeakerOrg, setNewSpeakerOrg] = useState('');
  const [newSpeakerBio, setNewSpeakerBio] = useState('');
  const [newSpeakerExpertise, setNewSpeakerExpertise] = useState('AI & Deep Tech');

  const STAGES = [
    'Main Conclave Hall (Stage A)',
    'Venture Stage (Stage B)',
    'Deal Pod Pavilions',
    'Sky Terrace & Lounge',
    'Executive Syndicate Lounge',
    'Conclave Dining Pavilion'
  ];

  const loadData = () => {
    setSessions(StorageService.getSessions());
    setSpeakers(StorageService.getSpeakers());
    setAnnouncements(AnnouncementService.getAnnouncements());
    setClock(StorageService.getSimulationClock());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, []);

  // 1. Session status action
  const handleSetSessionStatus = (sessionId: string, status: SessionLiveStatus) => {
    AgendaService.setSessionLiveStatus(sessionId, status);
    loadData();
    onUpdate();
  };

  // 2. Save inline session edit
  const handleSaveSessionEdit = (sessionId: string) => {
    AgendaService.updateSession(sessionId, {
      startTime: editStartTime,
      endTime: editEndTime,
      stage: editStage,
      location: editStage,
    });
    setEditingSessionId(null);
    loadData();
    onUpdate();
  };

  // 3. Toggle speaker assignment
  const handleToggleSpeaker = (sessionId: string, speakerId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    if (session.speakerIds.includes(speakerId)) {
      AgendaService.removeSpeakerFromSession(sessionId, speakerId);
    } else {
      AgendaService.assignSpeakerToSession(sessionId, speakerId);
    }
    loadData();
    onUpdate();
  };

  // 4. Create announcement
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    AnnouncementService.createAnnouncement({
      title: annTitle,
      message: annMessage,
      priority: annPriority,
      category: annCategory,
      author: 'Conclave Control Desk',
    });

    setAnnTitle('');
    setAnnMessage('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 2000);
    loadData();
    onUpdate();
  };

  // 5. Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    AnnouncementService.deleteAnnouncement(id);
    loadData();
    onUpdate();
  };

  // 6. Clock preset change
  const handlePresetSelect = (presetKey: string) => {
    SimulationService.applyPreset(presetKey);
    loadData();
    onUpdate();
  };

  // 7. Add Speaker
  const handleAddSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeakerName.trim() || !newSpeakerOrg.trim()) return;

    AgendaService.addSpeaker({
      name: newSpeakerName,
      designation: newSpeakerTitle || 'Distinguished Guest',
      title: newSpeakerTitle || 'Distinguished Guest',
      organization: newSpeakerOrg,
      biography: newSpeakerBio || 'Speaker at Capital Connect Conclave 2026.',
      bio: newSpeakerBio || 'Speaker at Capital Connect Conclave 2026.',
      imageUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      featured: false,
      expertise: [newSpeakerExpertise],
      sessionIds: [],
    });

    setNewSpeakerName('');
    setNewSpeakerTitle('');
    setNewSpeakerOrg('');
    setNewSpeakerBio('');
    setShowAddSpeakerModal(false);
    loadData();
    onUpdate();
  };

  const liveSession = sessions.find(s => s.liveStatus === 'live');
  const daySessions = sessions.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-8">
      {/* Simulation Command Strip */}
      <div className="rounded-2xl bg-gradient-to-r from-[#12223D] via-[#0E1A2E] to-[#12223D] border border-[#DFC394]/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#DFC394]">
                Event Simulation Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#9AA6B5]">
                Demo Mode Synced
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#F5F3EF]">
              Conclave Floor Clock &amp; Stage Progression
            </h3>
            <p className="text-xs text-[#9AA6B5] max-w-xl">
              Any session status modification or broadcast announcement published here immediately synchronizes with all active delegate sessions and the Live Event Hub.
            </p>
          </div>

          {/* Quick Simulation Presets */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-[#9AA6B5] uppercase tracking-wider mb-1">
                Jump Simulation Clock:
              </label>
              <select
                value={clock.presetKey}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#080E18] border border-[#DFC394]/40 text-xs font-semibold text-[#DFC394] focus:outline-none"
              >
                {SIMULATION_PRESETS.map((preset) => (
                  <option key={preset.key} value={preset.key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                SimulationService.resetToDefault();
                loadData();
                onUpdate();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-[#9AA6B5] hover:text-[#F5F3EF] flex items-center justify-center gap-1.5 self-end sm:self-auto border border-white/[0.08]"
              title="Reset simulation state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currently Live Session Banner with 1-Click Controls */}
      <div className="rounded-2xl bg-[#0E1A2E] border-2 border-emerald-500/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Stage Spotlight
            </span>
          </div>
          {liveSession && (
            <span className="text-xs font-mono text-[#DFC394]">
              {liveSession.startTime} – {liveSession.endTime}
            </span>
          )}
        </div>

        {liveSession ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <h4 className="text-xl font-serif font-bold text-[#F5F3EF]">
                {liveSession.title}
              </h4>
              <p className="text-xs text-[#9AA6B5] mt-1 flex items-center gap-2">
                <span className="text-[#DFC394] font-medium">{liveSession.stage || liveSession.location}</span>
                <span>•</span>
                <span>Day {liveSession.day}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleSetSessionStatus(liveSession.id, 'completed')}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>

              <button
                onClick={() => handleSetSessionStatus(liveSession.id, 'delayed')}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1.5 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Mark Delayed</span>
              </button>

              <button
                onClick={() => handleSetSessionStatus(liveSession.id, 'cancelled')}
                className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#9AA6B5] py-2">
            No session is actively transmitting as LIVE right now. Click &quot;START LIVE&quot; on any session below to bring it onto the plenary stage.
          </div>
        )}
      </div>

      {/* Main Grid: Session Operations Table + Live Broadcast Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SESSION LIVE CONTROL TABLE (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5F3EF] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#DFC394]" />
                Live Programme Session Operations
              </h3>
              <p className="text-xs text-[#9AA6B5]">Control live status, stages, times, and panellist allocations</p>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center gap-2 bg-[#080E18] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
              <button
                onClick={() => setSelectedDay(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === 1
                    ? 'bg-[#DFC394] text-[#080E18]'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 1
              </button>
              <button
                onClick={() => setSelectedDay(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === 2
                    ? 'bg-[#DFC394] text-[#080E18]'
                    : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
                }`}
              >
                Day 2
              </button>
            </div>
          </div>

          {/* Session Cards for Organizer */}
          <div className="space-y-3">
            {daySessions.map((session) => {
              const isLive = session.liveStatus === 'live';
              const isCompleted = session.liveStatus === 'completed';
              const isDelayed = session.liveStatus === 'delayed';
              const isCancelled = session.liveStatus === 'cancelled';
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    isLive 
                      ? 'bg-gradient-to-r from-emerald-950/30 to-[#0E1A2E] border-emerald-500/60 shadow-lg'
                      : isCompleted
                      ? 'bg-[#0E1A2E]/50 border-white/[0.04] opacity-75'
                      : 'bg-[#0E1A2E] border-white/[0.08]'
                  }`}
                >
                  {/* Top Bar: Time, Status, and Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#DFC394] bg-[#080E18] px-2.5 py-1 rounded border border-white/10">
                        {session.startTime} – {session.endTime}
                      </span>

                      {/* Current Status Badge */}
                      {isLive && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse flex items-center gap-1">
                          <Radio className="w-3 h-3" /> LIVE NOW
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] text-[#9AA6B5] bg-white/[0.04] px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                      {isDelayed && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                          Delayed 15m
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">
                          Cancelled
                        </span>
                      )}
                      {!isLive && !isCompleted && !isDelayed && !isCancelled && (
                        <span className="text-[10px] text-[#7998B8] bg-[#7998B8]/10 px-2 py-0.5 rounded border border-[#7998B8]/20">
                          Upcoming
                        </span>
                      )}

                      <span className="text-xs text-[#9AA6B5] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#DFC394]" /> {session.stage || session.location}
                      </span>
                    </div>

                    {/* Quick Live State Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {!isLive ? (
                        <button
                          onClick={() => handleSetSessionStatus(session.id, 'live')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1 transition-colors"
                          title="Start Session (Set Live)"
                        >
                          <Play className="w-3 h-3" />
                          <span>START LIVE</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetSessionStatus(session.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-[#DFC394]/20 hover:bg-[#DFC394]/30 text-[#DFC394] text-xs font-bold border border-[#DFC394]/40 flex items-center gap-1 transition-colors"
                          title="End Session"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>END SESSION</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingSessionId(null);
                          } else {
                            setEditingSessionId(session.id);
                            setEditStartTime(session.startTime);
                            setEditEndTime(session.endTime);
                            setEditStage(session.stage || session.location);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#9AA6B5] hover:text-[#F5F3EF] border border-white/[0.06]"
                        title="Edit stage or reschedule"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSetSessionStatus(session.id, isDelayed ? 'upcoming' : 'delayed')}
                        className={`p-1.5 rounded-lg border text-xs ${
                          isDelayed 
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                            : 'bg-white/[0.04] border-white/[0.06] text-[#9AA6B5] hover:text-[#F5F3EF]'
                        }`}
                        title="Toggle Delayed status"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSetSessionStatus(session.id, isCancelled ? 'upcoming' : 'cancelled')}
                        className={`p-1.5 rounded-lg border text-xs ${
                          isCancelled 
                            ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                            : 'bg-white/[0.04] border-white/[0.06] text-[#9AA6B5] hover:text-[#F5F3EF]'
                        }`}
                        title="Toggle Cancelled status"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className={`text-base font-serif font-bold ${isCancelled ? 'line-through text-[#9AA6B5]' : 'text-[#F5F3EF]'}`}>
                    {session.title}
                  </h4>

                  {/* Inline Reschedule & Stage Form */}
                  {isEditing && (
                    <div className="mt-4 p-4 rounded-xl bg-[#080E18] border border-[#DFC394]/30 space-y-3">
                      <div className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                        Reschedule &amp; Reassign Stage
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#9AA6B5] uppercase">Start Time</label>
                          <input
                            type="text"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#0E1A2E] border border-white/10 text-xs text-[#F5F3EF]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#9AA6B5] uppercase">End Time</label>
                          <input
                            type="text"
                            value={editEndTime}
                            onChange={(e) => setEditEndTime(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#0E1A2E] border border-white/10 text-xs text-[#F5F3EF]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#9AA6B5] uppercase">Stage / Room</label>
                          <select
                            value={editStage}
                            onChange={(e) => setEditStage(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#0E1A2E] border border-white/10 text-xs text-[#F5F3EF]"
                          >
                            {STAGES.map((stg) => (
                              <option key={stg} value={stg}>{stg}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingSessionId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs text-[#9AA6B5] hover:text-[#F5F3EF]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveSessionEdit(session.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#DFC394] text-[#080E18] text-xs font-bold hover:bg-[#edd8b4]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Speaker Allocation Row */}
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#9AA6B5] text-[11px] flex items-center gap-1">
                        <Mic className="w-3 h-3 text-[#DFC394]" /> Assigned Speakers:
                      </span>
                      {speakers.map((spk) => {
                        const isAssigned = session.speakerIds.includes(spk.id);
                        return (
                          <button
                            key={spk.id}
                            onClick={() => handleToggleSpeaker(session.id, spk.id)}
                            className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors flex items-center gap-1 ${
                              isAssigned 
                                ? 'bg-[#DFC394]/15 border-[#DFC394]/40 text-[#DFC394]' 
                                : 'bg-[#080E18]/60 border-white/[0.04] text-[#9AA6B5]/60 hover:text-[#9AA6B5]'
                            }`}
                            title={isAssigned ? `Click to remove ${spk.name}` : `Click to assign ${spk.name}`}
                          >
                            {isAssigned && <Check className="w-2.5 h-2.5" />}
                            <span>{spk.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ANNOUNCEMENT BROADCAST + SPEAKER MANAGER (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Announcement Creator */}
          <div className="rounded-2xl bg-[#0E1A2E] border border-white/[0.08] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#DFC394]" />
                <h4 className="text-sm font-serif font-bold text-[#F5F3EF]">
                  Broadcast Live Announcement
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">INSTANT PUSH</span>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-[#9AA6B5] uppercase">Headline</label>
                <input
                  type="text"
                  placeholder="e.g., Venture Stage Room Changed"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#DFC394] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#9AA6B5] uppercase">Message Content</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Keynote starting in 10 minutes on Main Stage A."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#DFC394] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#9AA6B5] uppercase">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#9AA6B5] uppercase">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                  >
                    <option value="Schedule">Schedule Change</option>
                    <option value="Venue">Venue Change</option>
                    <option value="Deal Room">Deal Room</option>
                    <option value="General">General Notice</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#DFC394] hover:bg-[#edd8b4] text-[#080E18] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#DFC394]/10"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Publish to Attendee Hub</span>
              </button>

              {annSuccess && (
                <div className="text-[11px] text-emerald-400 text-center font-medium animate-fadeIn">
                  Announcement broadcasted live to attendees!
                </div>
              )}
            </form>

            {/* Published Announcements Feed */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="text-[11px] font-semibold text-[#9AA6B5] uppercase">Published Announcements ({announcements.length})</div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className="p-2.5 rounded-lg bg-[#080E18] border border-white/[0.04] text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-[#F5F3EF] flex items-center gap-1">
                        {ann.priority === 'urgent' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                        {ann.title}
                      </div>
                      <div className="text-[11px] text-[#9AA6B5] line-clamp-1">{ann.message}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-[#9AA6B5] hover:text-red-400 p-1 shrink-0"
                      title="Remove announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Speaker Management Card */}
          <div className="rounded-2xl bg-[#0E1A2E] border border-white/[0.08] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#DFC394]" />
                <h4 className="text-sm font-serif font-bold text-[#F5F3EF]">
                  Speaker Registry ({speakers.length})
                </h4>
              </div>
              <button
                onClick={() => setShowAddSpeakerModal(true)}
                className="px-2.5 py-1 rounded-lg bg-[#DFC394]/15 hover:bg-[#DFC394]/25 text-[#DFC394] text-[11px] font-semibold border border-[#DFC394]/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Speaker
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {speakers.map((spk) => (
                <div
                  key={spk.id}
                  className="p-2.5 rounded-lg bg-[#080E18] border border-white/[0.04] flex items-center gap-3"
                >
                  <img
                    src={spk.avatarUrl}
                    alt={spk.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#DFC394]/40"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-semibold text-[#F5F3EF] truncate">{spk.name}</div>
                    <div className="text-[10px] text-[#9AA6B5] truncate">{spk.title} • {spk.organization}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Speaker Modal */}
      {showAddSpeakerModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowAddSpeakerModal(false)}
        >
          <div 
            className="bg-[#0E1A2E] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddSpeakerModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif font-bold text-[#F5F3EF] mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#DFC394]" /> Enroll New Speaker
            </h3>

            <form onSubmit={handleAddSpeaker} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#9AA6B5] uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Iyer"
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9AA6B5] uppercase">Designation / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director & Sovereign Allocator"
                  value={newSpeakerTitle}
                  onChange={(e) => setNewSpeakerTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9AA6B5] uppercase">Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharat Sovereign Investment Authority"
                  value={newSpeakerOrg}
                  onChange={(e) => setNewSpeakerOrg(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9AA6B5] uppercase">Domain Expertise</label>
                <select
                  value={newSpeakerExpertise}
                  onChange={(e) => setNewSpeakerExpertise(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF]"
                >
                  <option value="AI & Deep Tech">AI & Deep Tech</option>
                  <option value="Venture Capital">Venture Capital</option>
                  <option value="Sovereign Wealth">Sovereign Wealth</option>
                  <option value="Clean Energy & Climate">Clean Energy & Climate</option>
                  <option value="Fintech & Payments">Fintech & Payments</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9AA6B5] uppercase">Brief Biography</label>
                <textarea
                  rows={3}
                  placeholder="Summary of speaker background and institutional experience..."
                  value={newSpeakerBio}
                  onChange={(e) => setNewSpeakerBio(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#080E18] border border-white/10 text-xs text-[#F5F3EF] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSpeakerModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#9AA6B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DFC394] text-[#080E18] font-bold"
                >
                  Add Speaker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
