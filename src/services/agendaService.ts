import { Session, Speaker, SessionLiveStatus, SimulationClock } from '../types';
import { Storage } from './storage';

export interface ActivityFeedItem {
  id: string;
  time: string;
  text: string;
  category: 'session' | 'venue' | 'networking' | 'announcement';
}

/**
 * Parses time string like "09:30 AM", "11:45 AM", "02:30 PM", "10:15" into minutes since midnight.
 */
export function parseTimeMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const timePart = clean.replace(/AM|PM/g, '').trim();
  const [hourStr, minStr] = timePart.split(':');
  let hours = parseInt(hourStr, 10) || 0;
  const minutes = parseInt(minStr, 10) || 0;

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

export const AgendaService = {
  getSessions(day?: number): Session[] {
    const all = Storage.getSessions();
    if (day !== undefined && day !== 0) {
      return all.filter((s) => s.day === day);
    }
    return all;
  },

  getSessionById(id: string): Session | undefined {
    const all = Storage.getSessions();
    return all.find((s) => s.id === id);
  },

  /**
   * Deterministically resolves the currently live session:
   * 1. Priority 1: Session explicitly marked 'live' on target day.
   * 2. Priority 2: Clock-based match: startTime <= currentTime <= endTime on target day.
   * 3. Priority 3: First upcoming session after current time.
   * 4. Fallback: First session of target day.
   */
  getCurrentlyLiveSession(day?: number): Session | undefined {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;
    const daySessions = all.filter((s) => s.day === targetDay && s.status !== 'draft');

    if (daySessions.length === 0) return undefined;

    // 1. Explicitly marked 'live'
    const explicitlyLive = daySessions.find((s) => s.liveStatus === 'live');
    if (explicitlyLive) return explicitlyLive;

    // 2. Time-window match
    const currentMins = parseTimeMinutes(clock.currentTime);
    const timeMatch = daySessions.find((s) => {
      if (s.liveStatus === 'completed' || s.liveStatus === 'cancelled') return false;
      const start = parseTimeMinutes(s.startTime);
      const end = parseTimeMinutes(s.endTime);
      return currentMins >= start && currentMins <= end;
    });
    if (timeMatch) return timeMatch;

    // 3. Next upcoming session
    const nextUpcoming = daySessions.find((s) => {
      if (s.liveStatus === 'completed' || s.liveStatus === 'cancelled') return false;
      return parseTimeMinutes(s.startTime) > currentMins;
    });
    if (nextUpcoming) return nextUpcoming;

    // 4. Default to first session not completed
    return daySessions.find((s) => s.liveStatus !== 'completed') || daySessions[0];
  },

  /**
   * Returns other sessions simultaneously happening (e.g. on other stages)
   */
  getConcurrentLiveSessions(primarySessionId?: string, day?: number): Session[] {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;
    const currentMins = parseTimeMinutes(clock.currentTime);

    return all.filter((s) => {
      if (s.id === primarySessionId) return false;
      if (s.day !== targetDay) return false;
      if (s.liveStatus === 'completed' || s.liveStatus === 'cancelled') return false;

      if (s.liveStatus === 'live') return true;

      const start = parseTimeMinutes(s.startTime);
      const end = parseTimeMinutes(s.endTime);
      return currentMins >= start && currentMins <= end;
    });
  },

  /**
   * Calculates session progress percentage (0 - 100)
   */
  getSessionProgress(session: Session, currentTimeStr?: string): number {
    const clock = Storage.getSimulationClock();
    const time = currentTimeStr || clock.currentTime;
    const currentMins = parseTimeMinutes(time);
    const startMins = parseTimeMinutes(session.startTime);
    const endMins = parseTimeMinutes(session.endTime);

    if (endMins <= startMins) return 50;
    if (currentMins <= startMins) return 5;
    if (currentMins >= endMins) return 100;

    const progress = ((currentMins - startMins) / (endMins - startMins)) * 100;
    return Math.min(100, Math.max(5, Math.round(progress)));
  },

  /**
   * Retrieves upcoming sessions for the current day chronologically
   */
  getUpcomingSessions(day?: number, limit = 3): Session[] {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;
    const currentMins = parseTimeMinutes(clock.currentTime);

    const daySessions = all.filter((s) => s.day === targetDay && s.status !== 'draft');

    // Find sessions that start after current time or are flagged upcoming/delayed
    const upcoming = daySessions
      .filter((s) => {
        if (s.liveStatus === 'completed' || s.liveStatus === 'live' || s.liveStatus === 'cancelled') {
          return false;
        }
        return parseTimeMinutes(s.startTime) >= currentMins || s.liveStatus === 'upcoming' || s.liveStatus === 'delayed';
      })
      .sort((a, b) => parseTimeMinutes(a.startTime) - parseTimeMinutes(b.startTime));

    return upcoming.slice(0, limit);
  },

  getCompletedSessions(day?: number): Session[] {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;
    return all.filter((s) => s.day === targetDay && s.liveStatus === 'completed');
  },

  getSpeakers(): Speaker[] {
    return Storage.getSpeakers();
  },

  getSpeakerById(id: string): Speaker | undefined {
    const speakers = Storage.getSpeakers();
    return speakers.find((sp) => sp.id === id);
  },

  isBookmarked(sessionId: string): boolean {
    const bookmarkedIds = Storage.getBookmarkedSessionIds();
    return bookmarkedIds.includes(sessionId);
  },

  toggleBookmark(sessionId: string): boolean {
    let bookmarkedIds = Storage.getBookmarkedSessionIds();
    const exists = bookmarkedIds.includes(sessionId);

    if (exists) {
      bookmarkedIds = bookmarkedIds.filter((id) => id !== sessionId);
    } else {
      bookmarkedIds.push(sessionId);
    }

    Storage.setBookmarkedSessionIds(bookmarkedIds);
    return !exists;
  },

  getBookmarkedSessions(): Session[] {
    const bookmarkedIds = Storage.getBookmarkedSessionIds();
    const all = Storage.getSessions();
    return all.filter((s) => bookmarkedIds.includes(s.id));
  },

  createSession(data: Omit<Session, 'id' | 'status'> & { status?: 'published' | 'draft' }): Session {
    const sessions = Storage.getSessions();
    const newSession: Session = {
      ...data,
      id: `ses-${Date.now()}`,
      status: data.status || 'published',
      liveStatus: data.liveStatus || 'upcoming',
      stage: data.stage || data.location,
      floor: data.floor || 'Level 1',
    };

    sessions.push(newSession);
    Storage.setSessions(sessions);
    return newSession;
  },

  updateSession(id: string, updates: Partial<Session>): Session {
    const sessions = Storage.getSessions();
    const idx = sessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Session not found');

    const updated = { ...sessions[idx], ...updates };
    sessions[idx] = updated;
    Storage.setSessions(sessions);
    return updated;
  },

  setSessionLiveStatus(id: string, status: SessionLiveStatus): Session {
    const sessions = Storage.getSessions();
    const idx = sessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Session not found');

    if (status === 'live') {
      sessions.forEach((s) => {
        if (s.liveStatus === 'live' && s.id !== id) {
          s.liveStatus = 'completed';
        }
      });
    }

    sessions[idx].liveStatus = status;
    Storage.setSessions(sessions);
    return sessions[idx];
  },

  startSession(id: string): Session {
    return this.setSessionLiveStatus(id, 'live');
  },

  completeSession(id: string): Session {
    return this.setSessionLiveStatus(id, 'completed');
  },

  rescheduleSession(id: string, startTime: string, endTime: string): Session {
    return this.updateSession(id, { startTime, endTime });
  },

  updateSessionStage(id: string, stage: string, location: string, floor?: string): Session {
    return this.updateSession(id, { stage, location, floor });
  },

  assignSpeakerToSession(sessionId: string, speakerId: string): Session {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const speakerIds = session.speakerIds.includes(speakerId)
      ? session.speakerIds
      : [...session.speakerIds, speakerId];

    return this.updateSession(sessionId, { speakerIds });
  },

  removeSpeakerFromSession(sessionId: string, speakerId: string): Session {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const speakerIds = session.speakerIds.filter((id) => id !== speakerId);
    return this.updateSession(sessionId, { speakerIds });
  },

  addSpeaker(data: Omit<Speaker, 'id'>): Speaker {
    const speakers = Storage.getSpeakers();
    const newSpeaker: Speaker = {
      ...data,
      id: `spk-${Date.now()}`,
    };
    speakers.push(newSpeaker);
    Storage.setSpeakers(speakers);
    return newSpeaker;
  },

  updateSpeaker(id: string, updates: Partial<Speaker>): Speaker {
    const speakers = Storage.getSpeakers();
    const idx = speakers.findIndex((sp) => sp.id === id);
    if (idx === -1) throw new Error('Speaker not found');

    const updated = { ...speakers[idx], ...updates };
    speakers[idx] = updated;
    Storage.setSpeakers(speakers);
    return updated;
  },

  deleteSession(id: string): void {
    let sessions = Storage.getSessions();
    sessions = sessions.filter((s) => s.id !== id);
    Storage.setSessions(sessions);
  },

  /**
   * Generates a realistic, chronological event activity feed based on current day and time
   */
  getActivityFeed(clock?: SimulationClock): ActivityFeedItem[] {
    const clk = clock || Storage.getSimulationClock();
    const currentMins = parseTimeMinutes(clk.currentTime);
    const day = clk.currentDay;

    const allEvents: { day: number; timeMinutes: number; time: string; text: string; category: ActivityFeedItem['category'] }[] = [
      {
        day: 1,
        timeMinutes: 510, // 08:30 AM
        time: '08:30 AM',
        text: 'Fast-track registration concourse & badge scanning operational at Level 1.',
        category: 'venue',
      },
      {
        day: 1,
        timeMinutes: 540, // 09:00 AM
        time: '09:00 AM',
        text: 'Opening Macro Briefing commenced on Main Stage A by Kavita Singhal.',
        category: 'session',
      },
      {
        day: 1,
        timeMinutes: 570, // 09:30 AM
        time: '09:30 AM',
        text: 'Dr. Alistair Wright & Vikramaditya Rao checked into the Speaker Green Room.',
        category: 'session',
      },
      {
        day: 1,
        timeMinutes: 615, // 10:15 AM
        time: '10:15 AM',
        text: 'Plenary panel "AI & DeepTech Frontier" called to order in Stage A.',
        category: 'session',
      },
      {
        day: 1,
        timeMinutes: 675, // 11:15 AM
        time: '11:15 AM',
        text: 'Private 1:1 Syndicate Deal Pods (A-1 through B-8) opened on Level 2.',
        category: 'networking',
      },
      {
        day: 1,
        timeMinutes: 720, // 12:00 PM
        time: '12:00 PM',
        text: 'Continuous coffee & luncheon service began at Conclave Barista Pavilion.',
        category: 'venue',
      },
      {
        day: 1,
        timeMinutes: 840, // 02:00 PM
        time: '02:00 PM',
        text: 'Founder Fireside with Rohan Deshmukh (HyperScale Mobility) opened on Venture Stage B.',
        category: 'session',
      },
      {
        day: 1,
        timeMinutes: 930, // 03:30 PM
        time: '03:30 PM',
        text: 'Institutional Pitch Showcase session initiated for 10 vetted scale-ups on Stage A.',
        category: 'session',
      },
      {
        day: 2,
        timeMinutes: 540, // 09:00 AM
        time: '09:00 AM',
        text: 'Day 2 delegate reception & breakfast briefing opened at Executive Lounge.',
        category: 'venue',
      },
      {
        day: 2,
        timeMinutes: 570, // 09:30 AM
        time: '09:30 AM',
        text: 'Venture Debt & Non-Dilutive Financial Instruments panel started on Stage A.',
        category: 'session',
      },
      {
        day: 2,
        timeMinutes: 660, // 11:00 AM
        time: '11:00 AM',
        text: 'ClimateTech & Hard Infrastructure session convened on Venture Stage B.',
        category: 'session',
      },
      {
        day: 2,
        timeMinutes: 990, // 04:30 PM
        time: '04:30 PM',
        text: 'Executive Sunset Networking & Syndicate Mixer commenced at Sky Terrace.',
        category: 'networking',
      },
    ];

    // Filter by day and time <= currentMins
    const filtered = allEvents.filter((ev) => ev.day === day && ev.timeMinutes <= currentMins);

    // Return in reverse chronological order
    return filtered
      .sort((a, b) => b.timeMinutes - a.timeMinutes)
      .slice(0, 4)
      .map((ev, i) => ({
        id: `act-${ev.day}-${ev.timeMinutes}-${i}`,
        time: ev.time,
        text: ev.text,
        category: ev.category,
      }));
  },
};
