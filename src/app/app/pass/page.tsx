'use client';

import React from 'react';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { useAuth } from '../../../context/AuthContext';
import { DigitalPassCard } from '../../../components/pass/DigitalPassCard';
import { 
  QrCode, 
  ShieldCheck, 
  Info, 
  MapPin, 
  Calendar, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function DigitalPassPage() {
  const { currentUser, demoAccounts, switchUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E18] text-[#9AA6B5]">
        Loading pass...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital Credential • Conclave 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
            Official Conclave Entry Pass
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B5] max-w-md mx-auto">
            Authorized delegate credential for Capital Connect Conclave. Displays your check-in token and access level.
          </p>
        </div>

        {/* Demo Switcher Pill for Pass Inspection */}
        <div className="card-glass rounded-xl p-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#9AA6B5] font-medium">
            Inspect credentials for different delegate tiers:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {demoAccounts.map((account) => {
              const active = currentUser.id === account.id;
              return (
                <button
                  key={account.id}
                  onClick={() => switchUser(account.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-[#C7A875] text-[#080E18] shadow-sm'
                      : 'bg-[#172335] text-[#9AA6B5] hover:text-[#F5F3EF]'
                  }`}
                >
                  {account.fullName.split(' ')[0]} ({account.category})
                </button>
              );
            })}
          </div>
        </div>

        {/* The Digital Pass Card */}
        <div className="py-2">
          <DigitalPassCard attendee={currentUser} />
        </div>

        {/* Verification Guidelines & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="card-glass rounded-xl p-5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-[#DFC394] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#C7A875]" />
              <span>Venue Entry & Security Protocol</span>
            </div>
            <p className="text-[#9AA6B5] leading-relaxed">
              Upon arrival at the Cyber Convention Centre, proceed to the Fast-Track Registration Desks located in the Grand Lobby. Present this QR code on your mobile device for immediate scan validation.
            </p>
            <div className="pt-2 text-[11px] text-[#F5F3EF] space-y-1">
              <div>• Non-transferable digital identity token</div>
              <div>• Valid for all 2-day keynotes, deal rooms, and networking receptions</div>
            </div>
          </div>

          <div className="card-glass rounded-xl p-5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-[#7998B8] font-bold">
              <Smartphone className="w-4 h-4 text-[#7998B8]" />
              <span>Offline & Apple Wallet Readiness</span>
            </div>
            <p className="text-[#9AA6B5] leading-relaxed">
              This pass is rendered using deterministic SVG encryption and functions without an active cellular signal. You can take a screenshot or print a physical PDF badge at any time.
            </p>
            <div className="pt-2 text-[11px] text-[#DFC394]">
              Technology powered by UCreates ULink Live Event Identity Architecture.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
