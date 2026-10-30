import { Attendee, CheckInResult } from '../types';
import { Storage } from './storage';
import { AttendeeService } from './attendeeService';

export const CheckInService = {
  validateAndCheckIn(tokenOrId: string): CheckInResult {
    const raw = tokenOrId.trim();
    if (!raw) {
      return {
        success: false,
        message: 'No token or attendee ID provided.',
      };
    }

    const attendee = AttendeeService.getAttendeeByToken(raw);

    if (!attendee) {
      return {
        success: false,
        message: `Security validation failed: Token "${raw}" does not match any registered attendee pass.`,
      };
    }

    if (attendee.checkInStatus) {
      return {
        success: false,
        attendee,
        alreadyCheckedIn: true,
        checkedInTimestamp: attendee.checkedInAt,
        message: `DUPLICATE ENTRY DETECTED: ${attendee.fullName} was already checked in at ${
          attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleTimeString() : 'earlier today'
        }. Entry badge has already been issued.`,
      };
    }

    // Mark check-in
    const updated = AttendeeService.updateAttendee(attendee.id, {
      checkInStatus: true,
      checkedInAt: new Date().toISOString(),
    });

    return {
      success: true,
      attendee: updated,
      message: `Verified: ${updated.fullName} (${updated.category}) successfully checked in! Access pass authorized.`,
    };
  },

  getCheckInStats() {
    const attendees = Storage.getAttendees();
    const total = attendees.length;
    const checkedIn = attendees.filter((a) => a.checkInStatus).length;
    const pending = total - checkedIn;
    const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

    const byCategory: Record<string, { total: number; checkedIn: number }> = {};
    for (const a of attendees) {
      if (!byCategory[a.category]) {
        byCategory[a.category] = { total: 0, checkedIn: 0 };
      }
      byCategory[a.category].total += 1;
      if (a.checkInStatus) {
        byCategory[a.category].checkedIn += 1;
      }
    }

    return {
      total,
      checkedIn,
      pending,
      percentage,
      byCategory,
    };
  },

  resetCheckInFor(attendeeId: string): Attendee {
    return AttendeeService.updateAttendee(attendeeId, {
      checkInStatus: false,
      checkedInAt: undefined,
    });
  },
};
