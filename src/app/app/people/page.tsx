'use client';

import React, { useState } from 'react';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { useAuth } from '../../../context/AuthContext';
import { Storage } from '../../../services/storage';
import { AttendeeService } from '../../../services/attendeeService';
import { ConnectionService } from '../../../services/connectionService';
import { AttendeeCard } from '../../../components/directory/AttendeeCard';
import { MeetingRequestModal } from '../../../components/meetings/MeetingRequestModal';
import { Attendee, ParticipantCategory } from '../../../types';
import { 
  Search, 
  Filter, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function PeopleDirectoryPage() {
  const { currentUser, refresh } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [meetingTarget, setMeetingTarget] = useState<Attendee | null>(null);

  const attendees = AttendeeService.getAttendees({
    category: selectedCategory,
    industry: selectedIndustry,
    stage: selectedStage,
    searchQuery: search,
  });

  const categories: string[] = [
    'All',
    'Founder',
    'Investor',
    'Mentor',
    'Financial Institution',
    'Ecosystem Partner',
  ];

  const industries: string[] = [
    'All',
    'AI & Deep Tech',
    'Enterprise SaaS',
    'Fintech & Payments',
    'Clean Energy & Climate',
    'Healthtech & Biotech',
    'Robotics & Hardware',
  ];

  const stages: string[] = [
    'All',
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B+',
  ];

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedIndustry('All');
    setSelectedStage('All');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedIndustry !== 'All' ||
    selectedStage !== 'All';

  return (
    <div className="min-h-screen flex flex-col bg-[#080E18]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Page Title & Context */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111B2A] border border-[#C7A875]/30 text-xs font-semibold text-[#DFC394]">
            <Users className="w-3.5 h-3.5" />
            <span>Curated Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F3EF]">
            Investor & Founder Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6B5] max-w-2xl">
            Discover fellow conclave delegates, review investment criteria and startup traction, and schedule high-conviction 1:1 Deal Room meetings.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="card-glass rounded-2xl p-5 border border-white/10 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9AA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organization, thesis, sector, or keyword..."
              className="w-full rounded-xl bg-[#111B2A] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <span className="text-xs text-[#9AA6B5] font-semibold mr-1 shrink-0">Role:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#C7A875] text-[#080E18] shadow-sm'
                      : 'bg-[#172335] text-[#9AA6B5] hover:text-[#F5F3EF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stage & Industry Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-[#111B2A] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
              >
                <option value="All">All Sectors</option>
                {industries.filter((i) => i !== 'All').map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-[#111B2A] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
              >
                <option value="All">All Stages</option>
                {stages.filter((s) => s !== 'All').map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#9AA6B5] hover:text-[#F5F3EF] flex items-center gap-1 shrink-0"
                  title="Clear all filters"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#9AA6B5]">
          <span>
            Showing <strong className="text-[#F5F3EF]">{attendees.length}</strong> participants
          </span>
          <span className="text-[11px] text-white/50">
            Real-time conclave directory
          </span>
        </div>

        {/* Directory Cards Grid */}
        {attendees.length === 0 ? (
          <div className="card-glass rounded-2xl p-12 text-center border border-white/10 space-y-3">
            <Users className="w-10 h-10 text-[#9AA6B5] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#F5F3EF]">
              No participants match the selected filters
            </h3>
            <p className="text-xs text-[#9AA6B5] max-w-sm mx-auto">
              Try broadening your sector or stage criteria, or clear the search term.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold champagne-btn mt-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendees.map((attendee) => {
              const existingConn = currentUser
                ? ConnectionService.getConnectionBetween(currentUser.id, attendee.id)
                : undefined;

              return (
                <AttendeeCard
                  key={attendee.id}
                  attendee={attendee}
                  existingConnection={existingConn}
                  onConnectionChange={refresh}
                  onScheduleMeeting={(target) => setMeetingTarget(target)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Meeting Request Modal */}
      {meetingTarget && (
        <MeetingRequestModal
          recipient={meetingTarget}
          isOpen={!!meetingTarget}
          onClose={() => setMeetingTarget(null)}
          onSuccess={refresh}
        />
      )}

      <Footer />
    </div>
  );
}
