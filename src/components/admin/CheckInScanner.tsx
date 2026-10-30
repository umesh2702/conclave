'use client';

import React, { useState } from 'react';
import { CheckInResult, Attendee } from '../../types';
import { CheckInService } from '../../services/checkInService';
import { Storage } from '../../services/storage';
import { 
  QrCode, 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Search,
  Building2,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';

interface CheckInScannerProps {
  onCheckInCompleted?: () => void;
}

export function CheckInScanner({ onCheckInCompleted }: CheckInScannerProps) {
  const [inputToken, setInputToken] = useState('');
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [scanningSimulated, setScanningSimulated] = useState(false);

  const attendees = Storage.getAttendees();

  const handleScanOrSubmit = (tokenToVerify?: string) => {
    const token = tokenToVerify || inputToken;
    if (!token.trim()) return;

    setScanningSimulated(true);

    setTimeout(() => {
      const res = CheckInService.validateAndCheckIn(token);
      setResult(res);
      setScanningSimulated(false);
      setInputToken('');
      if (onCheckInCompleted) onCheckInCompleted();
    }, 600);
  };

  const handleQuickTest = (token: string) => {
    setInputToken(token);
    handleScanOrSubmit(token);
  };

  return (
    <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F3EF]">
              QR Check-in & Pass Validator
            </h3>
            <p className="text-xs text-[#9AA6B5]">
              Scan attendee digital badge QR code or enter token hash
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Scanner Ready</span>
        </div>
      </div>

      {/* Camera Simulator & Visual Target */}
      <div className="relative rounded-2xl overflow-hidden bg-[#080E18] border border-white/10 p-6 flex flex-col items-center justify-center min-h-[220px]">
        {/* Subtle scanning laser line effect */}
        {scanningSimulated && (
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C7A875] to-transparent animate-bounce top-1/2 -translate-y-1/2 shadow-[0_0_15px_#C7A875]" />
        )}

        <div className="w-48 h-48 border-2 border-dashed border-[#C7A875]/40 rounded-xl flex flex-col items-center justify-center p-4 relative text-center">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C7A875]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C7A875]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C7A875]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C7A875]" />

          <Camera className="w-8 h-8 text-[#9AA6B5] mb-2 opacity-60" />
          <span className="text-xs text-[#9AA6B5]">Align QR pass in view</span>
          <span className="text-[10px] text-white/40 mt-1">Live Optical Sensor</span>
        </div>
      </div>

      {/* Manual Input Form */}
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScanOrSubmit();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9AA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Paste or type token (e.g. TOKEN-CCC-94a8e8f2 or CCC-2026-F001)"
              className="w-full rounded-xl bg-[#111B2A] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={scanningSimulated || !inputToken.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold champagne-btn shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            <span>{scanningSimulated ? 'Validating...' : 'Verify Entry'}</span>
          </button>
        </form>
      </div>

      {/* Check-In Result Banner */}
      {result && (
        <div
          className={`p-4 rounded-xl border animate-in fade-in transition-all ${
            result.success
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : result.alreadyCheckedIn
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : result.alreadyCheckedIn ? (
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold mb-1">
                {result.success
                  ? 'Access Granted — Check-In Recorded'
                  : result.alreadyCheckedIn
                  ? 'Duplicate Pass Detected — Entry Denied'
                  : 'Invalid Token — Verification Failed'}
              </h4>
              <p className="text-xs leading-relaxed opacity-90">{result.message}</p>

              {result.attendee && (
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] opacity-75 block">Attendee:</span>
                    <span className="font-semibold text-white">{result.attendee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">Organization:</span>
                    <span className="font-medium">{result.attendee.organization}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">Category:</span>
                    <span className="font-medium">{result.attendee.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">Pass ID:</span>
                    <span className="font-mono">{result.attendee.id}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Presets for Demo Presentation */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#9AA6B5]">
            Quick Test Presets (One-click scan testing):
          </span>
          <span className="text-[10px] text-white/50">Click to validate pass</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {attendees.slice(0, 6).map((att) => (
            <button
              key={att.id}
              onClick={() => handleQuickTest(att.tokenHash)}
              className="p-2.5 rounded-lg bg-[#111B2A] border border-white/5 hover:border-[#C7A875]/40 text-left text-xs transition-colors flex items-center justify-between group"
            >
              <div className="truncate mr-2">
                <div className="font-semibold text-[#F5F3EF] truncate group-hover:text-[#DFC394]">
                  {att.fullName}
                </div>
                <div className="text-[10px] text-[#9AA6B5] truncate">
                  {att.category} • {att.organization}
                </div>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                  att.checkInStatus
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-300'
                }`}
              >
                {att.checkInStatus ? 'Checked In' : 'Pending'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
