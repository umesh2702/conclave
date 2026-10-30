import { Connection, ConnectionStatus } from '../types';
import { Storage } from './storage';

export const ConnectionService = {
  getAllConnections(): Connection[] {
    return Storage.getConnections();
  },

  getConnectionsForAttendee(attendeeId: string) {
    const all = Storage.getConnections();
    const sent = all.filter((c) => c.requesterId === attendeeId && c.status === 'pending');
    const received = all.filter((c) => c.recipientId === attendeeId && c.status === 'pending');
    const accepted = all.filter(
      (c) => (c.requesterId === attendeeId || c.recipientId === attendeeId) && c.status === 'accepted'
    );
    const declined = all.filter(
      (c) => (c.requesterId === attendeeId || c.recipientId === attendeeId) && c.status === 'declined'
    );

    return {
      all: all.filter((c) => c.requesterId === attendeeId || c.recipientId === attendeeId),
      sent,
      received,
      accepted,
      declined,
    };
  },

  getConnectionBetween(attendeeA: string, attendeeB: string): Connection | undefined {
    const all = Storage.getConnections();
    return all.find(
      (c) =>
        (c.requesterId === attendeeA && c.recipientId === attendeeB) ||
        (c.requesterId === attendeeB && c.recipientId === attendeeA)
    );
  },

  sendConnectionRequest(requesterId: string, recipientId: string, message?: string): Connection {
    if (requesterId === recipientId) {
      throw new Error('Cannot connect with yourself');
    }

    const all = Storage.getConnections();
    const existing = this.getConnectionBetween(requesterId, recipientId);

    if (existing) {
      if (existing.status === 'pending' || existing.status === 'accepted') {
        throw new Error(`A connection is already ${existing.status} with this participant`);
      }
      // Re-activate previously cancelled or declined
      existing.status = 'pending';
      existing.requesterId = requesterId;
      existing.recipientId = recipientId;
      existing.message = message || existing.message;
      existing.updatedAt = new Date().toISOString();
      Storage.setConnections(all);
      return existing;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      requesterId,
      recipientId,
      status: 'pending',
      message: message || 'I would like to connect at Capital Connect Conclave 2026.',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newConnection);
    Storage.setConnections(all);
    return newConnection;
  },

  acceptConnection(connectionId: string): Connection {
    const all = Storage.getConnections();
    const conn = all.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection request not found');

    conn.status = 'accepted';
    conn.updatedAt = new Date().toISOString();
    Storage.setConnections(all);
    return conn;
  },

  declineConnection(connectionId: string): Connection {
    const all = Storage.getConnections();
    const conn = all.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection request not found');

    conn.status = 'declined';
    conn.updatedAt = new Date().toISOString();
    Storage.setConnections(all);
    return conn;
  },

  cancelConnection(connectionId: string): Connection {
    const all = Storage.getConnections();
    const conn = all.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection request not found');

    conn.status = 'cancelled';
    conn.updatedAt = new Date().toISOString();
    Storage.setConnections(all);
    return conn;
  },
};
