'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectionsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/people');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080D16] text-[#91A0B4] text-xs">
      Loading Connections...
    </div>
  );
}
