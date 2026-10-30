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
  Radio,
  Clock,
  X,
  Sliders
} from 'lucide-react';

export function DemoBar() {
  const { currentUser, demoAccounts, switchUser, resetAllData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const pathname = usePathname();

  const clock = Storage.getSimulationClock();

  const handleReset = () => {
    if (confirm('Restore initial Conclave demo dataset? All sessions, bookmarks, and connections will revert to default.')) {
      setResetting(true);
      resetAllData();
      setTimeout(() => setResetting(false), 500);
    }
  };

  const handleSelectClockPreset = (presetKey: string) => {
    SimulationService.applyPreset(presetKey);
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'founder':
        return <TrendingUp className="w-3.5 h-3.5 text-[#7998B8]" />;
      case 'investor':
        return <Briefcase className="w-3.5 h-3.5 text-[#D2B47C]" />;
      case 'mentor':
        return <Award className="w-3.5 h-3.5 text-emerald-400" />;
      case 'organizer':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <>
      {/* Floating Discreet Demo Trigger Pill */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] md:bottom-5 right-3 sm:right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl border transition-all ${
            isOpen 
              ? 'bg-[#152235] border-[#D2B47C] text-[#D2B47C]' 
              : 'bg-[#101927]/90 hover:bg-[#152235] border-[#202C3D] hover:border-[#D2B47C]/40 text-[#91A0B4] hover:text-[#F5F3EF] backdrop-blur-md'
          }`}
          title="Open Demo Persona & Clock Simulation Controls"
        >
          <span className="w-2 h-2 rounded-full bg-[#D2B47C] animate-pulse" />
          <span className="text-[11px] font-mono tracking-tight">DEMO CONTROLS</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Demo Control Center Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full md:w-[460px] bg-[#101927] border border-[#202C3D] rounded-t-2xl md:rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3D]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#D2B47C]/15 text-[#D2B47C]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F3EF]">
                    ULink Live Demo Companion
                  </h3>
                  <p className="text-[10px] text-[#91A0B4]">
                    Simulate attendee experiences and event progression
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center p-1 rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
                aria-label="Close demo controls"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Switcher Section */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D2B47C] flex items-center justify-between">
                <span>1. Switch Attendee Persona</span>
                <span className="text-[10px] font-normal text-[#91A0B4] lowercase">
                  active: {currentUser?.role}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((account) => {
                  const isActive = currentUser?.id === account.id;
                  return (
                    <button
                      key={account.id}
                      onClick={() => switchUser(account.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left border text-xs transition-all ${
                        isActive
                          ? 'bg-[#152235] border-[#D2B47C] text-[#F5F3EF] shadow-sm'
                          : 'bg-[#080D16]/60 border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF] hover:border-white/20'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#101927] border border-white/10 shrink-0">
                        {getRoleIcon(account.role)}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate text-[11px]">
                          {account.fullName}
                        </div>
                        <div className="text-[10px] text-[#91A0B4] capitalize">
                          {account.category}
                        </div>
                      </div>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D2B47C]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clock Simulation Presets */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D2B47C] flex items-center justify-between">
                <span>2. Event Clock Timeline Presets</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Day {clock.currentDay} • {clock.currentTime}
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SIMULATION_PRESETS.map((preset) => {
                  const isCurrent = clock.presetKey === preset.key;
                  return (
                    <button
                      key={preset.key}
                      onClick={() => handleSelectClockPreset(preset.key)}
                      className={`w-full min-h-[40px] text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-[#D2B47C] border-[#D2B47C] text-[#080D16] font-bold shadow-sm'
                          : 'bg-[#080D16]/60 border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate text-[11px]">{preset.label}</span>
                      {isCurrent ? (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#080D16] text-[#D2B47C]">
                          Active
                        </span>
                      ) : (
                        <Radio className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Reset */}
            <div className="pt-3 border-t border-[#202C3D] flex items-center justify-between gap-3">
              {pathname.startsWith('/admin') ? (
                <Link
                  href="/app"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center min-h-[40px] gap-1.5 text-xs text-[#D2B47C] hover:underline font-semibold"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Go to Attendee Live Hub</span>
                </Link>
              ) : (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center min-h-[40px] gap-1.5 text-xs text-amber-300 hover:underline font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Organizer Control Centre</span>
                </Link>
              )}

              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex items-center justify-center min-h-[40px] gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#91A0B4] hover:text-[#F5F3EF] border border-[#202C3D] transition-colors"
                title="Restore default mock data"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>Reset Data</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
