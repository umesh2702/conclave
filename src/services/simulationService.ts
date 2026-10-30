import { SimulationClock, SessionLiveStatus, Session } from '../types';
import { Storage } from './storage';

export interface SimulationPreset {
  key: string;
  day: number;
  time: string;
  label: string;
  activeSessionId: string;
  statusText: string;
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    key: 'day1_morning',
    day: 1,
    time: '09:30 AM',
    label: 'Day 1 — 09:30 AM: Opening Macro Briefing LIVE',
    activeSessionId: 'ses-1',
    statusText: 'CONCLAVE IS LIVE — DAY 1',
  },
  {
    key: 'day1_panel',
    day: 1,
    time: '10:30 AM',
    label: 'Day 1 — 10:30 AM: AI & DeepTech Frontier LIVE',
    activeSessionId: 'ses-2',
    statusText: 'CONCLAVE IS LIVE — DAY 1',
  },
  {
    key: 'day1_dealrooms',
    day: 1,
    time: '11:45 AM',
    label: 'Day 1 — 11:45 AM: Curated 1:1 Deal Rooms LIVE',
    activeSessionId: 'ses-3',
    statusText: 'DEAL ROOMS IN SESSION — DAY 1',
  },
  {
    key: 'day1_fireside',
    day: 1,
    time: '02:30 PM',
    label: 'Day 1 — 02:30 PM: Founder Fireside LIVE',
    activeSessionId: 'ses-4',
    statusText: 'CONCLAVE IS LIVE — DAY 1',
  },
  {
    key: 'day1_pitch',
    day: 1,
    time: '04:00 PM',
    label: 'Day 1 — 04:00 PM: Institutional Pitch Showcase LIVE',
    activeSessionId: 'ses-5',
    statusText: 'PITCH TRACK IN SESSION — DAY 1',
  },
  {
    key: 'day2_morning',
    day: 2,
    time: '10:00 AM',
    label: 'Day 2 — 10:00 AM: Venture Debt Panel LIVE',
    activeSessionId: 'ses-6',
    statusText: 'CONCLAVE IS LIVE — DAY 2',
  },
  {
    key: 'day2_climate',
    day: 2,
    time: '11:30 AM',
    label: 'Day 2 — 11:30 AM: ClimateTech Strategies LIVE',
    activeSessionId: 'ses-7',
    statusText: 'CONCLAVE IS LIVE — DAY 2',
  },
  {
    key: 'day2_mixer',
    day: 2,
    time: '05:00 PM',
    label: 'Day 2 — 05:00 PM: Sunset Syndicate Mixer LIVE',
    activeSessionId: 'ses-8',
    statusText: 'EVENING RECEPTION — DAY 2',
  },
];

export const SimulationService = {
  getClock(): SimulationClock {
    return Storage.getSimulationClock();
  },

  getPresets(): SimulationPreset[] {
    return SIMULATION_PRESETS;
  },

  applyPreset(presetKey: string): SimulationClock {
    const preset = SIMULATION_PRESETS.find((p) => p.key === presetKey) || SIMULATION_PRESETS[1];
    const sessions = Storage.getSessions();

    const targetDay = preset.day;
    const targetSessionId = preset.activeSessionId;

    // Find the index of the active session
    const daySessions = sessions.filter((s) => s.day === targetDay);
    const activeIndex = daySessions.findIndex((s) => s.id === targetSessionId);

    const updatedSessions: Session[] = sessions.map((s) => {
      // If session is from another day
      if (s.day < targetDay) {
        return { ...s, liveStatus: 'completed' };
      }
      if (s.day > targetDay) {
        return { ...s, liveStatus: 'upcoming' };
      }

      // Session is on targetDay
      const sIndex = daySessions.findIndex((ds) => ds.id === s.id);
      if (sIndex < activeIndex) {
        return { ...s, liveStatus: 'completed' };
      } else if (sIndex === activeIndex) {
        return { ...s, liveStatus: 'live' };
      } else {
        return { ...s, liveStatus: 'upcoming' };
      }
    });

    Storage.setSessions(updatedSessions);

    const newClock: SimulationClock = {
      currentDay: preset.day,
      currentTime: preset.time,
      presetKey: preset.key,
      presetLabel: preset.label,
      isLive: true,
      statusText: preset.statusText,
    };

    Storage.setSimulationClock(newClock);
    return newClock;
  },

  setSessionStatus(sessionId: string, status: SessionLiveStatus): Session {
    const sessions = Storage.getSessions();
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) throw new Error(`Session ${sessionId} not found`);

    if (status === 'live') {
      // Mark any other live session as completed
      sessions.forEach((s) => {
        if (s.liveStatus === 'live' && s.id !== sessionId) {
          s.liveStatus = 'completed';
        }
      });
    }

    sessions[idx].liveStatus = status;
    Storage.setSessions(sessions);
    return sessions[idx];
  },

  resetToDefault(): SimulationClock {
    return this.applyPreset('day1_panel');
  },
};
