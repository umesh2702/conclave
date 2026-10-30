'use client';

import React, { useState } from 'react';
import { Session, Speaker, SessionCategory } from '../../types';
import { AgendaService } from '../../services/agendaService';
import { 
  Clock, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  Users, 
  Sparkles,
  ChevronRight
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

  const handleToggleBookmark = () => {
    const nextState = AgendaService.toggleBookmark(session.id);
    setBookmarked(nextState);
    if (onBookmarkChange) onBookmarkChange();
  };

  const getCategoryTheme = (cat: SessionCategory) => {
    switch (cat) {
      case 'Keynote':
        return {
          badge: 'bg-[#C7A875]/20 text-[#DFC394] border-[#C7A875]/40',
          border: 'border-l-4 border-l-[#C7A875]',
        };
      case 'Panel Discussion':
        return {
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          border: 'border-l-4 border-l-purple-500',
        };
      case 'Pitch Track':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          border: 'border-l-4 border-l-emerald-500',
        };
      case 'Deal Room':
        return {
          badge: 'bg-[#7998B8]/20 text-[#A6C5E8] border-[#7998B8]/40',
          border: 'border-l-4 border-l-[#7998B8]',
        };
      case 'Networking Reception':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          border: 'border-l-4 border-l-amber-500',
        };
      default:
        return {
          badge: 'bg-white/10 text-white/80 border-white/20',
          border: 'border-l-4 border-l-white/30',
        };
    }
  };

  const theme = getCategoryTheme(session.category);
  const sessionSpeakers = speakers.filter((sp) => session.speakerIds.includes(sp.id));

  return (
    <div
      className={`card-glass-interactive rounded-xl p-5 border border-white/[0.08] ${theme.border} transition-all`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
        {/* Time & Category */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#172335] text-[#F5F3EF] font-mono text-xs font-semibold border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#DFC394]" />
            <span>
              {session.startTime} – {session.endTime}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${theme.badge}`}
          >
            {session.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleBookmark}
          className={`self-start flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            bookmarked
              ? 'bg-[#C7A875]/20 text-[#DFC394] border-[#C7A875]/40 shadow-sm'
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
              <span>Bookmark</span>
            </>
          )}
        </button>
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-bold text-[#F5F3EF] mb-2 leading-snug">
        {session.title}
      </h3>
      <p className="text-xs text-[#9AA6B5] leading-relaxed mb-4">
        {session.description}
      </p>

      {/* Location and Speakers */}
      <div className="pt-3 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#DFC394]">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C7A875]" />
          <span className="font-medium text-[11px]">{session.location}</span>
        </div>

        {sessionSpeakers.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#9AA6B5]">Featuring:</span>
            <div className="flex items-center gap-2">
              {sessionSpeakers.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => onSelectSpeaker && onSelectSpeaker(sp)}
                  className="flex items-center gap-1.5 bg-[#172335] px-2 py-1 rounded-md border border-white/10 cursor-pointer hover:border-[#C7A875]/40 transition-colors"
                >
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-[10px] text-[#F5F3EF] font-medium">{sp.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
