'use client';

import React from 'react';
import { Session, Speaker, SessionCategory } from '@/types';
import { AgendaService } from '@/services/agendaService';
import { 
  Clock, 
  MapPin, 
  Bookmark, 
  Radio, 
  CheckCircle2, 
  Compass,
  Mic, 
  ArrowRight 
} from 'lucide-react';

interface SessionCardProps {
  session: Session;
  speakers: Speaker[];
  isBookmarked: boolean;
  onToggleBookmark: (sessionId: string, e: React.MouseEvent) => void;
  onOpenDetails: (session: Session) => void;
}

export function SessionCard({
  session,
  speakers,
  isBookmarked,
  onToggleBookmark,
  onOpenDetails,
}: SessionCardProps) {
  const sessionSpeakers = speakers.filter((sp) => session.speakerIds.includes(sp.id));
  const isLive = session.liveStatus === 'live';
  const isCompleted = session.liveStatus === 'completed';
  const isDelayed = session.liveStatus === 'delayed';
  const isCancelled = session.liveStatus === 'cancelled';

  const getCategoryBadge = (cat: SessionCategory) => {
    switch (cat) {
      case 'Keynote':
        return 'bg-[#D2B47C]/15 text-[#D2B47C] border-[#D2B47C]/30';
      case 'Panel Discussion':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Pitch Track':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Deal Room':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Networking Reception':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(session)}
      className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-200 group relative ${
        isLive
          ? 'bg-[#152235] border-emerald-500/60 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30'
          : isCompleted
          ? 'bg-[#101927]/60 border-[#202C3D] opacity-70'
          : 'surface-interactive'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5 mb-3">
        {/* Time, Status & Category */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080D16] text-[#F5F3EF] font-mono text-xs font-semibold border border-[#202C3D] whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
            <span>{session.startTime} – {session.endTime}</span>
          </div>

          <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${getCategoryBadge(session.category)}`}>
            {session.category}
          </span>

          {isLive && (
            <span className="live-pulse-badge whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Now
            </span>
          )}

          {isCompleted && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-[#91A0B4] border border-[#202C3D] whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              Completed
            </span>
          )}

          {isDelayed && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 whitespace-nowrap">
              Delayed (+15m)
            </span>
          )}

          {isCancelled && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 whitespace-nowrap">
              Cancelled
            </span>
          )}
        </div>

        {/* Bookmark Trigger with minimum 40px touch target */}
        <button
          onClick={(e) => onToggleBookmark(session.id, e)}
          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border text-xs transition-colors flex items-center justify-center shrink-0 ${
            isBookmarked
              ? 'bg-[#D2B47C]/20 border-[#D2B47C] text-[#D2B47C]'
              : 'bg-[#101927] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF]'
          }`}
          title={isBookmarked ? 'Saved to My Schedule' : 'Save to My Schedule'}
          aria-label={isBookmarked ? 'Saved to My Schedule' : 'Save to My Schedule'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D2B47C]' : ''}`} />
        </button>
      </div>

      {/* Session Title & Description */}
      <h3 className={`text-base sm:text-lg font-serif font-bold group-hover:text-[#D2B47C] transition-colors leading-snug ${
        isCancelled ? 'line-through text-[#91A0B4]' : 'text-[#F5F3EF]'
      }`}>
        {session.title}
      </h3>

      <p className="text-xs text-[#91A0B4] line-clamp-2 mt-1.5 leading-relaxed font-light">
        {session.description}
      </p>

      {/* Location & Assigned Speakers Footer */}
      <div className="mt-4 pt-3 border-t border-[#202C3D] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#91A0B4] min-w-0">
          <Compass className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
          <span className="font-medium text-[#F5F3EF] truncate">{session.stage || session.location}</span>
          {session.floor && <span className="text-[11px] text-[#91A0B4] shrink-0">({session.floor})</span>}
        </div>

        {sessionSpeakers.length > 0 && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Mic className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
            <span className="text-xs text-[#F5F3EF] font-medium truncate max-w-[200px] sm:max-w-[240px]">
              {sessionSpeakers.map((s) => s.name).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
