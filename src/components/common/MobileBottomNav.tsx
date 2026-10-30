'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, MapPin, Users, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  // Exactly Five Primary Destinations
  const navItems = [
    { label: 'Live', href: '/app', icon: Radio },
    { label: 'Programme', href: '/app/agenda', icon: Calendar },
    { label: 'Venue', href: '/app/venue', icon: MapPin },
    { label: 'People', href: '/app/people', icon: Users },
    { label: 'Profile', href: '/app/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    if (href === '/app/profile') return pathname.startsWith('/app/profile') || pathname.startsWith('/app/pass');
    return pathname.startsWith(href);
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080D16]/95 backdrop-blur-xl border-t border-[#202C3D] px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative ${
                active ? 'text-[#D2B47C]' : 'text-[#91A0B4] hover:text-[#F5F3EF]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D2B47C] rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight text-center truncate w-full ${active ? 'font-semibold text-[#D2B47C]' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
