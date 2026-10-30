'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Attendee, ParticipantCategory } from '../../types';
import { Storage } from '../../services/storage';
import { AttendeeService, CreateAttendeeInput } from '../../services/attendeeService';
import { 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  ExternalLink,
  ChevronRight,
  Plus,
  Edit2,
  Lock,
  Unlock,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Mail,
  Tag
} from 'lucide-react';

interface AttendeeTableProps {
  onUpdate?: () => void;
}

export function AttendeeTable({ onUpdate }: AttendeeTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [checkInFilter, setCheckInFilter] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');

  // Add Attendee Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newCategory, setNewCategory] = useState<ParticipantCategory>('Founder');
  const [newIndustry, setNewIndustry] = useState('AI & Deep Tech');
  const [newVisibility, setNewVisibility] = useState<'public' | 'syndicate_only' | 'hidden'>('public');
  const [newAccessStatus, setNewAccessStatus] = useState<'active' | 'suspended'>('active');
  const [newBio, setNewBio] = useState('');

  // Founder specific
  const [newStage, setNewStage] = useState<'Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Growth'>('Seed');
  const [newFundingReq, setNewFundingReq] = useState('$1.5M - $3M');
  const [newElevator, setNewElevator] = useState('');

  // Investor specific
  const [newInvestCat, setNewInvestCat] = useState<'Venture Capital' | 'Angel Syndicate' | 'Family Office' | 'Corporate VC' | 'Private Equity'>('Venture Capital');
  const [newTicket, setNewTicket] = useState('$1M - $3M');
  const [newSectors, setNewSectors] = useState('AI & Deep Tech, Enterprise SaaS');

  // Edit Attendee Modal State
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);

  const attendees = Storage.getAttendees();

  const filtered = attendees.filter((a) => {
    const matchesSearch =
      !search.trim() ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.organization.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.tokenHash && a.tokenHash.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesCheckIn =
      checkInFilter === 'All' ||
      (checkInFilter === 'CheckedIn' && a.checkInStatus) ||
      (checkInFilter === 'Pending' && !a.checkInStatus);

    const matchesAccess =
      accessFilter === 'All' ||
      (accessFilter === 'Active' && (a.accessStatus === 'active' || !a.accessStatus)) ||
      (accessFilter === 'Suspended' && a.accessStatus === 'suspended');

    return matchesSearch && matchesCat && matchesCheckIn && matchesAccess;
  });

  const handleToggleCheckIn = (attendee: Attendee) => {
    AttendeeService.updateAttendee(attendee.id, {
      checkInStatus: !attendee.checkInStatus,
      checkedInAt: !attendee.checkInStatus ? new Date().toISOString() : undefined,
    });
    if (onUpdate) onUpdate();
  };

  const handleToggleAccess = (attendee: Attendee) => {
    AttendeeService.toggleAccessStatus(attendee.id);
    if (onUpdate) onUpdate();
  };

  const handleRegenerateToken = (attendee: Attendee) => {
    if (confirm(`Regenerate digital pass token for ${attendee.fullName}? Previous passes will be immediately invalidated.`)) {
      AttendeeService.regenerateToken(attendee.id);
      if (onUpdate) onUpdate();
    }
  };

  const handleCreateAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim() || !newOrg.trim()) return;

    const input: CreateAttendeeInput = {
      fullName: newFullName,
      email: newEmail,
      phone: newPhone,
      organization: newOrg,
      designation: newDesignation,
      category: newCategory,
      industry: newIndustry,
      bio: newBio,
      visibilitySettings: newVisibility,
      accessStatus: newAccessStatus,
      founderProfile:
        newCategory === 'Founder'
          ? {
              startupName: newOrg,
              stage: newStage,
              fundingRequirement: newFundingReq,
              shortDescription: newElevator || `Scaling ${newOrg}`,
              industry: newIndustry,
            }
          : undefined,
      investorProfile:
        newCategory === 'Investor'
          ? {
              investmentCategory: newInvestCat,
              ticketSize: newTicket,
              preferredSectors: newSectors.split(',').map((s) => s.trim()),
              preferredStages: ['Seed', 'Series A'],
              geography: 'India & APAC',
            }
          : undefined,
    };

    AttendeeService.addOrganizerAttendee(input);

    // Reset Form
    setNewFullName('');
    setNewEmail('');
    setNewOrg('');
    setNewDesignation('');
    setNewBio('');
    setNewElevator('');
    setAddModalOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendee) return;

    AttendeeService.updateAttendee(editingAttendee.id, editingAttendee);
    setEditingAttendee(null);
    if (onUpdate) onUpdate();
  };

  const handleExportCSV = () => {
    const headers = [
      'Attendee ID',
      'Name',
      'Email',
      'Organization',
      'Designation',
      'Category',
      'Industry',
      'Access Status',
      'Visibility',
      'Check-In Status',
      'Checked-In Timestamp',
      'Token Hash',
      'Invite Token',
    ];

    const rows = attendees.map((a) => [
      a.id,
      `"${a.fullName}"`,
      a.email,
      `"${a.organization}"`,
      `"${a.designation}"`,
      a.category,
      `"${a.industry}"`,
      a.accessStatus || 'active',
      a.visibilitySettings || 'public',
      a.checkInStatus ? 'Checked In' : 'Pending',
      a.checkedInAt || 'N/A',
      a.tokenHash,
      a.invitationToken || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Capital_Connect_Attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories: ParticipantCategory[] = [
    'Founder',
    'Investor',
    'Mentor',
    'Financial Institution',
    'Ecosystem Partner',
    'General Attendee',
  ];

  return (
    <div className="card-glass rounded-2xl border border-white/10 overflow-hidden space-y-4 p-5">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full lg:w-auto relative">
          <Search className="w-4 h-4 text-[#9AA6B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendees by name, organization, pass ID, token..."
            className="w-full bg-[#111B2A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111B2A] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
            className="bg-[#111B2A] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
          >
            <option value="All">All Check-Ins</option>
            <option value="CheckedIn">Checked In</option>
            <option value="Pending">Pending Check-In</option>
          </select>

          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="bg-[#111B2A] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#C7A875]"
          >
            <option value="All">All Access</option>
            <option value="Active">Active Access</option>
            <option value="Suspended">Suspended</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C7A875] hover:bg-[#DFC394] text-xs font-bold text-[#080E18] flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Attendee</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#172335] hover:bg-[#1f2f47] text-xs font-semibold text-[#DFC394] border border-[#C7A875]/30 flex items-center gap-1.5 shrink-0"
            title="Download CSV database dump"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#172335]/70 text-[#9AA6B5] border-b border-white/10">
              <th className="py-3 px-4 font-semibold">Delegate</th>
              <th className="py-3 px-4 font-semibold">Category & Org</th>
              <th className="py-3 px-4 font-semibold">Pass ID & Token</th>
              <th className="py-3 px-4 font-semibold text-center">Access Status</th>
              <th className="py-3 px-4 font-semibold text-center">Venue Check-In</th>
              <th className="py-3 px-4 font-semibold text-right">Admin Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#9AA6B5]">
                  No attendees matching filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((att) => {
                const isSuspended = att.accessStatus === 'suspended';

                return (
                  <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Delegate Name & Email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#172335] shrink-0 border border-white/10">
                          {att.avatarUrl ? (
                            <img
                              src={att.avatarUrl}
                              alt={att.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#DFC394]">
                              {att.fullName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#F5F3EF] flex items-center gap-1.5">
                            <span>{att.fullName}</span>
                            {att.visibilitySettings === 'hidden' && (
                              <span title="Hidden from Directory">
                                <EyeOff className="w-3 h-3 text-[#9AA6B5]" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#9AA6B5]">{att.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Org */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/5 border border-white/10">
                          {att.category}
                        </span>
                      </div>
                      <div className="text-[#F5F3EF] font-medium text-[11px] mt-0.5">{att.organization}</div>
                      <div className="text-[10px] text-[#9AA6B5]">{att.designation}</div>
                    </td>

                    {/* Pass ID & Token */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#DFC394]">
                      <div>{att.id}</div>
                      <div className="text-[9px] text-[#9AA6B5] truncate max-w-[140px]">{att.tokenHash}</div>
                    </td>

                    {/* Access Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAccess(att)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          isSuspended
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                        title="Click to toggle access permission"
                      >
                        {isSuspended ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Suspended</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Venue Check-In */}
                    <td className="py-3 px-4 text-center">
                      {att.checkInStatus ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <UserCheck className="w-3 h-3" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <UserX className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingAttendee(att)}
                          className="p-1.5 rounded bg-[#172335] hover:bg-[#1f2f47] text-[#DFC394] border border-white/5 transition-colors"
                          title="Edit Delegate Information"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleRegenerateToken(att)}
                          className="p-1.5 rounded bg-[#172335] hover:bg-[#1f2f47] text-[#7998B8] border border-white/5 transition-colors"
                          title="Regenerate QR Token & Pass"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleToggleCheckIn(att)}
                          className="px-2 py-1 rounded bg-[#172335] hover:bg-[#1f2f47] text-[10px] font-medium text-[#F5F3EF] border border-white/10"
                          title={att.checkInStatus ? 'Revoke check-in' : 'Mark as checked in'}
                        >
                          {att.checkInStatus ? 'Undo' : 'Check-In'}
                        </button>

                        <Link
                          href={`/app/people/${att.id}`}
                          className="p-1.5 rounded text-[#9AA6B5] hover:text-[#DFC394]"
                          title="View Profile"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-[#9AA6B5] pt-2">
        <span>Showing {filtered.length} of {attendees.length} total enrolled delegates</span>
        <span>Startup Synerz Organizer Console</span>
      </div>

      {/* Add Attendee Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Enroll New Delegate (Organizer Managed)
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                Issue official credential and unique check-in QR pass for this participant.
              </p>
            </div>

            <form onSubmit={handleCreateAttendee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. Apex Ventures"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder="e.g. Managing Director"
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Industry Sector</label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] focus:border-[#C7A875] focus:outline-none"
                  >
                    <option value="AI & Deep Tech">AI & Deep Tech</option>
                    <option value="Enterprise SaaS">Enterprise SaaS</option>
                    <option value="Fintech & Payments">Fintech & Payments</option>
                    <option value="Clean Energy & Climate">Clean Energy & Climate</option>
                    <option value="Healthtech & Biotech">Healthtech & Biotech</option>
                    <option value="Venture Capital">Venture Capital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Profile Visibility</label>
                  <select
                    value={newVisibility}
                    onChange={(e) => setNewVisibility(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value="public">Public in Directory</option>
                    <option value="syndicate_only">Syndicate Only</option>
                    <option value="hidden">Hidden from Directory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA6B5] mb-1">Access Status</label>
                  <select
                    value={newAccessStatus}
                    onChange={(e) => setNewAccessStatus(e.target.value as any)}
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value="active">Active Access</option>
                    <option value="suspended">Suspended Access</option>
                  </select>
                </div>
              </div>

              {/* Founder Extras */}
              {newCategory === 'Founder' && (
                <div className="p-3 rounded-xl bg-[#111B2A] border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#A6C5E8]">Founder Specifics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#9AA6B5] block">Stage</label>
                      <select
                        value={newStage}
                        onChange={(e) => setNewStage(e.target.value as any)}
                        className="w-full bg-[#172335] rounded px-2 py-1 text-xs text-[#F5F3EF]"
                      >
                        <option value="Pre-seed">Pre-seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Series B+">Series B+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9AA6B5] block">Target Funding</label>
                      <input
                        type="text"
                        value={newFundingReq}
                        onChange={(e) => setNewFundingReq(e.target.value)}
                        className="w-full bg-[#172335] rounded px-2 py-1 text-xs text-[#F5F3EF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Investor Extras */}
              {newCategory === 'Investor' && (
                <div className="p-3 rounded-xl bg-[#111B2A] border border-white/5 space-y-2">
                  <div className="text-[11px] font-bold text-[#DFC394]">Investor Specifics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#9AA6B5] block">Fund Category</label>
                      <select
                        value={newInvestCat}
                        onChange={(e) => setNewInvestCat(e.target.value as 'Venture Capital' | 'Angel Syndicate' | 'Family Office' | 'Corporate VC' | 'Private Equity')}
                        className="w-full bg-[#172335] rounded px-2 py-1 text-xs text-[#F5F3EF]"
                      >
                        <option value="Venture Capital">Venture Capital</option>
                        <option value="Angel Syndicate">Angel Syndicate</option>
                        <option value="Family Office">Family Office</option>
                        <option value="Corporate VC">Corporate VC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9AA6B5] block">Ticket Size</label>
                      <input
                        type="text"
                        value={newTicket}
                        onChange={(e) => setNewTicket(e.target.value)}
                        className="w-full bg-[#172335] rounded px-2 py-1 text-xs text-[#F5F3EF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#9AA6B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold champagne-btn"
                >
                  Generate Pass & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Attendee Modal */}
      {editingAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingAttendee(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Edit Delegate Details — {editingAttendee.id}
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                Modify organization, designation, category, or visibility permissions.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingAttendee.fullName}
                    onChange={(e) =>
                      setEditingAttendee({ ...editingAttendee, fullName: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingAttendee.email}
                    onChange={(e) =>
                      setEditingAttendee({ ...editingAttendee, email: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={editingAttendee.organization}
                    onChange={(e) =>
                      setEditingAttendee({ ...editingAttendee, organization: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingAttendee.designation}
                    onChange={(e) =>
                      setEditingAttendee({ ...editingAttendee, designation: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Category</label>
                  <select
                    value={editingAttendee.category}
                    onChange={(e) =>
                      setEditingAttendee({
                        ...editingAttendee,
                        category: e.target.value as ParticipantCategory,
                      })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#9AA6B5] mb-1">Visibility</label>
                  <select
                    value={editingAttendee.visibilitySettings || 'public'}
                    onChange={(e) =>
                      setEditingAttendee({
                        ...editingAttendee,
                        visibilitySettings: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                  >
                    <option value="public">Public in Directory</option>
                    <option value="syndicate_only">Syndicate Only</option>
                    <option value="hidden">Hidden from Directory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9AA6B5] mb-1">Bio / Dossier Summary</label>
                <textarea
                  rows={3}
                  value={editingAttendee.bio}
                  onChange={(e) =>
                    setEditingAttendee({ ...editingAttendee, bio: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAttendee(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#9AA6B5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold champagne-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
