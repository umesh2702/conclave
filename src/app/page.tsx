'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Storage } from '../services/storage';
import { 
  ArrowRight, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Users, 
  QrCode, 
  CheckCircle2, 
  DollarSign, 
  Layers,
  ChevronRight,
  KeyRound
} from 'lucide-react';

export default function HomePage() {
  const event = Storage.getEvent();
  const speakers = Storage.getSpeakers().slice(0, 4);
  const attendees = Storage.getAttendees();
  const sessions = Storage.getSessions().slice(0, 4);

  const foundersCount = attendees.filter((a) => a.category === 'Founder').length;
  const investorsCount = attendees.filter((a) => a.category === 'Investor').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/[0.06]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#C7A875]/10 via-[#7998B8]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
              <Sparkles className="w-3.5 h-3.5 text-[#C7A875]" />
              <span>Startup Synerz Presents • Official MVP 1.0</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F5F3EF] leading-[1.15]">
              Where High-Conviction Founders Converge with{' '}
              <span className="gold-gradient-text italic font-serif font-normal">
                Institutional Capital
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9AA6B5] leading-relaxed max-w-2xl mx-auto">
              Capital Connect Conclave is the premier institutional summit uniting pre-vetted founders, leading venture capital funds, sovereign allocators, and angel syndicates for precision 1:1 capital deployment.
            </p>

            {/* Metadata Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#9AA6B5]">
              <div className="flex items-center gap-1.5 bg-[#111B2A] px-3 py-1.5 rounded-lg border border-white/5">
                <Calendar className="w-4 h-4 text-[#C7A875]" />
                <span className="text-[#F5F3EF]">{event.dates}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111B2A] px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin className="w-4 h-4 text-[#C7A875]" />
                <span className="text-[#F5F3EF]">{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111B2A] px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[#F5F3EF]">By Startup Synerz & UCreates</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/access"
                className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold champagne-btn shadow-lg flex items-center justify-center gap-2 group"
              >
                <KeyRound className="w-4 h-4 text-[#080E18]" />
                <span>Access Your Event</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/app/agenda"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-[#172335] hover:bg-[#1f2f47] text-[#F5F3EF] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#DFC394]" />
                <span>Explore the Conclave</span>
              </Link>

              <Link
                href="/app/pass"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold bg-[#111B2A] hover:bg-[#172335] text-[#DFC394] border border-[#C7A875]/30 transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Digital Pass</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Conclave Key Metrics */}
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-glass rounded-xl p-4 text-center border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC394]">
                {event.stats.capitalPool}
              </div>
              <div className="text-xs text-[#9AA6B5] mt-1">Institutional Capital Pool</div>
            </div>

            <div className="card-glass rounded-xl p-4 text-center border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F3EF]">
                {investorsCount}+
              </div>
              <div className="text-xs text-[#9AA6B5] mt-1">VCs & Syndicate Leads</div>
            </div>

            <div className="card-glass rounded-xl p-4 text-center border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7998B8]">
                {foundersCount}+
              </div>
              <div className="text-xs text-[#9AA6B5] mt-1">Selected Growth Founders</div>
            </div>

            <div className="card-glass rounded-xl p-4 text-center border border-white/5">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                100%
              </div>
              <div className="text-xs text-[#9AA6B5] mt-1">Pre-Vetted Deal Rooms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclave Pillars / Value Props */}
      <section className="py-20 bg-[#0D1522]/50 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#DFC394] tracking-widest uppercase mb-2">
              Transformative Event Technology
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF]">
              Architected for High-Impact Deal Velocity
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA6B5] mt-2">
              A unified digital ecosystem engineered by UCreates on the ULink Live framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glass rounded-2xl p-6 border border-white/5 hover:border-[#C7A875]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#C7A875]/15 border border-[#C7A875]/30 flex items-center justify-center text-[#DFC394] mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F5F3EF] mb-2">
                Curated 1:1 Deal Rooms
              </h4>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                Founders and institutional funds schedule reserved 20-minute private deal sessions in designated conclave pods, eliminating informal networking friction.
              </p>
            </div>

            <div className="card-glass rounded-2xl p-6 border border-white/5 hover:border-[#7998B8]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#7998B8]/15 border border-[#7998B8]/30 flex items-center justify-center text-[#7998B8] mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F5F3EF] mb-2">
                Precision Discovery Directory
              </h4>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                Filter participants by investment stage, sector thesis, check sizes, and traction metrics. Send instant connection requests with relationship state tracking.
              </p>
            </div>

            <div className="card-glass rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F5F3EF] mb-2">
                Secure Digital QR Credentials
              </h4>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                Every delegate receives an Apple Wallet-style identity pass encoded with non-sensitive token hashes, verified at registration desks with duplicate entry prevention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Speakers Section */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold text-[#DFC394] tracking-widest uppercase mb-2">
                Thought Leadership
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF]">
                Featured Speakers & Syndicate Leads
              </h3>
            </div>
            <Link
              href="/app/agenda"
              className="text-xs font-semibold text-[#DFC394] hover:underline flex items-center gap-1 mt-3 md:mt-0"
            >
              <span>Explore Complete 2-Day Agenda</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.map((sp) => (
              <div
                key={sp.id}
                className="card-glass rounded-xl p-5 border border-white/5 flex flex-col items-center text-center group hover:border-[#C7A875]/30 transition-all"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C7A875]/30 mb-4 group-hover:scale-105 transition-transform shadow-lg">
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-bold text-[#F5F3EF]">{sp.name}</h4>
                <div className="text-xs text-[#DFC394] mt-0.5">{sp.designation}</div>
                <div className="text-xs text-[#9AA6B5] mt-0.5 font-medium">
                  {sp.organization}
                </div>
                <p className="text-[11px] text-[#9AA6B5]/80 mt-3 line-clamp-3 leading-relaxed">
                  {sp.biography}
                </p>
                {sp.topic && (
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#7998B8] font-medium italic">
                    {sp.topic}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Preview Section */}
      <section className="py-20 bg-[#0D1522]/30 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-xs font-bold text-[#DFC394] tracking-widest uppercase mb-2">
              Programme Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF]">
              Curated Sessions & Deal Tracks
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA6B5] mt-2">
              Two days structured for actionable intelligence, pitch tracks, and high-conviction allocations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {sessions.map((ses) => (
              <div
                key={ses.id}
                className="card-glass rounded-xl p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#DFC394] bg-[#172335] px-2.5 py-0.5 rounded border border-white/5">
                      {ses.startTime} – {ses.endTime}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/5 text-[#9AA6B5]">
                      {ses.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F3EF]">{ses.title}</h4>
                  <div className="text-xs text-[#9AA6B5] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C7A875]" />
                    <span>{ses.location}</span>
                  </div>
                </div>

                <Link
                  href="/app/agenda"
                  className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#172335] hover:bg-[#1f2f47] text-xs font-medium text-[#F5F3EF] border border-white/10 shrink-0"
                >
                  View in Agenda
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/app/agenda"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFC394] hover:underline"
            >
              <span>View full 8-session program with speaker line-up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Call To Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DFC394] to-[#7998B8] p-[1px] mx-auto">
            <div className="w-full h-full bg-[#080E18] rounded-[15px] flex items-center justify-center font-serif text-xl font-bold text-[#DFC394]">
              C
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3EF] tracking-tight">
            Connect with the Capital Syndicate
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA6B5] max-w-xl mx-auto leading-relaxed">
            Confirmed delegate credentials issued by Startup Synerz. Experience precision deal discovery enabled by UCreates on the ULink Live framework.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/access"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold champagne-btn shadow-xl flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#080E18]" />
              <span>Access Your Event</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/app/agenda"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#172335] text-[#F5F3EF] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#DFC394]" />
              <span>Explore the Conclave</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
