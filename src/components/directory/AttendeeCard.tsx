'use client';

import React, { useState } from 'react';
import { Attendee, Connection } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ConnectionService } from '../../services/connectionService';
import { 
  Building2, 
  UserPlus, 
  Check, 
  Clock, 
  Calendar, 
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface AttendeeCardProps {
  attendee: Attendee;
  existingConnection?: Connection;
  onConnectionChange?: () => void;
  onScheduleMeeting?: (attendee: Attendee) => void;
  onOpenDetails?: (attendee: Attendee) => void;
}

export function AttendeeCard({
  attendee,
  existingConnection,
  onConnectionChange,
  onScheduleMeeting,
  onOpenDetails,
}: AttendeeCardProps) {
  const { currentUser } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const isSelf = currentUser?.id === attendee.id;

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || isSelf) return;

    try {
      setConnecting(true);
      ConnectionService.sendConnectionRequest(
        currentUser.id,
        attendee.id,
        `Hi ${attendee.fullName.split(' ')[0]}, I would like to connect at Capital Connect Conclave.`
      );
      if (onConnectionChange) onConnectionChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send connection request';
      alert(msg);
    } finally {
      setConnecting(false);
    }
  };

  const getCategoryColor = () => {
    switch (attendee.category) {
      case 'Founder':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Investor':
        return 'bg-[#D2B47C]/15 text-[#D2B47C] border-[#D2B47C]/30';
      case 'Mentor':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Financial Institution':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div 
      onClick={() => onOpenDetails && onOpenDetails(attendee)}
      className="surface-interactive p-4 sm:p-5 flex flex-col justify-between h-full cursor-pointer group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getCategoryColor()}`}>
            {attendee.category}
          </span>

          {attendee.founderProfile && (
            <span className="text-[10px] font-mono text-[#D2B47C] bg-[#152235] px-2 py-0.5 rounded border border-[#202C3D]">
              {attendee.founderProfile.stage}
            </span>
          )}

          {attendee.investorProfile && (
            <span className="text-[10px] font-mono text-[#D2B47C] bg-[#152235] px-2 py-0.5 rounded border border-[#202C3D]">
              {attendee.investorProfile.ticketSize}
            </span>
          )}
        </div>

        {/* Profile Avatar & Details */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-[#152235] border border-[#202C3D] shrink-0">
            {attendee.avatarUrl ? (
              <img
                src={attendee.avatarUrl}
                alt={attendee.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-[#D2B47C] text-sm">
                {attendee.fullName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[#F5F3EF] truncate group-hover:text-[#D2B47C] transition-colors">
              {attendee.fullName}
            </h4>
            <div className="text-xs text-[#D2B47C] truncate font-medium">
              {attendee.designation}
            </div>
            <div className="text-[11px] text-[#91A0B4] truncate flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{attendee.organization}</span>
            </div>
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-[#91A0B4] line-clamp-2 leading-relaxed font-light mb-3">
          {attendee.bio}
        </p>

        {/* Sub-profiles details */}
        {attendee.founderProfile && (
          <div className="p-2.5 rounded-lg bg-[#080D16] border border-[#202C3D] text-[11px] space-y-1 mb-3">
            <div className="text-[#F5F3EF] font-semibold flex items-center justify-between">
              <span>{attendee.founderProfile.startupName}</span>
              <span className="text-[#D2B47C] font-mono">{attendee.founderProfile.fundingRequirement}</span>
            </div>
            <p className="text-[#91A0B4] line-clamp-1">{attendee.founderProfile.shortDescription}</p>
          </div>
        )}

        {attendee.investorProfile && (
          <div className="p-2.5 rounded-lg bg-[#080D16] border border-[#202C3D] text-[11px] space-y-1 mb-3">
            <div className="text-[#F5F3EF] font-semibold flex items-center justify-between">
              <span>{attendee.investorProfile.investmentCategory}</span>
              <span className="text-[#D2B47C] font-mono">{attendee.investorProfile.ticketSize}</span>
            </div>
            <div className="text-[#91A0B4] truncate">
              {attendee.investorProfile.preferredSectors.slice(0, 2).join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Networking Action Buttons */}
      {!isSelf && (
        <div className="pt-3 border-t border-[#202C3D] flex items-center gap-2">
          {existingConnection?.status === 'accepted' ? (
            <span className="flex-1 min-h-[40px] py-2 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" /> Connected
            </span>
          ) : existingConnection?.status === 'pending' ? (
            <span className="flex-1 min-h-[40px] py-2 px-3 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium flex items-center justify-center gap-1 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" /> Request Sent
            </span>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex-1 min-h-[40px] py-2 px-3 rounded-lg bg-[#152235] hover:bg-[#1a2b42] text-[#F5F3EF] hover:text-[#D2B47C] border border-[#202C3D] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#D2B47C]" />
              <span>{connecting ? 'Sending...' : 'Connect'}</span>
            </button>
          )}

          {onScheduleMeeting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onScheduleMeeting(attendee);
              }}
              className="min-h-[40px] py-2 px-3.5 rounded-lg champagne-btn text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
              title="Book 1:1 Deal Pod Slot"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Deal Pod</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
