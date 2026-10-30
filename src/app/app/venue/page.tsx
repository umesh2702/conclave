'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Layers, 
  Radio, 
  Calendar, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  LifeBuoy, 
  Sparkles, 
  Clock, 
  Navigation,
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { StorageService } from '@/services/storage';
import { VenueZone, Session } from '@/types';

export default function VenueGuidePage() {
  const [zones, setZones] = useState<VenueZone[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('zone-1');

  const loadData = () => {
    const allZones = StorageService.getVenueZones();
    const allSessions = StorageService.getSessions();
    setZones(allZones);
    setSessions(allSessions);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ccc-storage-updated', handleUpdate);
    return () => window.removeEventListener('ccc-storage-updated', handleUpdate);
  }, []);

  const levels = ['All', 'Level 1', 'Level 2', 'Sky Level'];

  const filteredZones = selectedLevel === 'All' 
    ? zones 
    : zones.filter(z => z.level === selectedLevel);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // Find currently live session
  const liveSession = sessions.find(s => s.liveStatus === 'live');

  // Find sessions for selected zone
  const zoneSessions = selectedZone?.stageName 
    ? sessions.filter(s => s.stage === selectedZone.stageName || s.location.includes(selectedZone.name))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1524] via-[#0E1A2E] to-[#12223D] border border-white/[0.08] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC394]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFC394]/10 border border-[#DFC394]/20 text-[#DFC394] text-xs font-medium uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" />
              Physical Conclave Navigation Layer
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF] tracking-tight">
              Venue Guide & Wayfinding
            </h1>
            <p className="text-sm md:text-base text-[#9AA6B5] mt-1 max-w-2xl">
              Hyderabad International Convention Centre (HICC) — Cyberabad Grand Complex. 
              Find stages, private deal suites, networking lounges, and concierge stations.
            </p>
          </div>

          {/* Wi-Fi & Quick Info Badge */}
          <div className="bg-[#080E18]/80 backdrop-blur-md border border-white/[0.08] p-4 rounded-xl flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
              <span className="flex items-center gap-1.5 text-[#DFC394]">
                <Wifi className="w-4 h-4" /> Delegate Wi-Fi
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">WPA3 SECURE</span>
            </div>
            <div className="text-sm font-semibold text-[#F5F3EF] font-mono">CCC2026-HIGH-SPEED</div>
            <div className="text-[11px] text-[#9AA6B5] flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <span>Key: <strong className="text-[#F5F3EF] font-mono">SynerzLive26</strong></span>
              <span className="text-[#DFC394]">1 Gbps Fiber</span>
            </div>
          </div>
        </div>

        {/* Live Indicator Bar */}
        {liveSession && (
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-emerald-950/20 px-4 py-2.5 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">LIVE NOW:</span>
              <span className="text-xs text-[#F5F3EF] font-medium truncate max-w-md">{liveSession.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#DFC394] bg-[#DFC394]/10 px-2 py-0.5 rounded border border-[#DFC394]/20 flex items-center gap-1">
                <Navigation className="w-3 h-3" /> {liveSession.stage || liveSession.location}
              </span>
              <Link 
                href="/app"
                className="text-xs text-[#DFC394] hover:underline flex items-center gap-1"
              >
                View Live Hub <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Level Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedLevel === lvl
                ? 'bg-[#DFC394] text-[#080E18] shadow-sm font-semibold'
                : 'bg-[#0E1A2E]/80 text-[#9AA6B5] hover:text-[#F5F3EF] border border-white/[0.06] hover:bg-[#12223D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {lvl === 'All' ? 'All Conclave Levels' : lvl}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Zone Map + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Zones Grid Layout (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-serif font-semibold text-[#F5F3EF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#DFC394]" />
              Conclave Destination Zones ({filteredZones.length})
            </h2>
            <span className="text-xs text-[#9AA6B5]">Tap any zone to view details & live sessions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredZones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              const hasLive = liveSession && (
                (zone.stageName && liveSession.stage === zone.stageName) ||
                liveSession.location.includes(zone.name)
              );

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all text-left relative overflow-hidden border ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#12223D] to-[#0E1A2E] border-[#DFC394] shadow-lg shadow-[#DFC394]/5 ring-1 ring-[#DFC394]/40'
                      : 'bg-[#0E1A2E]/60 hover:bg-[#0E1A2E] border-white/[0.08] hover:border-white/[0.18]'
                  }`}
                >
                  {/* Top code and level badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider"
                      style={{ 
                        backgroundColor: `${zone.color || '#DFC394'}15`, 
                        color: zone.color || '#DFC394',
                        border: `1px solid ${zone.color || '#DFC394'}30`
                      }}
                    >
                      {zone.code}
                    </span>
                    <span className="text-xs text-[#9AA6B5] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#7998B8]" /> {zone.level}
                    </span>
                  </div>

                  {/* Title & Live indicator */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-serif text-base font-semibold leading-snug ${isSelected ? 'text-[#DFC394]' : 'text-[#F5F3EF]'}`}>
                      {zone.name}
                    </h3>
                    {hasLive && (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                        <Radio className="w-3 h-3" /> LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9AA6B5] mt-2 line-clamp-2 leading-relaxed">
                    {zone.description}
                  </p>

                  {/* Bottom Stats */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#9AA6B5]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#7998B8]" /> {zone.capacity || 'All Delegates'}
                    </span>
                    <span className="text-[#DFC394] font-medium flex items-center gap-1 group">
                      View Guide <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Zone Deep Dive (5 cols) */}
        <div className="lg:col-span-5">
          {selectedZone ? (
            <div className="sticky top-20 rounded-2xl bg-[#0E1A2E] border border-white/[0.1] p-6 space-y-6 shadow-xl">
              {/* Zone Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#DFC394] bg-[#DFC394]/10 px-2.5 py-0.5 rounded border border-[#DFC394]/20">
                    {selectedZone.code} • {selectedZone.level}
                  </span>
                  <span className="text-xs text-[#9AA6B5]">Capacity: {selectedZone.capacity || 'General Access'}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F5F3EF]">
                  {selectedZone.name}
                </h3>
                <p className="text-sm text-[#9AA6B5] mt-2 leading-relaxed">
                  {selectedZone.description}
                </p>
              </div>

              {/* Facilities Checklist */}
              <div>
                <h4 className="text-xs font-semibold text-[#F5F3EF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFC394]" /> Key Facilities & Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedZone.facilities.map((fac, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#080E18]/60 border border-white/[0.04] text-xs text-[#9AA6B5]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DFC394]" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Sessions in this Zone */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-[#F5F3EF] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#DFC394]" /> Sessions at this Stage ({zoneSessions.length})
                  </h4>
                  {selectedZone.stageName && (
                    <Link
                      href={`/app/agenda`}
                      className="text-[11px] text-[#DFC394] hover:underline flex items-center gap-1"
                    >
                      Full Programme <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>

                {zoneSessions.length > 0 ? (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {zoneSessions.map((ses) => (
                      <div 
                        key={ses.id}
                        className={`p-3 rounded-xl border text-left ${
                          ses.liveStatus === 'live'
                            ? 'bg-emerald-950/30 border-emerald-500/40'
                            : ses.liveStatus === 'completed'
                            ? 'bg-[#080E18]/40 border-white/[0.04] opacity-60'
                            : 'bg-[#080E18]/80 border-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-[#DFC394] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Day {ses.day} • {ses.startTime} – {ses.endTime}
                          </span>
                          {ses.liveStatus === 'live' && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                          {ses.liveStatus === 'completed' && (
                            <span className="text-[10px] text-[#9AA6B5]">Completed</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#F5F3EF] line-clamp-1">{ses.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#080E18]/40 border border-white/[0.04] text-center text-xs text-[#9AA6B5]">
                    No formal stage keynotes scheduled here. This area is dedicated to continuous networking, hospitality, and operations.
                  </div>
                )}
              </div>

              {/* Direction helper */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#DFC394]/10 to-transparent border border-[#DFC394]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DFC394]/20 flex items-center justify-center text-[#DFC394]">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F5F3EF]">Need Escort or Assistance?</div>
                    <div className="text-[11px] text-[#9AA6B5]">Visit Operations Desk on Level 1 (Zone OPS-L1)</div>
                  </div>
                </div>
                <Link
                  href="/app/agenda"
                  className="px-3 py-1.5 rounded-lg bg-[#DFC394] text-[#080E18] text-xs font-semibold hover:bg-[#edd8b4] transition-colors whitespace-nowrap"
                >
                  Schedule
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom Emergency & Hospitality Services Cards */}
      <div className="border-t border-white/[0.08] pt-8">
        <h3 className="text-base font-serif font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-[#DFC394]" />
          Essential On-Site Delegate Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#DFC394]/10 text-[#DFC394] shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F5F3EF]">Barista & Catering</div>
              <div className="text-[11px] text-[#9AA6B5] mt-0.5">Dining Pavilion (Level 1) & Sky Terrace Bar. Continuous service 8:30 AM – 6:30 PM.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#7998B8]/10 text-[#7998B8] shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F5F3EF]">ULink Technical Concierge</div>
              <div className="text-[11px] text-[#9AA6B5] mt-0.5">East Lobby Registration Concourse. Device charging, badge re-prints & app support.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F5F3EF]">Medical & First Aid</div>
              <div className="text-[11px] text-[#9AA6B5] mt-0.5">Level 1 West Wing Corridor adjacent to Plenary Hall. Paramedic on standby.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1A2E]/60 border border-white/[0.06] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F5F3EF]">Deal Pod Concierge</div>
              <div className="text-[11px] text-[#9AA6B5] mt-0.5">Level 2 Center Lobby. Hostesses assist founders and investors to allocated pods.</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
  );
}
