import React, { useState } from 'react';
import { CalendarCheck2, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.js';

export default function ConsultationSection({ onNotify }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    spaceType: 'Living Room & Balcony',
    lightCondition: 'Medium Indirect Light',
    preferredSlot: 'Tomorrow • 11:00 AM – 1:00 PM',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { booking } = await api.bookConsultation(form);
      setConfirmedRef(booking);
      onNotify(`Free consultation booked! Reference: ${booking.reference} 🌿`);
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consult" className="py-14 lg:py-20 bg-linen-50">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="rounded-3xl bg-canopy-900 text-white overflow-hidden shadow-elevated grid lg:grid-cols-12">
          {/* Left Narrative */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-canopy-900 to-canopy-950">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> Complimentary Botanist Call
              </span>
              <h2 className="font-serif text-[32px] lg:text-[40px] leading-tight font-medium mt-3">
                Join Us in Greening Your Home & Workspace
              </h2>
              <p className="text-sm text-linen-200/80 leading-relaxed mt-4">
                Not sure which indoor plants suit your apartment’s sunlight or corporate floor? Book
                a free 15-minute consultation with our Pune nursery specialists.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-xs text-linen-100/85">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Direct Nursery Helpline: +91 8883639639</span>
              </div>
              <p className="text-linen-200/65">
                📍 Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white text-canopy-950 p-6 sm:p-10 lg:p-12">
            {confirmedRef ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-semibold">
                  Consultation Scheduled ({confirmedRef.reference})
                </h3>
                <p className="text-sm text-canopy-800/75 max-w-md">
                  Thank you, <strong>{confirmedRef.name}</strong>! Our horticulturist will reach out
                  on WhatsApp during <strong>{confirmedRef.preferredSlot}</strong>.
                </p>
                <button
                  onClick={() => setConfirmedRef(null)}
                  className="px-6 py-2.5 rounded-full bg-canopy-900 text-white text-xs font-semibold"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-semibold">
                    Book Free 1-on-1 Plant Styling Advice
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    ₹0 • Free
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Aarav Deshmukh"
                      className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98XXXXXXXX"
                      className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Space Type
                    </label>
                    <select
                      value={form.spaceType}
                      onChange={(e) => setForm({ ...form, spaceType: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-medium"
                    >
                      <option>Living Room & Balcony</option>
                      <option>Work-From-Home Desk</option>
                      <option>Corporate Office / Studio</option>
                      <option>Bulk / Event Gifting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Natural Light
                    </label>
                    <select
                      value={form.lightCondition}
                      onChange={(e) => setForm({ ...form, lightCondition: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-medium"
                    >
                      <option>Low Light / Shaded</option>
                      <option>Medium Indirect Light</option>
                      <option>Bright Sunny Window</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Preferred Slot
                    </label>
                    <select
                      value={form.preferredSlot}
                      onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-medium"
                    >
                      <option>Tomorrow • 11:00 AM – 1:00 PM</option>
                      <option>Tomorrow • 4:00 PM – 6:30 PM</option>
                      <option>This Weekend • Morning</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. Need 6 low-light plants safe for AC bedroom..."
                    className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-7 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold inline-flex items-center gap-2 transition active:scale-95"
                >
                  <CalendarCheck2 className="w-4 h-4 text-emerald-300" />
                  <span>{loading ? 'Scheduling...' : 'Confirm Free Botanist Call'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
