'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, Users, MapPin, QrCode } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  // Primary mobile attendee navigation: Live, Programme, People, Venue, Pass (PRD Section 10)
  const navItems = [
    { label: 'Live', href: '/app', icon: Radio },
    { label: 'Programme', href: '/app/agenda', icon: Calendar },
    { label: 'People', href: '/app/people', icon: Users },
    { label: 'Venue', href: '/app/venue', icon: MapPin },
    { label: 'Pass', href: '/app/pass', icon: QrCode },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080E18]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-1 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 transition-colors relative ${
                active ? 'text-[#DFC394]' : 'text-[#9AA6B5] hover:text-[#F5F3EF]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#DFC394] rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${active ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
