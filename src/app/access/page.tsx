'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { AttendeeService } from '../../services/attendeeService';
import { Storage } from '../../services/storage';
import { 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Briefcase, 
  Award, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Lock,
  Mail
} from 'lucide-react';

export default function AccessPage() {
  const router = useRouter();
  const { switchUser, demoAccounts } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleSelectPersona = (attendeeId: string, role: string) => {
    switchUser(attendeeId);
    if (role === 'organizer') {
      router.push('/admin');
    } else {
      router.push('/app');
    }
  };

  const handleVerifyCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setError(null);
    setVerifying(true);

    setTimeout(() => {
      const attendee = AttendeeService.getAttendeeByEmailOrToken(tokenInput.trim());

      if (attendee) {
        if (attendee.accessStatus === 'suspended' || attendee.accessStatus === 'revoked') {
          setError(`Access suspended: The delegate credential for ${attendee.fullName} has been deactivated by the Conclave Secretariat.`);
          setVerifying(false);
          return;
        }

        switchUser(attendee.id);
        if (attendee.role === 'organizer') {
          router.push('/admin');
        } else {
          router.push('/app');
        }
      } else {
        setError(
          `Security Notice: "${tokenInput.trim()}" does not match any confirmed attendee credential. Public self-registration is closed. Contact the Secretariat for invitation verification.`
        );
        setVerifying(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Delegate Access Portal • Conclave 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3EF] tracking-tight">
            Access Your Conclave Experience
          </h1>

          <p className="text-xs sm:text-sm text-[#9AA6B5] leading-relaxed">
            Startup Synerz independently curates all delegate registrations. Select your authorized demo persona below or verify your official pass token.
          </p>
        </div>

        {/* Demo Mode Persona Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold text-[#F5F3EF] uppercase tracking-wider">
                Select Your Delegate Persona (Demo Mode)
              </h2>
              <p className="text-xs text-[#9AA6B5]">
                Switch instantly between authorized delegate roles to experience the tailored platform perspective.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Demo Environment Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoAccounts.map((account) => {
              const isFounder = account.role === 'founder';
              const isInvestor = account.role === 'investor';
              const isOrganizer = account.role === 'organizer';
              const isMentor = account.role === 'mentor';

              const roleBorder = isInvestor
                ? 'hover:border-[#C7A875]/50 group-hover:border-[#C7A875]/40'
                : isFounder
                ? 'hover:border-[#7998B8]/50'
                : isOrganizer
                ? 'hover:border-amber-500/50'
                : 'hover:border-emerald-500/50';

              return (
                <div
                  key={account.id}
                  onClick={() => handleSelectPersona(account.id, account.role)}
                  className={`card-glass-interactive rounded-2xl p-5 border border-white/10 flex flex-col justify-between cursor-pointer group transition-all ${roleBorder}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          isInvestor
                            ? 'bg-[#C7A875]/15 text-[#DFC394] border-[#C7A875]/30'
                            : isFounder
                            ? 'bg-[#7998B8]/15 text-[#A6C5E8] border-[#7998B8]/30'
                            : isOrganizer
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {account.category}
                      </span>
                      <span className="font-mono text-[10px] text-[#9AA6B5]">
                        {account.id}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#172335] shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                        {account.avatarUrl ? (
                          <img
                            src={account.avatarUrl}
                            alt={account.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#DFC394]">
                            {account.fullName[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#F5F3EF] group-hover:text-[#DFC394] transition-colors truncate">
                          {account.fullName}
                        </h3>
                        <div className="text-xs text-[#DFC394] truncate">
                          {account.designation}
                        </div>
                        <div className="text-xs text-[#9AA6B5] truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span>{account.organization}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#9AA6B5] line-clamp-2 leading-relaxed">
                      {account.founderProfile?.shortDescription ||
                        account.investorProfile?.thesisSummary ||
                        account.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#DFC394] font-semibold mt-3">
                    <span>
                      {isOrganizer ? 'Enter Console' : `Enter as ${account.category}`}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credential Token or Email Verification */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-white/10 max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Lock className="w-4 h-4 text-[#DFC394]" />
            <h3 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
              Verify Official Pass Token or Registered Email
            </h3>
          </div>

          <p className="text-xs text-[#9AA6B5] leading-relaxed">
            Received your conclave access token from the Startup Synerz Secretariat? Enter your token or official email below.
          </p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyCredential} className="space-y-3">
            <div>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter token (e.g. TOKEN-CCC-94a8e8f2) or registered email"
                className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-4 py-3 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={verifying || !tokenInput.trim()}
              className="w-full py-3 rounded-xl font-bold champagne-btn shadow-md text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{verifying ? 'Validating Token...' : 'Verify Credential & Enter'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-[#9AA6B5]">
              Sample Token: <code className="text-[#DFC394] font-mono cursor-pointer hover:underline" onClick={() => setTokenInput('TOKEN-CCC-94a8e8f2')}>TOKEN-CCC-94a8e8f2</code> (Arjun Mehta)
            </span>
          </div>
        </div>

        {/* Secretariat Notice */}
        <div className="p-4 rounded-xl bg-[#111B2A]/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9AA6B5]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C7A875] shrink-0" />
            <span>Need invitation credentials or delegation assistance?</span>
          </div>
          <a
            href="mailto:secretariat@startupsynerz.com"
            className="text-[#DFC394] hover:underline font-semibold"
          >
            secretariat@startupsynerz.com
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
