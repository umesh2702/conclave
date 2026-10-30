'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../../types';
import { ShieldCheck, Copy, Check, Download, Printer, Sparkles, Building2 } from 'lucide-react';

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
          border: 'border-[#C7A875]/40',
          badgeBg: 'bg-[#C7A875]/20 text-[#DFC394] border-[#C7A875]/30',
          gradient: 'from-[#C7A875]/20 via-[#172335] to-[#0D1522]',
          tag: 'INVESTOR DELEGATE',
        };
      case 'founder':
        return {
          border: 'border-[#7998B8]/40',
          badgeBg: 'bg-[#7998B8]/20 text-[#A6C5E8] border-[#7998B8]/30',
          gradient: 'from-[#7998B8]/20 via-[#172335] to-[#0D1522]',
          tag: 'FOUNDER DELEGATE',
        };
      case 'mentor':
        return {
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          gradient: 'from-emerald-900/30 via-[#172335] to-[#0D1522]',
          tag: 'MENTOR & ADVISOR',
        };
      case 'organizer':
        return {
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          gradient: 'from-amber-900/30 via-[#172335] to-[#0D1522]',
          tag: 'CONCLAVE ORGANIZER',
        };
      default:
        return {
          border: 'border-purple-500/40',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          gradient: 'from-purple-900/30 via-[#172335] to-[#0D1522]',
          tag: 'DELEGATE PASS',
        };
    }
  };

  const style = getRoleAccent();

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Physical Lanyard Notch */}
      <div className="w-16 h-3 bg-[#172335] rounded-t-md border-t border-x border-white/20 mx-auto flex items-center justify-center">
        <div className="w-8 h-1 bg-[#080E18] rounded-full" />
      </div>

      {/* Main Digital Pass Card */}
      <div
        className={`w-full rounded-2xl bg-gradient-to-b ${style.gradient} border ${style.border} shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl transition-all hover:shadow-[#C7A875]/10`}
      >
        {/* Subtle Decorative Background Seal */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#C7A875]/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#7998B8]/5 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C7A875]/20 border border-[#C7A875]/40 flex items-center justify-center font-serif text-[#DFC394] font-bold text-sm">
              C
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#F5F3EF] tracking-wider uppercase">
                Capital Connect
              </div>
              <div className="text-[9px] text-[#9AA6B5] tracking-widest uppercase">
                Startup Synerz Conclave
              </div>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.badgeBg}`}>
            {style.tag}
          </span>
        </div>

        {/* Attendee Identity Section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#111B2A] border-2 border-[#C7A875]/40 shrink-0 shadow-md">
            {attendee.avatarUrl ? (
              <img
                src={attendee.avatarUrl}
                alt={attendee.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#C7A875]">
                {attendee.fullName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#F5F3EF] truncate leading-tight">
              {attendee.fullName}
            </h3>
            <div className="text-xs font-medium text-[#DFC394] truncate mt-0.5">
              {attendee.designation}
            </div>
            <div className="text-xs text-[#9AA6B5] truncate flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3 shrink-0" />
              <span>{attendee.organization}</span>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-inner mx-auto max-w-[220px] mb-5">
          <QRCodeSVG
            value={attendee.tokenHash}
            size={180}
            level="H"
            includeMargin={false}
            fgColor="#080E18"
            bgColor="#FFFFFF"
          />
          <div className="mt-2 text-[9px] font-mono text-[#080E18]/70 text-center tracking-wider font-semibold">
            SECURE ENTRY TOKEN
          </div>
        </div>

        {/* Security & Access Metadata */}
        <div className="bg-[#080E18]/80 rounded-xl p-3 border border-white/5 space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9AA6B5]">Attendee ID:</span>
            <span className="font-mono text-[#F5F3EF] font-semibold">{attendee.id}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9AA6B5]">Token Hash:</span>
            <div className="flex items-center gap-1 font-mono text-[10px] text-[#DFC394]">
              <span>{attendee.tokenHash.substring(0, 14)}...</span>
              <button
                onClick={handleCopy}
                className="hover:text-white transition-colors"
                title="Copy token to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9AA6B5]">Check-In Status:</span>
            {attendee.checkInStatus ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Verified & In Venue
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Active (Pending Scan)
              </span>
            )}
          </div>
        </div>

        {/* Pass Footer Seal */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#9AA6B5]">
          <span>Cyber Convention Centre</span>
          <span className="font-mono text-[#DFC394]">Nov 14-15, 2026</span>
        </div>
      </div>

      {/* Pass Actions */}
      <div className="flex items-center justify-center gap-3 mt-4 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#111B2A] border border-white/10 hover:border-white/20 text-xs font-medium text-[#F5F3EF] transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C7A875]" />}
          <span>{copied ? 'Copied Token' : 'Copy Token'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#111B2A] border border-white/10 hover:border-white/20 text-xs font-medium text-[#F5F3EF] transition-all"
        >
          <Printer className="w-3.5 h-3.5 text-[#7998B8]" />
          <span>Print / PDF</span>
        </button>
      </div>

      <p className="text-[11px] text-[#9AA6B5]/80 text-center mt-3">
        Present this digital identity at Conclave registration desks for instant biometric or token check-in.
      </p>
    </div>
  );
}
