import { Session, Speaker, SessionCategory } from '../types';
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

  deleteSession(id: string): void {
    let sessions = Storage.getSessions();
    sessions = sessions.filter((s) => s.id !== id);
    Storage.setSessions(sessions);
  },
};
