'use client';

import React, { useState } from 'react';
import { Attendee, MeetingSlot } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MeetingService } from '../../services/meetingService';
import { Calendar, Clock, MapPin, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MeetingRequestModalProps {
  recipient: Attendee;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MeetingRequestModal({
  recipient,
  isOpen,
  onClose,
  onSuccess,
}: MeetingRequestModalProps) {
  const { currentUser } = useAuth();
  const slots = MeetingService.getMeetingSlots();
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id || '');
  const [purpose, setPurpose] = useState(
    `Discussion on potential synergy and partnership between ${currentUser?.organization || 'our venture'} and ${recipient.organization}.`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setError(null);
    setLoading(true);

    try {
      MeetingService.requestMeeting(currentUser.id, recipient.id, selectedSlotId, purpose);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to schedule meeting request';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg surface-card-elevated border border-[#202C3D] p-5 sm:p-6 relative overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 pr-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#C7A875]/15 border border-[#C7A875]/30 flex items-center justify-center text-[#DFC394] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#F5F3EF] truncate">
                Request 1:1 Deal Room Meeting
              </h3>
              <p className="text-xs text-[#9AA6B5] truncate">
                With {recipient.fullName} ({recipient.organization})
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 flex flex-col items-center text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-base font-bold text-[#F5F3EF]">
              Meeting Request Sent!
            </h4>
            <p className="text-xs text-[#9AA6B5] max-w-sm">
              Your request for a 1:1 Deal Room session has been submitted to {recipient.fullName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#F5F3EF] mb-2">
                Select Predefined Conclave Slot
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {slots.map((s) => {
                  const isSelected = selectedSlotId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSlotId(s.id)}
                      className={`p-3 min-h-[40px] rounded-xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs transition-all ${
                        isSelected
                          ? 'bg-[#172335] border-[#C7A875] text-[#F5F3EF]'
                          : 'bg-[#111B2A] border-white/5 text-[#9AA6B5] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#DFC394]' : 'text-[#7998B8]'}`} />
                        <span className="font-medium">
                          Day {s.day} — {s.timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#9AA6B5]">
                        <MapPin className="w-3 h-3 text-[#C7A875] shrink-0" />
                        <span>{s.location}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F3EF] mb-1.5">
                Meeting Purpose / Discussion Objective
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                rows={3}
                className="w-full min-h-[80px] rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
                placeholder="Briefly state your discussion points or investment thesis..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium text-[#9AA6B5] hover:text-[#F5F3EF] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="min-h-[40px] px-5 py-2 rounded-xl text-xs font-semibold champagne-btn shadow-md transition-colors"
              >
                {loading ? 'Submitting...' : 'Send Meeting Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
