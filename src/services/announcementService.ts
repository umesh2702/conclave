import { Announcement } from '../types';
import { Storage } from './storage';

export const AnnouncementService = {
  getAnnouncements(): Announcement[] {
    const all = Storage.getAnnouncements();
    return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  createAnnouncement(data: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    category?: 'General' | 'Deal Room' | 'Schedule' | 'Venue';
    author?: string;
  }): Announcement {
    const all = Storage.getAnnouncements();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || 'General',
      author: data.author || 'Conclave Secretariat',
      publishedAt: new Date().toISOString(),
    };

    all.unshift(newAnn);
    Storage.setAnnouncements(all);
    return newAnn;
  },

  deleteAnnouncement(id: string): void {
    let all = Storage.getAnnouncements();
    all = all.filter((a) => a.id !== id);
    Storage.setAnnouncements(all);
  },
};
