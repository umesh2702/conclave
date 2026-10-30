'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SimulationService, SIMULATION_PRESETS } from '../../services/simulationService';
import { Storage } from '../../services/storage';
import { 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Users,
  ExternalLink,
  Layers,
  Clock,
  Radio
} from 'lucide-react';

export function DemoBar() {
  const { currentUser, role, demoAccounts, switchUser, resetAllData } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [clockDropdownOpen, setClockDropdownOpen] = useState(false);
  const pathname = usePathname();

  const clock = Storage.getSimulationClock();

  const handleReset = () => {
    if (confirm('Reset all demo data back to the original realistic seed state?')) {
      setResetting(true);
      resetAllData();
      setTimeout(() => setResetting(false), 500);
    }
  };

  const handleSelectClockPreset = (presetKey: string) => {
    SimulationService.applyPreset(presetKey);
    setClockDropdownOpen(false);
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'founder':
        return <TrendingUp className="w-3.5 h-3.5 text-[#7998B8]" />;
      case 'investor':
        return <Briefcase className="w-3.5 h-3.5 text-[#C7A875]" />;
      case 'mentor':
        return <Award className="w-3.5 h-3.5 text-emerald-400" />;
      case 'organizer':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <aside aria-label="Demo environment control panel" className="sticky top-0 z-50 bg-[#0D1522]/95 border-b border-white/10 backdrop-blur-md transition-all text-xs">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Mode Badge & Event Clock Simulator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-[#C7A875] font-semibold tracking-wider text-[10px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7A875] animate-ping" />
            ULink Live
          </span>

          {/* Event Clock Simulator Widget */}
          <div className="relative">
            <button
              onClick={() => setClockDropdownOpen(!clockDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#172335] hover:bg-[#1f2f47] text-[#F5F3EF] border border-emerald-500/30 text-[11px] font-mono transition-colors"
              title="Change simulated conclave time"
            >
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">LIVE:</span>
              <span>Day {clock.currentDay} • {clock.currentTime}</span>
              <ChevronDown className="w-3 h-3 text-[#9AA6B5]" />
            </button>

            {clockDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-[#080E18] border border-white/15 rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                <div className="text-[10px] uppercase tracking-wider text-[#9AA6B5] px-2 py-1 font-semibold border-b border-white/5">
                  Conclave Clock Simulator (Demo)
                </div>
                {SIMULATION_PRESETS.map((preset) => {
                  const isCurrent = clock.presetKey === preset.key;
                  return (
                    <button
                      key={preset.key}
                      onClick={() => handleSelectClockPreset(preset.key)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#C7A875] text-[#080E18] font-bold'
                          : 'text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{preset.label}</span>
                      {isCurrent && <span className="text-[9px] uppercase font-bold ml-1">Active</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Quick Switch Roles */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {demoAccounts.map((account) => {
            const isActive = currentUser?.id === account.id;
            return (
              <button
                key={account.id}
                onClick={() => switchUser(account.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#C7A875] text-[#080E18] shadow-sm font-semibold'
                    : 'bg-[#172335]/70 text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-[#172335]'
                }`}
                title={`Switch to ${account.fullName} (${account.category})`}
              >
                {getRoleIcon(account.role)}
                <span>{account.fullName.split(' ')[0]}</span>
                <span className="opacity-75 text-[9px] uppercase hidden md:inline">
                  {account.role === 'organizer' ? 'Admin' : account.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Links & Reset */}
        <div className="flex items-center gap-2">
          {pathname.startsWith('/admin') ? (
            <Link
              href="/app"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#172335] hover:bg-[#111B2A] text-[#7998B8] hover:text-[#F5F3EF] border border-white/10"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Live Event Hub</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#172335] hover:bg-[#111B2A] text-amber-300 hover:text-amber-200 border border-amber-500/20"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Organizer Control</span>
            </Link>
          )}

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
            title="Restore initial seed dataset"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
