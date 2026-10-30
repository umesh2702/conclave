import { Attendee, UserRole } from '../types';
import { Storage } from './storage';

export const AuthService = {
  getActiveUser(): Attendee {
    const activeId = Storage.getActiveUserId();
    const attendees = Storage.getAttendees();
    const found = attendees.find((a) => a.id === activeId);
    if (found) return found;

    // Fallback to first founder
    const fallback = attendees[0];
    if (fallback) {
      Storage.setActiveUserId(fallback.id);
      return fallback;
    }

    throw new Error('No attendees available');
  },

  setActiveUser(id: string): Attendee {
    const attendees = Storage.getAttendees();
    const user = attendees.find((a) => a.id === id);
    if (!user) throw new Error(`User with ID ${id} not found`);
    Storage.setActiveUserId(id);
    return user;
  },

  getDemoAccounts(): Attendee[] {
    const attendees = Storage.getAttendees();
    return attendees.filter((a) => a.isDemoAccount);
  },

  switchRole(role: UserRole): Attendee {
    const attendees = Storage.getAttendees();
    const user = attendees.find((a) => a.role === role && a.isDemoAccount);
    if (user) {
      Storage.setActiveUserId(user.id);
      return user;
    }
    // If not found with isDemoAccount, look for any matching role
    const anyUser = attendees.find((a) => a.role === role);
    if (anyUser) {
      Storage.setActiveUserId(anyUser.id);
      return anyUser;
    }
    return this.getActiveUser();
  },

  isOrganizer(): boolean {
    const current = this.getActiveUser();
    return current.role === 'organizer';
  },
};
