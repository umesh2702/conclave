import { Session, Speaker, SessionCategory, SessionLiveStatus } from '../types';
import { Storage } from './storage';

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

  getCurrentlyLiveSession(day?: number): Session | undefined {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;

    // First look for explicitly marked 'live'
    const liveSession = all.find((s) => s.day === targetDay && s.liveStatus === 'live');
    if (liveSession) return liveSession;

    // Fallback: first upcoming session on targetDay
    return all.find((s) => s.day === targetDay && s.liveStatus !== 'completed') || all[0];
  },

  getUpcomingSessions(day?: number, limit = 4): Session[] {
    const all = Storage.getSessions();
    const clock = Storage.getSimulationClock();
    const targetDay = day || clock.currentDay;

    return all
      .filter((s) => s.day === targetDay && (s.liveStatus === 'upcoming' || !s.liveStatus))
      .slice(0, limit);
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
      // Complete previous live
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
};
