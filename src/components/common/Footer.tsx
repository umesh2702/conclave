import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050A12] border-t border-white/[0.06] text-xs text-[#9AA6B5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Organizer */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#C7A875]/20 border border-[#C7A875]/40 flex items-center justify-center font-serif text-[#DFC394] font-bold">
                C
              </div>
              <span className="font-semibold text-sm text-[#F5F3EF] tracking-wide">
                CAPITAL CONNECT
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#9AA6B5]">
              The high-conviction capital summit connecting visionary founders with institutional funds, angel syndicates, and sovereign allocators.
            </p>
            <div className="pt-2 text-[10px] space-y-1">
              <div>
                <span className="text-[#C7A875] font-semibold">Organized by:</span> Startup Synerz
              </div>
              <div>
                <span className="text-[#7998B8] font-semibold">Technology Partner:</span> UCreates
              </div>
              <div>
                <span className="text-white/60">Platform:</span> ULink Live Event Ecosystem
              </div>
            </div>
          </div>

          {/* Column 2: Event Navigation */}
          <div>
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3">
              Conclave Navigation
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/" className="hover:text-[#DFC394] transition-colors">
                  Summit Overview
                </Link>
              </li>
              <li>
                <Link href="/access" className="hover:text-[#DFC394] transition-colors">
                  Delegate Access Portal
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-[#DFC394] transition-colors">
                  Attendee Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/people" className="hover:text-[#DFC394] transition-colors">
                  Investor & Startup Directory
                </Link>
              </li>
              <li>
                <Link href="/app/agenda" className="hover:text-[#DFC394] transition-colors">
                  Full 2-Day Agenda & Tracks
                </Link>
              </li>
              <li>
                <Link href="/app/pass" className="hover:text-[#DFC394] transition-colors">
                  Digital Entry Pass & QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Networking & Operations */}
          <div>
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3">
              Operations & Networking
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/app/connections" className="hover:text-[#DFC394] transition-colors">
                  Connection Requests & Roster
                </Link>
              </li>
              <li>
                <Link href="/app/meetings" className="hover:text-[#DFC394] transition-colors">
                  Deal Pod Meeting Scheduler
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Organizer Console & QR Scan</span>
                </Link>
              </li>
              <li>
                <Link href="/app/post-event" className="hover:text-[#DFC394] transition-colors">
                  Post-Event Hub & Continued Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Venue & Official Contact */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3">
              Venue & Secretariat
            </h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#C7A875] shrink-0 mt-0.5" />
              <span>Cyber Convention Centre & Grand Ballroom, HITEC City, Hyderabad, India</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#C7A875] shrink-0" />
              <span>secretariat@startupsynerz.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-[#C7A875] shrink-0" />
              <span>+91 (040) 4890-8800</span>
            </div>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-[#111B2A] border border-white/5 text-[10px] text-[#C7A875]">
                Conclave Dates: Nov 14 – 15, 2026
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 Startup Synerz. All rights reserved. Technology powered by{' '}
            <span className="text-[#DFC394] font-medium">UCreates ULink Live</span>.
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <span>Institutional Grade</span>
            <span>•</span>
            <span>Non-Sensitive Check-In Encryption</span>
            <span>•</span>
            <span>Curated Capital Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
