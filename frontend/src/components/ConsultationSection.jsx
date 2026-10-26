import React, { useState } from 'react';
import { CalendarCheck2, PhoneCall, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';

export default function ConsultationSection({ onNotify }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    spaceType: 'Living Room & Balcony',
    lightCondition: 'Medium Indirect Light',
    preferredSlot: 'Tomorrow • 11:00 AM – 1:00 PM',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { booking } = await api.bookConsultation(form);
      setConfirmedRef(booking);
      onNotify(`Consultation booked — ref ${booking.reference} 🌿`);
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consult" className="py-16 lg:py-20 bg-linen-50">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="rounded-[28px] bg-white border border-stone-100 shadow-soft overflow-hidden grid lg:grid-cols-12">
          {/* Left — dark atelier card */}
          <div className="lg:col-span-5 relative bg-canopy-950 text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> Complimentary Atelier Call
              </span>
              <h2 className="mt-3 font-serif text-[32px] lg:text-[42px] leading-[0.95] tracking-[-0.02em] font-medium">
                Let&apos;s green your <span className="italic font-normal text-emerald-200">home</span> — together.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-[42ch]">
                Unsure about light or space? Book a free 15-min call with our Pune horticulturists — we&apos;ll map plants to your corners.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white">1-on-1 video or WhatsApp • No sales pitch</span>
              </div>
            </div>

            <div className="relative mt-8 pt-6 border-t border-white/10 space-y-3 text-xs text-white/80">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><PhoneCall className="w-4 h-4 text-emerald-300" /></span>
                <span>Direct Helpline • +91 8883639639</span>
              </div>
              <p className="text-white/60 pl-1">Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white">
            {confirmedRef ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-semibold text-canopy-950">Scheduled — {confirmedRef.reference}</h3>
                <p className="text-sm text-stone-600 max-w-md">
                  Thank you, <strong>{confirmedRef.name}</strong>! We&apos;ll reach out on WhatsApp during <strong>{confirmedRef.preferredSlot}</strong>.
                </p>
                <button onClick={() => setConfirmedRef(null)} className="h-10 px-6 rounded-full bg-canopy-950 text-white text-xs font-semibold">
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-canopy-950">Book Free Plant Styling Advice</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold">₹0 • Free</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Deshmukh" className="w-full h-11 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:outline-none focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">WhatsApp / Phone *</label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98XXXXXXXX" className="w-full h-11 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:outline-none focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 transition" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Space Type</label>
                    <select value={form.spaceType} onChange={(e) => setForm({ ...form, spaceType: e.target.value })} className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-100 text-xs font-medium focus:bg-white focus:border-canopy-900/20">
                      <option>Living Room & Balcony</option>
                      <option>Work-From-Home Desk</option>
                      <option>Corporate Office / Studio</option>
                      <option>Bulk / Event Gifting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Natural Light</label>
                    <select value={form.lightCondition} onChange={(e) => setForm({ ...form, lightCondition: e.target.value })} className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-100 text-xs font-medium focus:bg-white focus:border-canopy-900/20">
                      <option>Low Light / Shaded</option>
                      <option>Medium Indirect Light</option>
                      <option>Bright Sunny Window</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Preferred Slot</label>
                    <select value={form.preferredSlot} onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })} className="w-full h-11 px-3 rounded-xl bg-stone-50 border border-stone-100 text-xs font-medium focus:bg-white focus:border-canopy-900/20">
                      <option>Tomorrow • 11:00 AM – 1:00 PM</option>
                      <option>Tomorrow • 4:00 PM – 6:30 PM</option>
                      <option>This Weekend • Morning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Notes (optional)</label>
                  <input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="e.g. Need low-light, pet-safe for bedroom…" className="w-full h-11 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:outline-none focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 transition" />
                </div>

                <button type="submit" disabled={loading} className="h-12 px-7 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold inline-flex items-center gap-2 transition active:scale-95 shadow-soft">
                  <CalendarCheck2 className="w-4 h-4 text-emerald-300" /> {loading ? 'Scheduling…' : 'Confirm Free Call'} <ArrowRight className="w-4 h-4 opacity-60" />
                </button>
                <p className="text-[11px] text-stone-500">Free • No spam • Reschedule anytime on WhatsApp</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
