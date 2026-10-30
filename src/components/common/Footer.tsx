import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050A12] border-t border-[#202C3D] text-xs text-[#91A0B4] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-[calc(env(safe-area-inset-bottom,0px)+6rem)] md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & Organizer */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#152235] border border-[#D2B47C]/40 flex items-center justify-center font-serif text-[#D2B47C] font-bold text-xs">
                U
              </div>
              <span className="font-semibold text-sm text-[#F5F3EF] tracking-wide">
                ULINK LIVE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#91A0B4]">
              The digital experience layer of Capital Connect Conclave 2026. Synchronizing the physical event with real-time digital access.
            </p>
            <div className="pt-1 text-[10px] space-y-0.5 font-mono">
              <div>
                <span className="text-[#D2B47C] font-semibold">Organized by:</span> Startup Synerz
              </div>
              <div>
                <span className="text-[#91A0B4]">Platform:</span> UCreates ULink Live
              </div>
            </div>
          </div>

          {/* Column 2: Event Destinations */}
          <div>
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3 font-mono">
              Event Navigation
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/app" className="hover:text-[#D2B47C] transition-colors">
                  Live Event Hub
                </Link>
              </li>
              <li>
                <Link href="/app/agenda" className="hover:text-[#D2B47C] transition-colors">
                  Programme Schedule
                </Link>
              </li>
              <li>
                <Link href="/app/venue" className="hover:text-[#D2B47C] transition-colors">
                  Venue &amp; Floor Guide
                </Link>
              </li>
              <li>
                <Link href="/app/people" className="hover:text-[#D2B47C] transition-colors">
                  People &amp; Directory
                </Link>
              </li>
              <li>
                <Link href="/app/profile" className="hover:text-[#D2B47C] transition-colors">
                  My Profile &amp; Digital Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Secretariat & Operations */}
          <div>
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3 font-mono">
              Secretariat &amp; Access
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/access" className="hover:text-[#D2B47C] transition-colors">
                  Credential Verification Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Organizer Control Centre</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#D2B47C] transition-colors">
                  Public Conclave Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Venue & Official Contact */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs text-[#F5F3EF] tracking-wider uppercase mb-3 font-mono">
              Venue Location
            </h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#D2B47C] shrink-0 mt-0.5" />
              <span>Cyber Convention Centre &amp; Grand Ballroom, HITEC City, Hyderabad, India</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
              <span>secretariat@startupsynerz.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-[#D2B47C] shrink-0" />
              <span>+91 (040) 4890-8800</span>
            </div>
            <div className="pt-1">
              <span className="inline-block px-2.5 py-1 rounded bg-[#101927] border border-[#202C3D] text-[10px] text-[#D2B47C] font-mono">
                Conclave: Nov 14 – 15, 2026
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#202C3D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#91A0B4]">
          <div>
            © 2026 Startup Synerz. All rights reserved. Powered by{' '}
            <span className="text-[#D2B47C] font-semibold">UCreates ULink Live</span>.
          </div>
          <div className="flex items-center gap-4 text-white/50 text-[10px] font-mono">
            <span>Institutional Event Layer</span>
            <span>•</span>
            <span>Secure Fast-Track QR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
