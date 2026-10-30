'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
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
  Layers
} from 'lucide-react';

export function DemoBar() {
  const { currentUser, role, demoAccounts, switchUser, resetAllData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const pathname = usePathname();

  const handleReset = () => {
    if (confirm('Reset all demo data back to the original realistic seed state?')) {
      setResetting(true);
      resetAllData();
      setTimeout(() => setResetting(false), 500);
    }
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
        {/* Left: Mode Badge & Current Demo Persona */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-[#C7A875] font-semibold tracking-wider text-[10px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7A875] animate-ping" />
            Demo Mode Active
          </span>

          <div className="hidden sm:flex items-center gap-1.5 text-[#9AA6B5]">
            <span>Active Persona:</span>
            <span className="text-[#F5F3EF] font-medium flex items-center gap-1 bg-[#172335] px-2 py-0.5 rounded border border-white/5">
              {currentUser && getRoleIcon(currentUser.role)}
              {currentUser?.fullName || 'Loading...'}
              <span className="text-[10px] text-[#C7A875] uppercase ml-1">
                ({currentUser?.category})
              </span>
            </span>
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
              <Layers className="w-3 h-3" />
              <span>Attendee App</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#172335] hover:bg-[#111B2A] text-amber-300 hover:text-amber-200 border border-amber-500/20"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
            title="Restore initial seed dataset"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
