import { Meeting, MeetingSlot, MeetingStatus } from '../types';
import { Storage } from './storage';
import { INITIAL_MEETING_SLOTS } from './mockData';

export const MeetingService = {
  getAllMeetings(): Meeting[] {
    return Storage.getMeetings();
  },

  getMeetingSlots(): MeetingSlot[] {
    return INITIAL_MEETING_SLOTS;
  },

  getMeetingsForAttendee(attendeeId: string): Meeting[] {
    const all = Storage.getMeetings();
    return all.filter((m) => m.requesterId === attendeeId || m.recipientId === attendeeId);
  },

  requestMeeting(
    requesterId: string,
    recipientId: string,
    slotId: string,
    purpose: string
  ): Meeting {
    if (requesterId === recipientId) {
      throw new Error('Cannot schedule a meeting with yourself');
    }

    const all = Storage.getMeetings();
    const slot = INITIAL_MEETING_SLOTS.find((s) => s.id === slotId);
    if (!slot) throw new Error('Selected meeting slot is invalid');

    // Check if requester or recipient already has a confirmed or pending meeting at this exact slot
    const slotConflict = all.find(
      (m) =>
        (m.status === 'confirmed' || m.status === 'pending') &&
        m.slotId === slotId &&
        (m.requesterId === requesterId ||
          m.recipientId === requesterId ||
          m.requesterId === recipientId ||
          m.recipientId === recipientId)
    );

    if (slotConflict) {
      throw new Error('Either you or the participant already has a scheduled meeting during this time slot.');
    }

    // Check if there is already an active meeting between these two participants
    const activeBetween = all.find(
      (m) =>
        (m.status === 'pending' || m.status === 'confirmed') &&
        ((m.requesterId === requesterId && m.recipientId === recipientId) ||
          (m.requesterId === recipientId && m.recipientId === requesterId))
    );

    if (activeBetween) {
      throw new Error('An active meeting is already pending or confirmed with this participant.');
    }

    const newMeeting: Meeting = {
      id: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      requesterId,
      recipientId,
      slotId,
      timeSlot: `Day ${slot.day}: ${slot.timeSlot}`,
      location: slot.location,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newMeeting);
    Storage.setMeetings(all);
    return newMeeting;
  },

  confirmMeeting(meetingId: string): Meeting {
    const all = Storage.getMeetings();
    const meet = all.find((m) => m.id === meetingId);
    if (!meet) throw new Error('Meeting not found');

    meet.status = 'confirmed';
    Storage.setMeetings(all);
    return meet;
  },

  declineMeeting(meetingId: string): Meeting {
    const all = Storage.getMeetings();
    const meet = all.find((m) => m.id === meetingId);
    if (!meet) throw new Error('Meeting not found');

    meet.status = 'declined';
    Storage.setMeetings(all);
    return meet;
  },

  cancelMeeting(meetingId: string): Meeting {
    const all = Storage.getMeetings();
    const meet = all.find((m) => m.id === meetingId);
    if (!meet) throw new Error('Meeting not found');

    meet.status = 'cancelled';
    Storage.setMeetings(all);
    return meet;
  },
};
