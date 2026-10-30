import {
  Attendee,
  Session,
  Speaker,
  Connection,
  Meeting,
  Announcement,
  ConclaveEvent,
} from '../types';
import {
  INITIAL_ATTENDEES,
  INITIAL_SESSIONS,
  INITIAL_SPEAKERS,
  INITIAL_CONNECTIONS,
  INITIAL_MEETINGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENT,
} from './mockData';

const STORAGE_KEYS = {
  ATTENDEES: 'ccc_attendees_v1',
  SESSIONS: 'ccc_sessions_v1',
  SPEAKERS: 'ccc_speakers_v1',
  CONNECTIONS: 'ccc_connections_v1',
  MEETINGS: 'ccc_meetings_v1',
  ANNOUNCEMENTS: 'ccc_announcements_v1',
  EVENT: 'ccc_event_v1',
  ACTIVE_USER_ID: 'ccc_active_user_id_v1',
  BOOKMARKED_SESSIONS: 'ccc_bookmarks_v1',
};

// SSR-safe check
const isClient = typeof window !== 'undefined';

function getFromStorage<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event to notify listeners in the same window
    window.dispatchEvent(new CustomEvent('ccc-storage-updated', { detail: { key } }));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage:`, e);
  }
}

export const Storage = {
  getAttendees(): Attendee[] {
    const attendees = getFromStorage<Attendee[]>(STORAGE_KEYS.ATTENDEES, []);
    if (!attendees || attendees.length === 0) {
      this.setAttendees(INITIAL_ATTENDEES);
      return INITIAL_ATTENDEES;
    }
    return attendees;
  },

  setAttendees(attendees: Attendee[]): void {
    setToStorage(STORAGE_KEYS.ATTENDEES, attendees);
  },

  getSessions(): Session[] {
    const sessions = getFromStorage<Session[]>(STORAGE_KEYS.SESSIONS, []);
    if (!sessions || sessions.length === 0) {
      this.setSessions(INITIAL_SESSIONS);
      return INITIAL_SESSIONS;
    }
    return sessions;
  },

  setSessions(sessions: Session[]): void {
    setToStorage(STORAGE_KEYS.SESSIONS, sessions);
  },

  getSpeakers(): Speaker[] {
    const speakers = getFromStorage<Speaker[]>(STORAGE_KEYS.SPEAKERS, []);
    if (!speakers || speakers.length === 0) {
      this.setSpeakers(INITIAL_SPEAKERS);
      return INITIAL_SPEAKERS;
    }
    return speakers;
  },

  setSpeakers(speakers: Speaker[]): void {
    setToStorage(STORAGE_KEYS.SPEAKERS, speakers);
  },

  getConnections(): Connection[] {
    const conns = getFromStorage<Connection[]>(STORAGE_KEYS.CONNECTIONS, []);
    if (!conns || conns.length === 0) {
      this.setConnections(INITIAL_CONNECTIONS);
      return INITIAL_CONNECTIONS;
    }
    return conns;
  },

  setConnections(connections: Connection[]): void {
    setToStorage(STORAGE_KEYS.CONNECTIONS, connections);
  },

  getMeetings(): Meeting[] {
    const meetings = getFromStorage<Meeting[]>(STORAGE_KEYS.MEETINGS, []);
    if (!meetings || meetings.length === 0) {
      this.setMeetings(INITIAL_MEETINGS);
      return INITIAL_MEETINGS;
    }
    return meetings;
  },

  setMeetings(meetings: Meeting[]): void {
    setToStorage(STORAGE_KEYS.MEETINGS, meetings);
  },

  getAnnouncements(): Announcement[] {
    const ann = getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, []);
    if (!ann || ann.length === 0) {
      this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
      return INITIAL_ANNOUNCEMENTS;
    }
    return ann;
  },

  setAnnouncements(announcements: Announcement[]): void {
    setToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },

  getEvent(): ConclaveEvent {
    const event = getFromStorage<ConclaveEvent | null>(STORAGE_KEYS.EVENT, null);
    if (!event) {
      this.setEvent(INITIAL_EVENT);
      return INITIAL_EVENT;
    }
    return event;
  },

  setEvent(event: ConclaveEvent): void {
    setToStorage(STORAGE_KEYS.EVENT, event);
  },

  getActiveUserId(): string {
    // Default to Founder demo account: CCC-2026-F001
    return getFromStorage<string>(STORAGE_KEYS.ACTIVE_USER_ID, 'CCC-2026-F001');
  },

  setActiveUserId(id: string): void {
    setToStorage(STORAGE_KEYS.ACTIVE_USER_ID, id);
  },

  getBookmarkedSessionIds(): string[] {
    return getFromStorage<string[]>(STORAGE_KEYS.BOOKMARKED_SESSIONS, ['ses-1', 'ses-3']);
  },

  setBookmarkedSessionIds(ids: string[]): void {
    setToStorage(STORAGE_KEYS.BOOKMARKED_SESSIONS, ids);
  },

  resetAll(): void {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.ATTENDEES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.SPEAKERS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MEETINGS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.EVENT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKED_SESSIONS);

    // Re-seed
    this.setAttendees(INITIAL_ATTENDEES);
    this.setSessions(INITIAL_SESSIONS);
    this.setSpeakers(INITIAL_SPEAKERS);
    this.setConnections(INITIAL_CONNECTIONS);
    this.setMeetings(INITIAL_MEETINGS);
    this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.setEvent(INITIAL_EVENT);
    this.setActiveUserId('CCC-2026-F001');
    this.setBookmarkedSessionIds(['ses-1', 'ses-3']);

    window.dispatchEvent(new CustomEvent('ccc-storage-updated', { detail: { key: 'ALL_RESET' } }));
  },
};
