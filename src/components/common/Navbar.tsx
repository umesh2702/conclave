'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Users, 
  Calendar, 
  Network, 
  Clock, 
  QrCode, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, role, isOrganizer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Live Now', href: '/app', isLive: true },
    { label: 'Programme', href: '/app/agenda' },
    { label: 'Speakers', href: '/app/speakers' },
    { label: 'Venue Guide', href: '/app/venue' },
    { label: 'People', href: '/app/people' },
    { label: 'Connections', href: '/app/connections' },
    { label: 'Deal Pods', href: '/app/meetings' },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080E18]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#DFC394] via-[#C7A875] to-[#7998B8] p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#080E18] rounded-[7px] flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-[#DFC394] tracking-wider">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-[#F5F3EF] group-hover:text-[#DFC394] transition-colors">
                CAPITAL CONNECT
              </span>
              <span className="text-[10px] text-[#9AA6B5] tracking-widest font-mono uppercase">
                ULink Live • Startup Synerz
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#172335] text-[#DFC394] shadow-sm border border-[#C7A875]/20 font-semibold'
                      : 'text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/[0.04]'
                  }`}
                >
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isOrganizer && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  pathname.startsWith('/admin')
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Live Control</span>
              </Link>
            )}
          </nav>

          {/* Right Action: Pass & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/access"
              className="px-3 py-1.5 rounded text-xs font-medium text-[#9AA6B5] hover:text-[#DFC394] border border-white/10 hover:border-[#C7A875]/30 transition-all"
            >
              Access Portal
            </Link>

            <Link
              href="/app/pass"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold champagne-btn shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Digital Pass</span>
            </Link>

            {currentUser && (
              <Link
                href={`/app/people/${currentUser.id}`}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-[#111B2A] border border-white/10 hover:border-[#C7A875]/40 transition-all"
                title="View your conclave profile"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#172335] border border-[#C7A875]/30">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#C7A875]">
                      {currentUser.fullName[0]}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-[#F5F3EF] pr-1">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/app/pass"
              className="p-1.5 rounded bg-[#172335] text-[#DFC394] border border-[#C7A875]/30"
              title="Digital Pass"
            >
              <QrCode className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/[0.05]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1522] border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
          {currentUser && (
            <div className="p-3 mb-3 rounded-lg bg-[#111B2A] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#172335] border border-[#C7A875]/40">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F5F3EF]">{currentUser.fullName}</div>
                  <div className="text-xs text-[#9AA6B5]">{currentUser.organization} • {currentUser.category}</div>
                </div>
              </div>
              <Link
                href={`/app/people/${currentUser.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#DFC394] hover:underline"
              >
                Profile
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    active
                      ? 'bg-[#172335] text-[#DFC394] border border-[#C7A875]/30'
                      : 'text-[#9AA6B5] hover:text-[#F5F3EF] bg-white/[0.02]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/access"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-center text-xs text-[#DFC394] bg-[#172335] rounded-lg border border-[#C7A875]/30 font-semibold"
            >
              Delegate Access Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-center text-xs font-semibold text-amber-300 bg-amber-950/30 rounded-lg border border-amber-500/30"
            >
              Organizer Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
