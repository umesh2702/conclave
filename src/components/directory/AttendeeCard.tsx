'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Attendee, Connection } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ConnectionService } from '../../services/connectionService';
import { 
  Building2, 
  MapPin, 
  Tag, 
  UserPlus, 
  Check, 
  Clock, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface AttendeeCardProps {
  attendee: Attendee;
  existingConnection?: Connection;
  onConnectionChange?: () => void;
  onScheduleMeeting?: (attendee: Attendee) => void;
}

export function AttendeeCard({
  attendee,
  existingConnection,
  onConnectionChange,
  onScheduleMeeting,
}: AttendeeCardProps) {
  const { currentUser } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const isSelf = currentUser?.id === attendee.id;

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser || isSelf) return;

    try {
      setConnecting(true);
      ConnectionService.sendConnectionRequest(
        currentUser.id,
        attendee.id,
        `Hi ${attendee.fullName.split(' ')[0]}, let's connect at Capital Connect Conclave 2026.`
      );
      if (onConnectionChange) onConnectionChange();
    } catch (err: any) {
      alert(err.message || 'Failed to send connection request');
    } finally {
      setConnecting(false);
    }
  };

  const getCategoryColor = () => {
    switch (attendee.category) {
      case 'Founder':
        return 'bg-[#7998B8]/15 text-[#A6C5E8] border-[#7998B8]/30';
      case 'Investor':
        return 'bg-[#C7A875]/15 text-[#DFC394] border-[#C7A875]/30';
      case 'Mentor':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Financial Institution':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="card-glass-interactive rounded-xl p-5 flex flex-col justify-between h-full border border-white/[0.08]">
      <div>
        {/* Top bar with category & status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getCategoryColor()}`}>
            {attendee.category}
          </span>

          {attendee.founderProfile && (
            <span className="text-[10px] font-medium text-[#7998B8] bg-[#7998B8]/10 px-2 py-0.5 rounded border border-[#7998B8]/20">
              {attendee.founderProfile.stage} Stage
            </span>
          )}

          {attendee.investorProfile && (
            <span className="text-[10px] font-medium text-[#C7A875] bg-[#C7A875]/10 px-2 py-0.5 rounded border border-[#C7A875]/20">
              {attendee.investorProfile.ticketSize}
            </span>
          )}
        </div>

        {/* Profile Info Header */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#172335] border border-white/10 shrink-0">
            {attendee.avatarUrl ? (
              <img
                src={attendee.avatarUrl}
                alt={attendee.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#DFC394]">
                {attendee.fullName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/app/people/${attendee.id}`}
              className="text-sm font-bold text-[#F5F3EF] hover:text-[#DFC394] transition-colors truncate block"
            >
              {attendee.fullName}
            </Link>
            <div className="text-xs text-[#DFC394] truncate">{attendee.designation}</div>
            <div className="text-xs text-[#9AA6B5] truncate flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3 shrink-0" />
              <span>{attendee.organization}</span>
            </div>
          </div>
        </div>

        {/* Bio / Value Prop */}
        <p className="text-xs text-[#9AA6B5] line-clamp-2 leading-relaxed mb-4">
          {attendee.founderProfile?.shortDescription || attendee.bio}
        </p>

        {/* Highlight Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-[#9AA6B5] border border-white/5">
            {attendee.industry}
          </span>
          {attendee.founderProfile?.fundingRequirement && (
            <span className="px-2 py-0.5 rounded bg-[#7998B8]/10 text-[10px] text-[#A6C5E8] border border-[#7998B8]/20 flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              Target: {attendee.founderProfile.fundingRequirement}
            </span>
          )}
          {attendee.investorProfile?.investmentCategory && (
            <span className="px-2 py-0.5 rounded bg-[#C7A875]/10 text-[10px] text-[#DFC394] border border-[#C7A875]/20 flex items-center gap-1">
              <DollarSign className="w-2.5 h-2.5" />
              {attendee.investorProfile.investmentCategory}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <Link
          href={`/app/people/${attendee.id}`}
          className="text-xs text-[#9AA6B5] hover:text-[#F5F3EF] flex items-center gap-1 transition-colors"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1.5">
          {isSelf ? (
            <span className="text-[11px] text-[#9AA6B5] italic px-2 py-1">You</span>
          ) : existingConnection?.status === 'accepted' ? (
            <>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                <Check className="w-3 h-3" />
                Connected
              </span>
              {onScheduleMeeting && (
                <button
                  onClick={() => onScheduleMeeting(attendee)}
                  className="p-1 rounded bg-[#C7A875]/20 text-[#DFC394] hover:bg-[#C7A875]/30 transition-colors"
                  title="Schedule 1:1 Deal Room Meeting"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : existingConnection?.status === 'pending' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#172335] hover:bg-[#1f2f47] border border-white/10 hover:border-[#C7A875]/40 text-xs font-medium text-[#F5F3EF] transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C7A875]" />
              <span>{connecting ? 'Sending...' : 'Connect'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
