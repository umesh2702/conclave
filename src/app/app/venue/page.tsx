'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { StorageService } from '@/services/storage';
import { VenueZone, Session } from '@/types';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  LifeBuoy, 
  Clock, 
  Navigation,
  ArrowRight,
  Radio,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export default function VenueCompanionPage() {
  const searchParams = useSearchParams();
  const highlightedParam = searchParams.get('highlight');

  const [zones, setZones] = useState<VenueZone[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');

  useEffect(() => {
    const allZones = StorageService.getVenueZones();
    const allSessions = StorageService.getSessions();
    setZones(allZones);
    setSessions(allSessions);

    if (highlightedParam && allZones.length > 0) {
      const match = allZones.find(
        (z) => z.name.toLowerCase().includes(highlightedParam.toLowerCase()) ||
               (z.stageName && z.stageName.toLowerCase().includes(highlightedParam.toLowerCase()))
      );
      if (match) {
        setSelectedZoneId(match.id);
        setSelectedLevel(match.level);
      }
    }
  }, [highlightedParam]);

  const levels = ['All', 'Level 1', 'Level 2', 'Sky Level'];

  const filteredZones = selectedLevel === 'All' 
    ? zones 
    : zones.filter((z) => z.level === selectedLevel);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Sessions taking place in this selected zone
  const zoneSessions = selectedZone?.stageName 
    ? sessions.filter((s) => s.stage === selectedZone.stageName || s.location.includes(selectedZone.name))
    : [];

  const liveSessionInZone = zoneSessions.find((s) => s.liveStatus === 'live');

  // Step-by-step walking instructions depending on level/zone
  const getDirections = (zone: VenueZone) => {
    switch (zone.code) {
      case 'STAGE-A':
        return [
          'From the main Level 1 concourse, walk past the Fast-Track Registration Desk.',
          'Take the central illuminated hallway toward Grand Ballroom A.',
          'Doors open directly into the main auditorium tier.',
        ];
      case 'REG-EAST':
        return [
          'Located immediately inside the ground floor arrival concourse.',
          'Present your digital QR pass at any optical scanner pillar.',
          'Collect your printed physical lanyard badge at counter 1-4.',
        ];
      case 'DINING-L1':
        return [
          'Located in the South Wing of Level 1, opposite Plenary Stage A.',
          'Open continuously for artisan coffee, refreshments, and lunch buffets.',
        ];
      case 'STAGE-B':
        return [
          'Take the central escalator or elevator bank to Level 2.',
          'Turn left at the top of the escalators toward Hall B.',
          'Acoustic double doors marked "Venture Stage B".',
        ];
      case 'PODS-L2':
        return [
          'Take the escalator to Level 2 and proceed to the North Wing.',
          'Check in with the Deal Room concierge at the reception desk.',
          'Pods A-1 through B-8 are labeled along the private carpeted suites.',
        ];
      case 'LOUNGE-L2':
        return [
          'Located on Level 2 between Venture Stage B and Deal Pods.',
          'Private card/token access reserved for verified Investors and Speakers.',
        ];
      case 'TERRACE-SKY':
        return [
          'Take the express high-speed elevator directly to "Sky Level (Floor 5)".',
          'Exit onto the open-air panoramic garden and cocktail lounge.',
        ];
      case 'OPS-L1':
        return [
          'Located next to the East Concourse registration desks.',
          'Technical support, speaker green room liaison, and lost-and-found.',
        ];
      default:
        return [
          'Follow illuminated digital signage in the central lobby.',
          'Conclave floor stewards are stationed at all escalator banks.',
        ];
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080D16] text-[#F5F3EF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8 w-full space-y-5 sm:space-y-6 pb-28 md:pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-[#202C3D]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D2B47C] font-semibold">
                Venue Companion &amp; Wayfinding
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Floor Directory
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F5F3EF] tracking-tight">
              Cyber Convention Centre &amp; Grand Ballroom
            </h1>
          </div>

          {/* Wi-Fi & Venue Credentials Pill */}
          <div className="flex items-center gap-3 bg-[#101927] border border-[#202C3D] px-3.5 py-2 rounded-xl text-xs">
            <Wifi className="w-4 h-4 text-[#D2B47C] shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-[#F5F3EF] truncate">
                Network: <span className="font-mono text-[#D2B47C]">CCC2026-HIGH-SPEED</span>
              </div>
              <div className="text-[10px] text-[#91A0B4] truncate">
                Passcode: <span className="font-mono text-[#F5F3EF]">SynerzLive26</span> • 1 Gbps Fiber
              </div>
            </div>
          </div>
        </div>

        {/* Level Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
          <span className="text-xs font-mono text-[#91A0B4] mr-1 hidden sm:inline shrink-0">Select Floor:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLevel === lvl
                  ? 'bg-[#152235] text-[#D2B47C] border border-[#D2B47C]/40 shadow-sm'
                  : 'bg-[#101927] text-[#91A0B4] hover:text-[#F5F3EF] border border-[#202C3D]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Interactive Schematic Layout & Zone Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Schematic Floor Directory Cards (7 COLS) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#91A0B4] flex items-center justify-between pb-1">
              <span>Interactive Floor Plan Zones ({filteredZones.length})</span>
              <span>Click a zone to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredZones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                const hasLive = sessions.some((s) => (s.stage === zone.stageName || s.location.includes(zone.name)) && s.liveStatus === 'live');

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 relative ${
                      isSelected
                        ? 'bg-[#152235] border-[#D2B47C] shadow-lg ring-1 ring-[#D2B47C]/40'
                        : 'surface-interactive'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#080D16] text-[#D2B47C] border border-[#202C3D]">
                        {zone.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#91A0B4]">
                        {zone.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#F5F3EF] leading-snug">
                        {zone.name}
                      </h3>
                      <p className="text-[11px] text-[#91A0B4] line-clamp-2 mt-1 font-light">
                        {zone.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#202C3D] flex items-center justify-between text-[11px]">
                      <span className="text-[#91A0B4]">{zone.capacity || 'Open Floor'}</span>
                      {hasLive && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Now
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Zone Dossier & Navigation Guide (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            {selectedZone ? (
              <div className="surface-card-elevated p-6 space-y-5 sticky top-20 shadow-2xl">
                
                {/* Zone Header */}
                <div className="space-y-1.5 pb-4 border-b border-[#202C3D]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D2B47C] bg-[#101927] px-2.5 py-0.5 rounded border border-[#202C3D]">
                      {selectedZone.code} • {selectedZone.level}
                    </span>
                    <span className="text-xs text-[#91A0B4] font-mono">
                      Capacity: {selectedZone.capacity || 'Open Concourse'}
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-[#F5F3EF]">
                    {selectedZone.name}
                  </h2>
                  <p className="text-xs text-[#91A0B4] leading-relaxed font-light">
                    {selectedZone.description}
                  </p>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#D2B47C] font-semibold">
                    Key Facilities &amp; Equipment
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedZone.facilities.map((fac, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#101927] border border-[#202C3D] text-[11px] text-[#F5F3EF]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
                        <span className="truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Walking Directions */}
                <div className="space-y-2 pt-2 border-t border-[#202C3D]">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#D2B47C] font-semibold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>How to Reach This Location</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#91A0B4]">
                    {getDirections(selectedZone).map((step, i) => (
                      <div key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="font-mono text-[10px] text-[#D2B47C] font-bold shrink-0 pt-0.5">
                          {i + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Associated Sessions in this Zone */}
                {zoneSessions.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-[#202C3D]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#D2B47C] font-semibold flex items-center justify-between">
                      <span>Sessions in this Room ({zoneSessions.length})</span>
                      <Link href="/app/agenda" className="text-[10px] text-[#91A0B4] hover:text-[#D2B47C]">
                        Full Schedule →
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {zoneSessions.map((s) => (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-lg bg-[#101927] border border-[#202C3D] text-xs flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <div className="font-semibold text-[#F5F3EF] truncate">{s.title}</div>
                            <div className="text-[10px] font-mono text-[#91A0B4]">Day {s.day} • {s.startTime}</div>
                          </div>
                          {s.liveStatus === 'live' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                              LIVE
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="surface-card p-8 text-center text-xs text-[#91A0B4]">
                Select a zone from the floor plan to inspect location details and navigation instructions.
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
