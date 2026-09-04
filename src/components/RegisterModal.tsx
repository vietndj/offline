import React, { useState } from 'react';
import { X, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { CONTENT } from '../content';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerModal } = CONTENT;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg(registerModal.errors.requiredFields);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          occupation: occupation.trim(),
          reason: reason.trim(),
          source: 'offline.fedu.vn (Modal)'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const queryParams = new URLSearchParams({
          name: fullName.trim(),
          phone: phone.trim()
        });
        window.location.href = `/success?${queryParams.toString()}`;
      } else {
        setErrorMsg(data.error || registerModal.errors.serverError);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(registerModal.errors.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e0f13] border border-zinc-800 p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>{registerModal.badge}</span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-white">
            {registerModal.title}
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            {registerModal.subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              {registerModal.fields.fullName.label} <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={registerModal.fields.fullName.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                {registerModal.fields.phone.label} <span className="text-amber-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={registerModal.fields.phone.placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-white placeholder-zinc-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                {registerModal.fields.email.label}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={registerModal.fields.email.placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-white placeholder-zinc-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              {registerModal.fields.occupation.label}
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder={registerModal.fields.occupation.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              {registerModal.fields.reason.label}
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={registerModal.fields.reason.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-white placeholder-zinc-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{registerModal.ctaSubmitting}</span>
              </>
            ) : (
              <>
                <span>{registerModal.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
