'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Session, Speaker, SessionCategory } from '@/types';
import { AgendaService } from '@/services/agendaService';
import { 
  Clock, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Navigation,
  Mic,
  ArrowRight
} from 'lucide-react';

interface SessionCardProps {
  session: Session;
  speakers: Speaker[];
  onBookmarkChange?: () => void;
  onSelectSpeaker?: (speaker: Speaker) => void;
}

export function SessionCard({
  session,
  speakers,
  onBookmarkChange,
  onSelectSpeaker,
}: SessionCardProps) {
  const [bookmarked, setBookmarked] = useState(AgendaService.isBookmarked(session.id));

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = AgendaService.toggleBookmark(session.id);
    setBookmarked(nextState);
    if (onBookmarkChange) onBookmarkChange();
  };

  const getCategoryTheme = (cat: SessionCategory) => {
    switch (cat) {
      case 'Keynote':
        return {
          badge: 'bg-[#DFC394]/15 text-[#DFC394] border-[#DFC394]/30',
          accent: 'border-l-4 border-l-[#DFC394]',
        };
      case 'Panel Discussion':
        return {
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          accent: 'border-l-4 border-l-purple-500',
        };
      case 'Pitch Track':
        return {
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          accent: 'border-l-4 border-l-emerald-500',
        };
      case 'Deal Room':
        return {
          badge: 'bg-[#7998B8]/15 text-[#A6C5E8] border-[#7998B8]/30',
          accent: 'border-l-4 border-l-[#7998B8]',
        };
      case 'Networking Reception':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          accent: 'border-l-4 border-l-amber-500',
        };
      default:
        return {
          badge: 'bg-white/10 text-white/80 border-white/20',
          accent: 'border-l-4 border-l-white/30',
        };
    }
  };

  const theme = getCategoryTheme(session.category);
  const sessionSpeakers = speakers.filter((sp) => session.speakerIds.includes(sp.id));
  const isLive = session.liveStatus === 'live';
  const isCompleted = session.liveStatus === 'completed';
  const isDelayed = session.liveStatus === 'delayed';
  const isCancelled = session.liveStatus === 'cancelled';

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 border ${theme.accent} ${
        isLive 
          ? 'bg-gradient-to-r from-emerald-950/25 via-[#0E1A2E] to-[#0E1A2E] border-emerald-500/50 shadow-lg shadow-emerald-500/5'
          : isCompleted 
          ? 'bg-[#0E1A2E]/40 border-white/[0.04] opacity-70'
          : 'bg-[#0E1A2E]/70 hover:bg-[#0E1A2E] border-white/[0.08] hover:border-white/[0.18]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        {/* Time, Live Status & Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#080E18] text-[#F5F3EF] font-mono text-xs font-semibold border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#DFC394]" />
            <span>
              {session.startTime} – {session.endTime}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${theme.badge}`}
          >
            {session.category}
          </span>

          {/* Live Status Badges */}
          {isLive && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 animate-pulse">
              <Radio className="w-3 h-3" /> LIVE NOW
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[#9AA6B5] bg-white/[0.04]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
            </span>
          )}
          {isDelayed && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30">
              <AlertCircle className="w-3 h-3" /> Delayed
            </span>
          )}
          {isCancelled && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-red-300 bg-red-500/20 border border-red-500/30">
              <Ban className="w-3 h-3" /> Cancelled
            </span>
          )}
        </div>

        {/* Bookmark Action */}
        <button
          onClick={handleToggleBookmark}
          className={`self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            bookmarked
              ? 'bg-[#DFC394]/20 text-[#DFC394] border-[#DFC394]/50 shadow-sm'
              : 'bg-white/[0.03] text-[#9AA6B5] border-white/10 hover:text-[#F5F3EF] hover:border-white/20'
          }`}
          title={bookmarked ? 'Remove from My Agenda' : 'Add to My Agenda'}
        >
          {bookmarked ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-[#DFC394]" />
              <span>In My Schedule</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5 text-[#9AA6B5]" />
              <span>Add to Schedule</span>
            </>
          )}
        </button>
      </div>

      {/* Title & Description */}
      <h3 className={`text-lg font-serif font-bold mb-2 leading-snug ${isCancelled ? 'line-through text-[#9AA6B5]' : 'text-[#F5F3EF]'}`}>
        {session.title}
      </h3>
      <p className="text-xs text-[#9AA6B5] leading-relaxed mb-4">
        {session.description}
      </p>

      {/* Stage, Floor & Speakers */}
      <div className="pt-3 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Stage & Location with Venue Link */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/app/venue"
            className="flex items-center gap-1.5 text-[#DFC394] hover:underline"
            title="View Stage in Venue Guide"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0 text-[#DFC394]" />
            <span className="font-semibold">{session.stage || session.location}</span>
          </Link>
          {session.floor && (
            <span className="text-[10px] font-mono text-[#9AA6B5] bg-white/[0.04] px-1.5 py-0.5 rounded">
              {session.floor}
            </span>
          )}
        </div>

        {/* Speakers List */}
        {sessionSpeakers.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#9AA6B5] flex items-center gap-1">
              <Mic className="w-3 h-3 text-[#DFC394]" /> Speakers:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {sessionSpeakers.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => onSelectSpeaker && onSelectSpeaker(sp)}
                  className="flex items-center gap-1.5 bg-[#080E18] px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer hover:border-[#DFC394]/40 hover:bg-[#12223D] transition-colors"
                >
                  <img
                    src={sp.avatarUrl}
                    alt={sp.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-[11px] text-[#F5F3EF] font-medium">{sp.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
