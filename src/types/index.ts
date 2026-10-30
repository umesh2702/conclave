export type UserRole = 
  | 'founder' 
  | 'investor' 
  | 'mentor' 
  | 'partner' 
  | 'attendee' 
  | 'organizer';

export type ParticipantCategory = 
  | 'Founder' 
  | 'Investor' 
  | 'Mentor' 
  | 'Financial Institution' 
  | 'Ecosystem Partner' 
  | 'General Attendee';

export type RegistrationStatus = 'confirmed' | 'pending_review' | 'cancelled';

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export type MeetingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled';

export type SessionCategory = 
  | 'Keynote' 
  | 'Panel Discussion' 
  | 'Pitch Track' 
  | 'Deal Room' 
  | 'Workshop' 
  | 'Networking Reception';

export interface FounderProfile {
  startupName: string;
  website: string;
  stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Growth';
  fundingRequirement: string;
  industry: string;
  shortDescription: string;
  tractionMetrics?: string;
  pitchDeckSummary?: string;
}

export interface InvestorProfile {
  investmentCategory: 'Venture Capital' | 'Angel Syndicate' | 'Family Office' | 'Corporate VC' | 'Private Equity';
  preferredSectors: string[];
  preferredStages: ('Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Growth')[];
  ticketSize: string;
  geography: string;
  portfolioHighlights?: string[];
  thesisSummary?: string;
}

export interface Attendee {
  id: string; // e.g. "CCC-2026-F001"
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  organization: string;
  designation: string;
  category: ParticipantCategory;
  role: UserRole;
  industry: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  website?: string;
  linkedin?: string;
  tokenHash: string; // Non-sensitive check-in token e.g. "TOKEN-CCC-94a8e8f2"
  invitationToken?: string; // Unique organizer invite code e.g. "INV-CCC-88910"
  accessStatus?: 'active' | 'suspended' | 'revoked'; // Access permission
  visibilitySettings?: 'public' | 'syndicate_only' | 'hidden'; // Directory privacy
  checkInStatus: boolean;
  checkedInAt?: string;
  registrationStatus: RegistrationStatus;
  registeredAt: string;
  founderProfile?: FounderProfile;
  investorProfile?: InvestorProfile;
  isDemoAccount?: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  title?: string;
  organization: string;
  biography: string;
  bio?: string;
  imageUrl: string;
  avatarUrl?: string;
  featured: boolean;
  topic?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  expertise?: string[];
  sessionIds?: string[];
}

export type SessionLiveStatus = 'upcoming' | 'live' | 'completed' | 'delayed' | 'cancelled';

export interface Session {
  id: string;
  day: number; // 1 or 2
  date: string;
  startTime: string; // "09:30 AM"
  endTime: string;   // "10:30 AM"
  title: string;
  description: string;
  location: string; // "Grand Ballroom Stage A", "Syndicate Deal Room 2"
  stage?: string; // "Main Conclave Hall (Stage A)", "Venture Stage (Stage B)", etc.
  floor?: string; // "Level 1", "Level 2", "Sky Level"
  category: SessionCategory;
  speakerIds: string[];
  status: 'published' | 'draft';
  liveStatus?: SessionLiveStatus;
  capacity?: number;
}

export interface VenueZone {
  id: string;
  name: string;
  code: string;
  level: string; // "Level 1", "Level 2", "Sky Level"
  stageName?: string;
  description: string;
  facilities: string[];
  capacity?: string;
  color?: string;
}

export interface SimulationClock {
  currentDay: number; // 1 or 2
  currentTime: string; // e.g. "10:30 AM"
  presetKey: string;
  presetLabel: string;
  isLive: boolean;
  statusText: string; // e.g. "CONCLAVE IN PROGRESS — DAY 1"
}

export interface Connection {
  id: string;
  requesterId: string; // Attendee ID
  recipientId: string; // Attendee ID
  status: ConnectionStatus;
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MeetingSlot {
  id: string;
  day: number;
  timeSlot: string; // "11:30 AM - 12:00 PM"
  location: string; // "Pod A-1 (Level 2)"
}

export interface Meeting {
  id: string;
  requesterId: string; // Attendee ID
  recipientId: string; // Attendee ID
  slotId: string;
  timeSlot: string;
  location: string;
  purpose: string;
  status: MeetingStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  publishedAt: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'General' | 'Deal Room' | 'Schedule' | 'Venue';
  author: string;
}

export interface ConclaveEvent {
  id: string;
  name: string;
  tagline: string;
  dates: string;
  venue: string;
  city: string;
  organizer: string;
  technologyPartner: string;
  platform: string;
  stats: {
    foundersCount: number;
    investorsCount: number;
    capitalPool: string;
    sessionsCount: number;
  };
}

export interface CheckInResult {
  success: boolean;
  attendee?: Attendee;
  message: string;
  alreadyCheckedIn?: boolean;
  checkedInTimestamp?: string;
}

export interface AttendeeFilter {
  category?: string;
  industry?: string;
  stage?: string;
  searchQuery?: string;
}
