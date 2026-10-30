'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { AnnouncementService } from '../../services/announcementService';
import { SimulationClock, Announcement } from '../../types';
import { 
  Radio, 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, isOrganizer } = useAuth();
  const [clock, setClock] = useState<SimulationClock>(StorageService.getSimulationClock());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setClock(StorageService.getSimulationClock());
      setAnnouncements(AnnouncementService.getAnnouncements());
    };
    update();
    window.addEventListener('ccc-storage-updated', update);
    return () => window.removeEventListener('ccc-storage-updated', update);
  }, []);

  // ONLY FIVE PRIMARY DESTINATIONS
  const primaryNav = [
    { label: 'Live', href: '/app', isLive: true, icon: Radio },
    { label: 'Programme', href: '/app/agenda', icon: Calendar },
    { label: 'Venue', href: '/app/venue', icon: MapPin },
    { label: 'People', href: '/app/people', icon: Users },
    { label: 'My Profile', href: '/app/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  const urgentCount = announcements.filter(a => a.priority === 'urgent' || a.priority === 'high').length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080D16]/95 backdrop-blur-md border-b border-[#202C3D]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Left: Brand Identity & Small LIVE Indicator */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
              <Link href="/app" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#152235] border border-[#D2B47C]/30 flex items-center justify-center font-serif text-[#D2B47C] font-bold text-sm shadow-sm group-hover:border-[#D2B47C]/60 transition-colors shrink-0">
                  U
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold tracking-tight text-[#F5F3EF] group-hover:text-[#D2B47C] transition-colors whitespace-nowrap">
                      ULink Live
                    </span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <span className="text-[10px] text-[#91A0B4] tracking-wider font-mono uppercase truncate max-w-[110px] min-[390px]:max-w-[140px] min-[430px]:max-w-[180px] sm:max-w-none">
                    Capital Connect Conclave
                  </span>
                </div>
              </Link>

              {/* Event Day & Simulated Clock Pill (Hidden on smaller screens) */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101927] border border-[#202C3D] text-xs font-mono text-[#91A0B4] shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#D2B47C]" />
                <span className="text-[#F5F3EF] font-semibold">Day {clock.currentDay}</span>
                <span>•</span>
                <span className="text-[#D2B47C] font-semibold">{clock.currentTime}</span>
              </div>
            </div>

            {/* Center: Exactly Five Primary Destinations */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/30 font-semibold shadow-sm'
                        : 'text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D2B47C]' : 'text-[#91A0B4]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isOrganizer && (
                <Link
                  href="/admin"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ml-1 ${
                    pathname.startsWith('/admin')
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold'
                      : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/20 border border-amber-500/20'
                  }`}
                  title="Organizer Live Control Centre"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Control</span>
                </Link>
              )}
            </nav>

            {/* Right: Notifications & Profile Access */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Notification Indicator */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border transition-all flex items-center justify-center relative ${
                    notificationsOpen 
                      ? 'bg-[#152235] border-[#D2B47C]/40 text-[#D2B47C]' 
                      : 'bg-[#101927] border-[#202C3D] text-[#91A0B4] hover:text-[#F5F3EF] hover:border-white/20'
                  }`}
                  aria-label="View Conclave Announcements"
                  title="Conclave Announcements"
                >
                  <Bell className="w-4 h-4" />
                  {urgentCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {urgentCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer - immune to mobile horizontal overflow */}
                {notificationsOpen && (
                  <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 bg-[#101927] border border-[#202C3D] rounded-xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#202C3D]">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#D2B47C]" />
                        <span className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                          Official Announcements
                        </span>
                      </div>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="w-8 h-8 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
                        aria-label="Close announcements"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {announcements.length > 0 ? (
                        announcements.slice(0, 5).map((ann) => (
                          <div
                            key={ann.id}
                            className={`p-3 rounded-lg border text-xs space-y-1 ${
                              ann.priority === 'urgent'
                                ? 'bg-red-950/20 border-red-500/30'
                                : ann.priority === 'high'
                                ? 'bg-amber-950/20 border-amber-500/30'
                                : 'bg-[#152235] border-[#202C3D]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[#F5F3EF] flex items-center gap-1">
                                {ann.priority === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                                {ann.title}
                              </span>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-[#D2B47C]">
                                {ann.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#91A0B4] leading-relaxed">
                              {ann.message}
                            </p>
                            <div className="text-[9px] text-[#91A0B4]/70 pt-0.5">
                              {ann.author}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-xs text-[#91A0B4]">
                          No active announcements at this time.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Profile Access - Compact Icon on Mobile, Pill with Name on Desktop */}
              {currentUser && (
                <Link
                  href="/app/profile"
                  className={`flex items-center justify-center sm:justify-start gap-2 h-10 min-h-[40px] w-10 sm:w-auto p-0 sm:pl-1.5 sm:pr-2.5 rounded-full border transition-all ${
                    pathname.startsWith('/app/profile') || pathname.startsWith('/app/pass')
                      ? 'bg-[#152235] border-[#D2B47C]/50 text-[#D2B47C]'
                      : 'bg-[#101927] border-[#202C3D] hover:border-[#D2B47C]/30 text-[#F5F3EF]'
                  }`}
                  title="My Profile & Digital Pass"
                >
                  <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-[#152235] border border-[#D2B47C]/40 flex items-center justify-center text-[10px] font-bold text-[#D2B47C] shrink-0">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.fullName[0]
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium truncate max-w-[110px]">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#91A0B4] hover:text-[#F5F3EF] hover:bg-[#152235] transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#202C3D] bg-[#080D16] px-4 py-3 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#202C3D] text-xs font-mono text-[#91A0B4]">
              <span>Event Clock:</span>
              <span className="text-[#D2B47C] font-semibold">Day {clock.currentDay} • {clock.currentTime}</span>
            </div>

            {primaryNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium ${
                    active ? 'bg-[#152235] text-[#D2B47C] font-semibold' : 'text-[#91A0B4]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}

            {isOrganizer && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/20 border border-amber-500/20"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Organizer Control Centre</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
