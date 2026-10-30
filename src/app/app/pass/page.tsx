'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DigitalPassRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/profile');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080D16] text-[#91A0B4] text-xs">
      Loading Digital Pass &amp; Credential...
    </div>
  );
}
