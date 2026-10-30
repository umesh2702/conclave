'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/common/Navbar';
import { Footer } from '../../../../components/common/Footer';
import { useAuth } from '../../../../context/AuthContext';
import { Storage } from '../../../../services/storage';
import { AttendeeService } from '../../../../services/attendeeService';
import { ConnectionService } from '../../../../services/connectionService';
import { MeetingRequestModal } from '../../../../components/meetings/MeetingRequestModal';
import { 
  Building2, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Calendar, 
  UserPlus, 
  Check, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  Lock,
  Sparkles
} from 'lucide-react';

export default function AttendeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser, refresh } = useAuth();
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const attendee = AttendeeService.getAttendeeById(resolvedParams.id);

  if (!attendee) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080E18]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#F5F3EF]">Attendee Not Found</h2>
          <p className="text-xs text-[#9AA6B5]">The requested attendee credential could not be located in the conclave database.</p>
          <Link href="/app/people" className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn">
            Return to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isSelf = currentUser?.id === attendee.id;
  const existingConn = currentUser
    ? ConnectionService.getConnectionBetween(currentUser.id, attendee.id)
    : undefined;

  const handleConnect = () => {
    if (!currentUser || isSelf) return;
    try {
      setConnecting(true);
      ConnectionService.sendConnectionRequest(
        currentUser.id,
        attendee.id,
        `Hi ${attendee.fullName.split(' ')[0]}, let's connect at Capital Connect Conclave 2026.`
      );
      refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to send connection request');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-[#9AA6B5] hover:text-[#F5F3EF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>

          <span className="font-mono text-xs text-[#DFC394] bg-[#172335] px-2.5 py-1 rounded border border-white/5">
            {attendee.id}
          </span>
        </div>

        {/* Profile Hero Header Card */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#172335] border-2 border-[#C7A875]/40 shrink-0 shadow-xl">
              {attendee.avatarUrl ? (
                <img
                  src={attendee.avatarUrl}
                  alt={attendee.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-[#DFC394]">
                  {attendee.fullName[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C7A875]/15 text-[#DFC394] border border-[#C7A875]/30">
                  {attendee.category}
                </span>
                <span className="text-xs text-[#9AA6B5]">•</span>
                <span className="text-xs text-[#9AA6B5]">{attendee.industry}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3EF]">
                {attendee.fullName}
              </h1>

              <div className="text-sm font-semibold text-[#DFC394]">
                {attendee.designation}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#9AA6B5] pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#7998B8]" />
                  <span>{attendee.organization}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C7A875]" />
                  <span>{attendee.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {attendee.website && (
                <a
                  href={attendee.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#9AA6B5] hover:text-[#DFC394] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}
              {attendee.linkedin && (
                <a
                  href={attendee.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#9AA6B5] hover:text-[#DFC394] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSelf ? (
                <Link
                  href="/app/pass"
                  className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn"
                >
                  View Your Pass
                </Link>
              ) : (
                <>
                  {existingConn?.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      Connected
                    </span>
                  ) : existingConn?.status === 'pending' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      Request Pending
                    </span>
                  ) : (
                    <button
                      onClick={handleConnect}
                      disabled={connecting}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#172335] hover:bg-[#1f2f47] border border-white/10 hover:border-[#C7A875]/40 text-[#F5F3EF] transition-all flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#C7A875]" />
                      <span>{connecting ? 'Sending...' : 'Connect'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setMeetingModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn shadow-md flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request 1:1 Deal Room</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Founder Deep Dive Section */}
        {attendee.founderProfile && (
          <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A6C5E8] uppercase tracking-wider pb-2 border-b border-white/10">
              <TrendingUp className="w-4 h-4 text-[#7998B8]" />
              <span>Startup & Pitch Dossier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Stage</span>
                <div className="text-sm font-bold text-[#F5F3EF]">
                  {attendee.founderProfile.stage}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Target Requirement</span>
                <div className="text-sm font-bold text-[#DFC394]">
                  {attendee.founderProfile.fundingRequirement}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Sector</span>
                <div className="text-sm font-bold text-[#F5F3EF]">
                  {attendee.founderProfile.industry}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                Venture Elevator Proposition
              </h4>
              <p className="text-xs text-[#9AA6B5] leading-relaxed">
                {attendee.founderProfile.shortDescription}
              </p>
            </div>

            {attendee.founderProfile.tractionMetrics && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                  Verified Traction & Pilot Metrics
                </h4>
                <div className="p-3.5 rounded-xl bg-[#172335]/70 border border-[#C7A875]/20 text-xs text-[#F5F3EF] leading-relaxed">
                  {attendee.founderProfile.tractionMetrics}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Investor Deep Dive Section */}
        {attendee.investorProfile && (
          <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DFC394] uppercase tracking-wider pb-2 border-b border-white/10">
              <DollarSign className="w-4 h-4 text-[#C7A875]" />
              <span>Investment Criteria & Fund Mandate</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Category</span>
                <div className="text-sm font-bold text-[#F5F3EF]">
                  {attendee.investorProfile.investmentCategory}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Check Size</span>
                <div className="text-sm font-bold text-[#DFC394]">
                  {attendee.investorProfile.ticketSize}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111B2A] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9AA6B5] uppercase font-mono">Geography</span>
                <div className="text-sm font-bold text-[#F5F3EF]">
                  {attendee.investorProfile.geography}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                Target Sectors & Stages
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {attendee.investorProfile.preferredSectors.map((sec) => (
                  <span
                    key={sec}
                    className="px-2.5 py-1 rounded bg-[#172335] border border-white/10 text-xs text-[#F5F3EF]"
                  >
                    {sec}
                  </span>
                ))}
                {attendee.investorProfile.preferredStages.map((stg) => (
                  <span
                    key={stg}
                    className="px-2.5 py-1 rounded bg-[#C7A875]/15 border border-[#C7A875]/30 text-xs text-[#DFC394]"
                  >
                    {stg} Stage
                  </span>
                ))}
              </div>
            </div>

            {attendee.investorProfile.thesisSummary && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#DFC394] uppercase tracking-wider">
                  Investment Thesis
                </h4>
                <div className="p-3.5 rounded-xl bg-[#172335]/70 border border-[#C7A875]/20 text-xs text-[#F5F3EF] leading-relaxed">
                  {attendee.investorProfile.thesisSummary}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bio Section */}
        <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-3">
          <h3 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
            Biography & Conclave Background
          </h3>
          <p className="text-xs text-[#9AA6B5] leading-relaxed">
            {attendee.bio}
          </p>
        </div>

        {/* Privacy & Confidentiality Notice */}
        <div className="p-4 rounded-xl bg-[#111B2A]/50 border border-white/5 flex items-start gap-3 text-xs text-[#9AA6B5]">
          <Lock className="w-4 h-4 text-[#7998B8] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#F5F3EF] block">
              Institutional Privacy Protected
            </span>
            <span>
              Contact telephone numbers, direct cap table specifics, and personal emails are kept confidential. Direct messaging is enabled once mutual connection requests are accepted.
            </span>
          </div>
        </div>
      </main>

      {/* Meeting Request Modal */}
      {meetingModalOpen && (
        <MeetingRequestModal
          recipient={attendee}
          isOpen={meetingModalOpen}
          onClose={() => setMeetingModalOpen(false)}
          onSuccess={refresh}
        />
      )}

      <Footer />
    </div>
  );
}
