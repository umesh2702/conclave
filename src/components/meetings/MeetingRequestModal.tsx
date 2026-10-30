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
    } catch (err: any) {
      setError(err.message || 'Failed to schedule meeting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C7A875]/15 border border-[#C7A875]/30 flex items-center justify-center text-[#DFC394]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3EF]">
                Request 1:1 Deal Room Meeting
              </h3>
              <p className="text-xs text-[#9AA6B5]">
                With {recipient.fullName} ({recipient.organization})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9AA6B5] hover:text-[#F5F3EF] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                      className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-[#172335] border-[#C7A875] text-[#F5F3EF]'
                          : 'bg-[#111B2A] border-white/5 text-[#9AA6B5] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-[#DFC394]' : 'text-[#7998B8]'}`} />
                        <span className="font-medium">
                          Day {s.day} — {s.timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#9AA6B5]">
                        <MapPin className="w-3 h-3 text-[#C7A875]" />
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
                className="w-full rounded-xl bg-[#111B2A] border border-white/10 px-3 py-2 text-xs text-[#F5F3EF] placeholder-[#9AA6B5]/50 focus:border-[#C7A875] focus:outline-none"
                placeholder="Briefly state your discussion points or investment thesis..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA6B5] hover:text-[#F5F3EF] bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold champagne-btn shadow-md"
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
