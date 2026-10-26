import React, { useState } from 'react';
import { CalendarCheck2, PhoneCall, Sparkles, CheckCircle2, ArrowRight, MapPin, Clock } from 'lucide-react';
import { api } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import Reveal from './Reveal.jsx';

const FIELD =
  'w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-[13px] text-canopy-950 transition focus:border-canopy-600/45 focus:bg-white focus:outline-none focus:ring-4 focus:ring-canopy-600/10';
const LABEL = 'mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500';

export default function ConsultationSection({ storeConfig = {}, onNotify }) {
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

  const phone = storeConfig.phone || '+91 8883639639';
  const waConsultUrl = buildWhatsAppUrl(
    storeConfig,
    'Hi Greenzo Pune! I would like free plant styling advice for my home / workspace.'
  );

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
    <section id="consult" className="bg-linen-50 py-14 lg:py-20">
      <div className="shell">
        <Reveal
          dir="scale"
          className="grid overflow-hidden rounded-[28px] border border-canopy-950/10 bg-white shadow-card lg:grid-cols-12"
        >
          {/* Left Dark Rainforest Side */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-canopy-950 p-8 text-white sm:p-10 lg:col-span-5 lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(77,190,141,0.25),transparent_60%)]" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-canopy-600/25 blur-3xl" />

            <div className="relative">
              <span className="eyebrow-light">
                <Sparkles className="h-3.5 w-3.5" /> Free Botanist Consultation
              </span>
              <h2 className="mt-3 font-serif text-[32px] leading-[1.02] tracking-[-0.025em] sm:text-[38px] lg:text-[40px]">
                Let&apos;s green your <span className="italic text-emerald-200">home</span> — together.
              </h2>
              <p className="mt-4 max-w-[42ch] text-[13.5px] leading-relaxed text-white/75">
                Unsure about light or AC airflow? Book a free 15-minute call with our Pune horticulturists — or send us
                a photo directly on WhatsApp right now.
              </p>

              <a
                href={waConsultUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2.5 rounded-full bg-whatsapp px-5 text-[12.5px] font-bold text-white shadow-whatsapp transition hover:bg-whatsapp-dark"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat Directly on WhatsApp
              </a>
            </div>

            <div className="relative mt-9 space-y-3 border-t border-white/10 pt-6 text-[12px] text-white/80">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 transition hover:text-emerald-300"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-300" />
                </span>
                <span>Direct Helpline · {phone}</span>
              </a>
              <p className="flex items-start gap-2.5 pl-0.5 text-white/60">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110
              </p>
              <p className="flex items-center gap-2.5 pl-0.5 text-white/60">
                <Clock className="h-3.5 w-3.5 shrink-0 text-emerald-300" /> Mon–Sat · 9am–8pm IST
              </p>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="bg-white p-6 sm:p-10 lg:col-span-7 lg:p-12">
            {confirmedRef ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-canopy-600/20 bg-canopy-50 text-canopy-700">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <div>
                  <span className="eyebrow justify-center">You&apos;re Booked</span>
                  <h3 className="mt-2 font-serif text-[26px] leading-tight text-canopy-950">
                    Scheduled · {confirmedRef.reference}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-stone-600">
                    Thank you, <strong className="text-canopy-950">{confirmedRef.name}</strong>! We&apos;ll reach out on
                    WhatsApp during <strong className="text-canopy-950">{confirmedRef.preferredSlot}</strong>.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      storeConfig,
                      `Hi Greenzo! My consultation reference is ${confirmedRef.reference} (${confirmedRef.preferredSlot}).`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-sm"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Confirm on WhatsApp
                  </a>
                  <button onClick={() => setConfirmedRef(null)} className="btn btn-outline btn-sm">
                    Book another session
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="eyebrow">Free · 15 minutes</span>
                    <h3 className="mt-1 font-serif text-[24px] font-medium leading-tight text-canopy-950 sm:text-[27px]">
                      Book plant styling advice
                    </h3>
                  </div>
                  <span className="rounded-full border border-canopy-600/20 bg-canopy-50 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-canopy-700">
                    ₹0 Free
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={LABEL}>Full name *</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Aarav Deshmukh"
                      className={`${FIELD} h-11`}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>WhatsApp / phone *</span>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98XXXXXXXX"
                      className={`${FIELD} h-11`}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className={LABEL}>Space type</span>
                    <select
                      value={form.spaceType}
                      onChange={(e) => setForm({ ...form, spaceType: e.target.value })}
                      className={`${FIELD} h-11`}
                    >
                      <option>Living Room &amp; Balcony</option>
                      <option>Work-From-Home Desk</option>
                      <option>Corporate Office / Studio</option>
                      <option>Bulk / Event Gifting</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className={LABEL}>Natural light</span>
                    <select
                      value={form.lightCondition}
                      onChange={(e) => setForm({ ...form, lightCondition: e.target.value })}
                      className={`${FIELD} h-11`}
                    >
                      <option>Low Light / Shaded</option>
                      <option>Medium Indirect Light</option>
                      <option>Bright Sunny Window</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className={LABEL}>Preferred slot</span>
                    <select
                      value={form.preferredSlot}
                      onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })}
                      className={`${FIELD} h-11`}
                    >
                      <option>Tomorrow • 11:00 AM – 1:00 PM</option>
                      <option>Tomorrow • 4:00 PM – 6:30 PM</option>
                      <option>This Weekend • Morning</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className={LABEL}>Notes (optional)</span>
                  <input
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. need low-light, pet-safe plants for the bedroom…"
                    className={`${FIELD} h-11`}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button type="submit" disabled={loading} className="btn btn-dark btn-md group/btn">
                    <CalendarCheck2 className="h-4 w-4 text-emerald-300" />
                    {loading ? 'Scheduling…' : 'Confirm Free Call'}
                    <ArrowRight className="h-3.5 w-3.5 opacity-80 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </button>
                  <p className="text-[11px] font-medium text-stone-500">
                    Free · no spam · reschedule anytime on WhatsApp
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
