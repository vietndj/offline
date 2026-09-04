import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { CONTENT } from '../content';
import { trackPurchase } from '../utils/pixel';

export const RegisterSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = CONTENT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg(register.form.errors.requiredFields);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://offline.fedu.vn';
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          occupation: occupation.trim(),
          reason: reason.trim(),
          source: 'offline.fedu.vn',
          url: currentUrl,
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        trackPurchase({
          phone: phone.trim(),
          email: email.trim(),
        });
        // Redirect to success page with user info
        const queryParams = new URLSearchParams({
          name: fullName.trim(),
          phone: phone.trim()
        });
        window.location.href = `/success?${queryParams.toString()}`;
      } else {
        setErrorMsg(data.error || register.form.errors.serverError);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(register.form.errors.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="dang-ky" className="py-24 px-4 bg-[#09090b] border-y border-zinc-800/80 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Perks & Value Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between reveal reveal-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-mono font-bold uppercase tracking-wide mb-5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse" />
                <span>{register.badge}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-[1.2] [text-wrap:balance]">
                {register.headlinePrefix}
                <span className="text-orange-500">{register.headlineHighlight}</span>
              </h2>
            </div>

            {/* Metadata (Thời gian, Địa điểm, Quy mô) */}
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">📅</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.time.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.time.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.time.desc}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">📍</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.location.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.location.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.location.desc}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">👥</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.scale.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.scale.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.scale.desc}</div>
                </div>
              </div>
            </div>

            {/* Inclusions */}
            <div className="pt-6 border-t border-zinc-800/80">
              <div className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider mb-3.5">
                {register.inclusionsTitle}
              </div>
              <div className="space-y-2.5 text-sm sm:text-[15px] font-sans">
                {register.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: In-page Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-zinc-800/80 bg-zinc-900/90 shadow-2xl backdrop-blur-sm reveal reveal-right delay-100">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {register.form.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {register.form.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-sans">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-sans font-medium text-zinc-200 mb-1.5">
                    {register.form.fields.fullName.label} <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={register.form.fields.fullName.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-sans font-medium text-zinc-200 mb-1.5">
                      {register.form.fields.phone.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={register.form.fields.phone.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-white placeholder-zinc-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-sans font-medium text-zinc-200 mb-1.5">
                      {register.form.fields.email.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={register.form.fields.email.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-white placeholder-zinc-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-sans font-medium text-zinc-200 mb-1.5">
                    {register.form.fields.occupation.label}{' '}
                    <span className="text-zinc-500 text-xs">{register.form.fields.occupation.optionalLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder={register.form.fields.occupation.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-white placeholder-zinc-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-sans font-medium text-zinc-200 mb-1.5">
                    {register.form.fields.reason.label}{' '}
                    <span className="text-zinc-500 text-xs">{register.form.fields.reason.optionalLabel}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={register.form.fields.reason.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-white placeholder-zinc-500 outline-none transition resize-none"
                  />
                </div>

                {/* Box lưu ý */}
                <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-600/40 text-xs text-zinc-300 flex items-start gap-2.5">
                  <span className="text-orange-500 shrink-0 font-bold">⚠️</span>
                  <span className="leading-relaxed">
                    <strong className="text-orange-400">{register.form.disclaimerTag}</strong> {register.form.disclaimer}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-sans font-bold text-base sm:text-lg shadow-xl shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{register.form.ctaSubmitting}</span>
                    </>
                  ) : (
                    <span>{register.form.cta}</span>
                  )}
                </button>

                <p className="text-xs text-zinc-400 text-center font-sans">
                  {register.form.securityNote}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
