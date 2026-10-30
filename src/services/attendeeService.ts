import {
  Attendee,
  AttendeeFilter,
  ParticipantCategory,
  UserRole,
  FounderProfile,
  InvestorProfile,
} from '../types';
import { Storage } from './storage';

export interface CreateAttendeeInput {
  fullName: string;
  email: string;
  phone?: string;
  organization: string;
  designation: string;
  category: ParticipantCategory;
  industry: string;
  website?: string;
  linkedin?: string;
  bio?: string;
  visibilitySettings?: 'public' | 'syndicate_only' | 'hidden';
  accessStatus?: 'active' | 'suspended' | 'revoked';
  founderProfile?: Partial<FounderProfile>;
  investorProfile?: Partial<InvestorProfile>;
}

export function categoryToRole(category: ParticipantCategory): UserRole {
  switch (category) {
    case 'Founder':
      return 'founder';
    case 'Investor':
      return 'investor';
    case 'Mentor':
      return 'mentor';
    case 'Financial Institution':
    case 'Ecosystem Partner':
      return 'partner';
    case 'General Attendee':
    default:
      return 'attendee';
  }
}

export const AttendeeService = {
  getAttendees(filters?: AttendeeFilter): Attendee[] {
    let attendees = Storage.getAttendees();

    if (!filters) return attendees;

    if (filters.category && filters.category !== 'All') {
      attendees = attendees.filter((a) => a.category === filters.category);
    }

    if (filters.industry && filters.industry !== 'All') {
      attendees = attendees.filter((a) =>
        a.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters.stage && filters.stage !== 'All') {
      attendees = attendees.filter(
        (a) =>
          a.founderProfile?.stage === filters.stage ||
          a.investorProfile?.preferredStages.includes(filters.stage as any)
      );
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      attendees = attendees.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.designation.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q) ||
          a.bio.toLowerCase().includes(q) ||
          a.founderProfile?.startupName?.toLowerCase().includes(q) ||
          a.founderProfile?.shortDescription?.toLowerCase().includes(q)
      );
    }

    return attendees;
  },

  getAttendeeById(id: string): Attendee | undefined {
    const attendees = Storage.getAttendees();
    return attendees.find((a) => a.id === id);
  },

  getAttendeeByToken(token: string): Attendee | undefined {
    const attendees = Storage.getAttendees();
    const cleanToken = token.trim().toLowerCase();
    return attendees.find(
      (a) =>
        a.tokenHash.toLowerCase() === cleanToken ||
        a.id.toLowerCase() === cleanToken ||
        (a.invitationToken && a.invitationToken.toLowerCase() === cleanToken)
    );
  },

  getAttendeeByEmailOrToken(query: string): Attendee | undefined {
    const attendees = Storage.getAttendees();
    const clean = query.trim().toLowerCase();
    return attendees.find(
      (a) =>
        a.email.toLowerCase() === clean ||
        a.tokenHash.toLowerCase() === clean ||
        a.id.toLowerCase() === clean ||
        (a.invitationToken && a.invitationToken.toLowerCase() === clean)
    );
  },

  /**
   * Organizer Attendee Creation (Organizer-controlled delegate enrollment)
   */
  addOrganizerAttendee(input: CreateAttendeeInput): Attendee {
    const attendees = Storage.getAttendees();
    const role = categoryToRole(input.category);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tokenHex = Math.random().toString(16).substring(2, 10);
    const inviteHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const rolePrefix =
      role === 'founder' ? 'F' : role === 'investor' ? 'I' : role === 'mentor' ? 'M' : 'A';

    const newAttendee: Attendee = {
      id: `CCC-2026-${rolePrefix}${randomSuffix}`,
      userId: `user-${Date.now()}`,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || '',
      organization: input.organization,
      designation: input.designation,
      category: input.category,
      role,
      industry: input.industry || 'Technology & Innovation',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      bio:
        input.bio ||
        `${input.designation} at ${input.organization}. Invited delegate to Capital Connect Conclave 2026.`,
      location: 'Hyderabad, India',
      website: input.website || '',
      linkedin: input.linkedin || '',
      tokenHash: `TOKEN-CCC-${tokenHex}`,
      invitationToken: `INV-CCC-${inviteHex}`,
      accessStatus: input.accessStatus || 'active',
      visibilitySettings: input.visibilitySettings || 'public',
      checkInStatus: false,
      registrationStatus: 'confirmed',
      registeredAt: new Date().toISOString(),
      isDemoAccount: false,
      founderProfile:
        role === 'founder'
          ? {
              startupName: input.founderProfile?.startupName || input.organization,
              website: input.founderProfile?.website || input.website || '',
              stage: input.founderProfile?.stage || 'Seed',
              fundingRequirement: input.founderProfile?.fundingRequirement || '$1M - $3M',
              industry: input.industry || 'AI & Deep Tech',
              shortDescription:
                input.founderProfile?.shortDescription ||
                `Scaling ${input.organization} with high-conviction technology.`,
              tractionMetrics: input.founderProfile?.tractionMetrics || 'Commercial pilots in progress',
            }
          : undefined,
      investorProfile:
        role === 'investor'
          ? {
              investmentCategory: input.investorProfile?.investmentCategory || 'Venture Capital',
              preferredSectors: input.investorProfile?.preferredSectors || [input.industry || 'Technology'],
              preferredStages: input.investorProfile?.preferredStages || ['Seed', 'Series A'],
              ticketSize: input.investorProfile?.ticketSize || '$500K - $2M',
              geography: input.investorProfile?.geography || 'India & Global',
              thesisSummary: input.investorProfile?.thesisSummary || 'Institutional capital backing transformative founders.',
            }
          : undefined,
    };

    attendees.unshift(newAttendee);
    Storage.setAttendees(attendees);
    return newAttendee;
  },

  updateAttendee(id: string, updates: Partial<Attendee>): Attendee {
    const attendees = Storage.getAttendees();
    const index = attendees.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Attendee ${id} not found`);

    const updated = {
      ...attendees[index],
      ...updates,
      role: updates.category ? categoryToRole(updates.category) : attendees[index].role,
      founderProfile: updates.founderProfile
        ? { ...attendees[index].founderProfile, ...updates.founderProfile }
        : attendees[index].founderProfile,
      investorProfile: updates.investorProfile
        ? { ...attendees[index].investorProfile, ...updates.investorProfile }
        : attendees[index].investorProfile,
    } as Attendee;

    attendees[index] = updated;
    Storage.setAttendees(attendees);
    return updated;
  },

  toggleAccessStatus(id: string): Attendee {
    const attendee = this.getAttendeeById(id);
    if (!attendee) throw new Error(`Attendee ${id} not found`);

    const currentStatus = attendee.accessStatus || 'active';
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';

    return this.updateAttendee(id, { accessStatus: nextStatus });
  },

  regenerateToken(id: string): Attendee {
    const tokenHex = Math.random().toString(16).substring(2, 10);
    const inviteHex = Math.random().toString(36).substring(2, 7).toUpperCase();

    return this.updateAttendee(id, {
      tokenHash: `TOKEN-CCC-${tokenHex}`,
      invitationToken: `INV-CCC-${inviteHex}`,
      checkInStatus: false,
      checkedInAt: undefined,
    });
  },

  deleteAttendee(id: string): void {
    let attendees = Storage.getAttendees();
    attendees = attendees.filter((a) => a.id !== id);
    Storage.setAttendees(attendees);
  },

  getRecommendationsFor(attendee: Attendee): Attendee[] {
    const all = Storage.getAttendees().filter((a) => a.id !== attendee.id);

    if (attendee.role === 'founder') {
      const founderIndustry = attendee.industry.toLowerCase();
      const founderStage = attendee.founderProfile?.stage;

      const scored = all.map((target) => {
        let score = 0;
        if (target.role === 'investor') {
          score += 10;
          if (target.investorProfile) {
            const sectors = target.investorProfile.preferredSectors.map((s) => s.toLowerCase());
            if (sectors.some((s) => founderIndustry.includes(s) || s.includes(founderIndustry))) {
              score += 15;
            }
            if (founderStage && target.investorProfile.preferredStages.includes(founderStage)) {
              score += 10;
            }
          }
        } else if (target.role === 'mentor') {
          score += 5;
        }
        return { attendee: target, score };
      });

      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((s) => s.attendee);
    }

    if (attendee.role === 'investor') {
      const prefSectors = attendee.investorProfile?.preferredSectors.map((s) => s.toLowerCase()) || [];
      const prefStages = attendee.investorProfile?.preferredStages || [];

      const scored = all.map((target) => {
        let score = 0;
        if (target.role === 'founder') {
          score += 10;
          const targetIndustry = target.industry.toLowerCase();
          if (prefSectors.some((s) => targetIndustry.includes(s) || s.includes(targetIndustry))) {
            score += 15;
          }
          if (target.founderProfile?.stage && prefStages.includes(target.founderProfile.stage)) {
            score += 10;
          }
        }
        return { attendee: target, score };
      });

      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((s) => s.attendee);
    }

    return all.slice(0, 4);
  },
};
