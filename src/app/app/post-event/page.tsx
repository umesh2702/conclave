'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { useAuth } from '../../../context/AuthContext';
import { Storage } from '../../../services/storage';
import { ConnectionService } from '../../../services/connectionService';
import { 
  Sparkles, 
  Award, 
  Star, 
  CheckCircle2, 
  Download, 
  Network, 
  Building2, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function PostEventPage() {
  const { currentUser } = useAuth();
  const [ratingKeynotes, setRatingKeynotes] = useState(5);
  const [ratingNetworking, setRatingNetworking] = useState(5);
  const [ratingDealRooms, setRatingDealRooms] = useState(5);
  const [ratingApp, setRatingApp] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E18] text-[#9AA6B5]">
        Loading post-event portal...
      </div>
    );
  }

  const attendees = Storage.getAttendees();
  const connectionsData = ConnectionService.getConnectionsForAttendee(currentUser.id);
  const acceptedConnections = connectionsData.accepted;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleExportContacts = () => {
    const list = acceptedConnections.map((conn) => {
      const otherId = conn.requesterId === currentUser.id ? conn.recipientId : conn.requesterId;
      const other = attendees.find((a) => a.id === otherId);
      return other ? `${other.fullName},${other.organization},${other.designation},${other.email}` : '';
    }).filter(Boolean);

    const csvContent =
      'data:text/csv;charset=utf-8,Name,Organization,Designation,Email\n' + list.join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Capital_Connect_My_Connections_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
            <Award className="w-3.5 h-3.5 text-[#C7A875]" />
            <span>Post-Conclave Continuity Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
            Capital Connect Conclave 2026 Wrap-Up
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B5] max-w-lg mx-auto">
            Maintain relationship continuity with your conclave syndicate network, review executive takeaways, and submit your official event feedback.
          </p>
        </div>

        {/* Certificate of Participation Card */}
        <div className="card-glass-elevated rounded-2xl p-6 sm:p-8 border border-[#C7A875]/40 text-center space-y-4 max-w-2xl mx-auto relative overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C7A875]/20 flex items-center justify-center font-serif text-[#DFC394] font-bold">
              C
            </div>
            <span className="font-bold text-sm tracking-wider text-[#F5F3EF] uppercase">
              CAPITAL CONNECT CONCLAVE • OFFICIAL VERIFICATION
            </span>
          </div>

          <p className="text-xs text-[#9AA6B5]">This is to verify the institutional participation of</p>
          <div className="text-xl sm:text-2xl font-bold text-[#DFC394]">
            {currentUser.fullName}
          </div>
          <div className="text-xs text-[#F5F3EF]">
            {currentUser.designation} • {currentUser.organization}
          </div>

          <div className="pt-2 text-[11px] text-[#9AA6B5] max-w-md mx-auto leading-relaxed">
            In recognition of active delegate participation in high-conviction deal rooms and venture panels at Cyber Convention Centre, Hyderabad.
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-[#9AA6B5]">
            <span>Attendee ID: <strong className="font-mono text-[#F5F3EF]">{currentUser.id}</strong></span>
            <span>Organizer: <strong className="text-[#DFC394]">Startup Synerz</strong></span>
            <span>Platform: <strong className="text-[#7998B8]">ULink Live</strong></span>
          </div>
        </div>

        {/* Continued Networking Section */}
        <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Your Confirmed Conclave Syndicate ({acceptedConnections.length})
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                Continued access to delegate profiles and direct communications post-summit.
              </p>
            </div>

            {acceptedConnections.length > 0 && (
              <button
                onClick={handleExportContacts}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#172335] hover:bg-[#1f2f47] text-xs font-semibold text-[#DFC394] border border-[#C7A875]/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Connection Contacts</span>
              </button>
            )}
          </div>

          {acceptedConnections.length === 0 ? (
            <p className="text-xs text-[#9AA6B5] py-4 text-center">
              No confirmed connections yet.{' '}
              <Link href="/app/people" className="text-[#DFC394] hover:underline">
                Explore Directory
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedConnections.map((conn) => {
                const otherId = conn.requesterId === currentUser.id ? conn.recipientId : conn.requesterId;
                const other = attendees.find((a) => a.id === otherId);
                if (!other) return null;

                return (
                  <div
                    key={conn.id}
                    className="p-4 rounded-xl bg-[#111B2A] border border-white/5 space-y-2 text-xs"
                  >
                    <div className="font-bold text-[#F5F3EF]">{other.fullName}</div>
                    <div className="text-[11px] text-[#DFC394]">{other.designation}</div>
                    <div className="text-[11px] text-[#9AA6B5]">{other.organization} ({other.category})</div>
                    <div className="pt-2 text-[10px] text-white/40">
                      Email: {other.email}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Official Conclave Feedback Form */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-[#F5F3EF]">
              Official Conclave Delegate Feedback
            </h3>
            <p className="text-xs text-[#9AA6B5]">
              Help Startup Synerz and UCreates enhance subsequent institutional capital summits.
            </p>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-[#F5F3EF]">Feedback Submitted</h4>
              <p className="text-xs text-[#9AA6B5]">
                Thank you, {currentUser.fullName}. Your evaluation has been recorded by the Conclave Steering Committee.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">
                    Keynote & Panel Quality (1–5)
                  </label>
                  <select
                    value={ratingKeynotes}
                    onChange={(e) => setRatingKeynotes(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value={5}>5 — Outstanding</option>
                    <option value={4}>4 — Very Good</option>
                    <option value={3}>3 — Satisfactory</option>
                    <option value={2}>2 — Needs Refinement</option>
                    <option value={1}>1 — Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">
                    1:1 Deal Pod Effectiveness (1–5)
                  </label>
                  <select
                    value={ratingDealRooms}
                    onChange={(e) => setRatingDealRooms(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value={5}>5 — High Deal Velocity</option>
                    <option value={4}>4 — Good Conversations</option>
                    <option value={3}>3 — Moderate Value</option>
                    <option value={2}>2 — Limited Fits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">
                    Networking & Delegate Quality
                  </label>
                  <select
                    value={ratingNetworking}
                    onChange={(e) => setRatingNetworking(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value={5}>5 — Highly Curated</option>
                    <option value={4}>4 — Relevant Participants</option>
                    <option value={3}>3 — Average</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">
                    ULink Live App & Pass Experience
                  </label>
                  <select
                    value={ratingApp}
                    onChange={(e) => setRatingApp(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value={5}>5 — Exceptional / Seamless</option>
                    <option value={4}>4 — Intuitive</option>
                    <option value={3}>3 — Adequate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">
                  Qualitative Notes & Recommendations
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Suggestions for Deal Room scheduling, syndicate tracks, or venue facilities..."
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold champagne-btn shadow-md"
              >
                Submit Official Feedback
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
