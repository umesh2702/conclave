'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../../types';
import { ShieldCheck, Copy, Check, Printer, Building2, Download } from 'lucide-react';

interface DigitalPassCardProps {
  attendee: Attendee;
}

export function DigitalPassCard({ attendee }: DigitalPassCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(attendee.tokenHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getRoleAccent = () => {
    switch (attendee.role) {
      case 'investor':
        return {
          border: 'border-[#D2B47C]/40',
          badgeBg: 'bg-[#D2B47C]/20 text-[#D2B47C] border-[#D2B47C]/30',
          gradient: 'from-[#152235] via-[#101927] to-[#080D16]',
          tag: 'INVESTOR DELEGATE',
        };
      case 'founder':
        return {
          border: 'border-blue-500/40',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          gradient: 'from-[#152235] via-[#101927] to-[#080D16]',
          tag: 'FOUNDER DELEGATE',
        };
      case 'mentor':
        return {
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          gradient: 'from-emerald-950/30 via-[#101927] to-[#080D16]',
          tag: 'MENTOR & ADVISOR',
        };
      case 'organizer':
        return {
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          gradient: 'from-amber-950/30 via-[#101927] to-[#080D16]',
          tag: 'CONCLAVE ORGANIZER',
        };
      default:
        return {
          border: 'border-purple-500/40',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          gradient: 'from-purple-950/30 via-[#101927] to-[#080D16]',
          tag: 'DELEGATE PASS',
        };
    }
  };

  const style = getRoleAccent();

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Physical Lanyard Notch */}
      <div className="w-16 h-3 bg-[#152235] rounded-t-md border-t border-x border-[#202C3D] mx-auto flex items-center justify-center">
        <div className="w-8 h-1 bg-[#080D16] rounded-full" />
      </div>

      {/* Main Digital Pass Card */}
      <div
        className={`w-full rounded-2xl bg-gradient-to-b ${style.gradient} border ${style.border} shadow-2xl p-5 sm:p-6 relative overflow-hidden backdrop-blur-xl transition-all`}
      >
        {/* Subtle Decorative Background Seal */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#D2B47C]/5 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#202C3D] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D2B47C]/15 border border-[#D2B47C]/40 flex items-center justify-center font-serif text-[#D2B47C] font-bold text-sm">
              C
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#F5F3EF] tracking-wider uppercase">
                Capital Connect
              </div>
              <div className="text-[9px] text-[#91A0B4] tracking-widest uppercase font-mono">
                Conclave 2026
              </div>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${style.badgeBg}`}>
            {style.tag}
          </span>
        </div>

        {/* Attendee Identity Section */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#152235] border-2 border-[#D2B47C]/40 shrink-0 shadow-md">
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
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#D2B47C]">
                {attendee.fullName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#F5F3EF] truncate leading-tight">
              {attendee.fullName}
            </h3>
            <div className="text-xs font-medium text-[#D2B47C] truncate mt-0.5">
              {attendee.designation}
            </div>
            <div className="text-xs text-[#91A0B4] truncate flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{attendee.organization}</span>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-inner mx-auto max-w-[210px] mb-4">
          <QRCodeSVG
            value={attendee.tokenHash}
            size={160}
            level="H"
            includeMargin={false}
            fgColor="#080D16"
            bgColor="#FFFFFF"
          />
          <div className="mt-2 text-[8px] font-mono text-[#080D16]/80 text-center tracking-wider font-bold">
            FAST-TRACK ENTRY TOKEN
          </div>
        </div>

        {/* Security & Access Metadata */}
        <div className="bg-[#080D16]/90 rounded-xl p-3 border border-[#202C3D] space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#91A0B4]">Attendee ID:</span>
            <span className="font-mono text-[#F5F3EF] font-semibold">{attendee.id}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#91A0B4]">Token Hash:</span>
            <div className="flex items-center gap-1 font-mono text-[10px] text-[#D2B47C]">
              <span>{attendee.tokenHash.substring(0, 16)}...</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-white transition-colors"
                title="Copy token"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#91A0B4]">Floor Access:</span>
            {attendee.checkInStatus ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Verified &amp; Checked-In
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Valid (Pending Scan)
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 min-h-[40px] rounded-lg bg-[#152235] hover:bg-[#1a2b42] text-xs font-medium text-[#F5F3EF] border border-[#202C3D] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Token'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 min-h-[40px] rounded-lg champagne-btn text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
