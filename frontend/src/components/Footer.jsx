import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Lock, Leaf, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { api } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import Reveal from './Reveal.jsx';

export default function Footer({ storeConfig = {}, onNotify, onOpenTrackOrder, onOpenBundle }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(null);

  const phone = storeConfig.phone || '+91 8883639639';
  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const waUrl = buildWhatsAppUrl(
    storeConfig,
    'Hi Greenzo Pune! I need help choosing indoor plants for my space.'
  );

  const handleSub = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const r = await api.subscribeNewsletter(email);
      setCode(r.welcomeCoupon);
      setEmail('');
      onNotify(`Use ${r.welcomeCoupon} for 10% off`);
    } catch (err) {
      onNotify(err.message);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-canopy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_0%,rgba(77,190,141,0.18),transparent_55%)]" />

      {/* Trust strip */}
      <div className="relative border-b border-white/10">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4 text-[11.5px] text-white/75">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> 7-day healthy plant guarantee
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-300" /> Free delivery ₹499+
            </span>
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-300" /> Razorpay secure · UPI · cards · COD
            </span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-300 transition hover:text-emerald-200"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp Support · {phone}
          </a>
        </div>
      </div>

      <div className="shell relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <Reveal className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-[15px] bg-emerald-400 text-canopy-950">
                <Leaf className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-[24px] font-semibold leading-none tracking-[-0.03em]">
                  greenzo<span className="font-sans text-[13px] font-semibold text-emerald-300">.in</span>
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Self-Watering Plant Studio · Pune
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-[12.5px] leading-relaxed text-white/65">
              Capillary self-watering indoor plants — low-light and AC-ready, air-purifying foliage in matte planters.
              Grown at Empire Agro Nursery, Theur, Pune.
            </p>

            <ul className="mt-5 space-y-2.5 text-[12px] text-white/75">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> Empire Agro, Tar Mala Road, Theur,
                Haveli, Pune 412110
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                <a href="mailto:Greenzo.pune@gmail.com" className="hover:text-white">
                  Greenzo.pune@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/45">We accept</p>
              <div className="flex flex-wrap gap-1.5">
                {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'NetBanking', 'COD'].map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/80"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Explore */}
          <Reveal delay={70} className="lg:col-span-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] text-white/65">
              <li>
                <a href="#top" className="transition hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#shop" className="transition hover:text-white">
                  All Indoor Plants
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBundle}
                  className="font-bold text-emerald-300 transition hover:text-emerald-200"
                >
                  {comboSize} Plants @ ₹{comboPrice}
                </button>
              </li>
              <li>
                <a href="#deal" className="transition hover:text-white">
                  Weekly Deal
                </a>
              </li>
              <li>
                <a href="#journal" className="transition hover:text-white">
                  Plant Care Guides
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="underline decoration-white/25 underline-offset-4 transition hover:text-white"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </Reveal>

          {/* Support */}
          <Reveal delay={130} className="lg:col-span-2">
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">Help</h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] text-white/65">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-whatsapp transition hover:text-emerald-300"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp Concierge
                </a>
              </li>
              <li>
                <a href="#consult" className="transition hover:text-white">
                  Free Botanist Call
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(
                    storeConfig,
                    'Hi Greenzo! I have a corporate / bulk gifting inquiry for indoor plants.'
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Corporate &amp; Bulk Gifting
                </a>
              </li>
              <li className="text-white/55">7-Day Replacement Policy</li>
              <li className="text-white/55">Pan-India Safe Delivery</li>
            </ul>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={190} className="lg:col-span-4">
            <div className="rounded-[22px] border border-emerald-400/20 bg-white p-6 text-canopy-950 shadow-card">
              <span className="eyebrow">Greenzo Plant Club</span>
              <h4 className="mt-1.5 font-serif text-[22px] font-medium leading-tight">
                Get 10% off your first order
              </h4>
              <p className="mt-2 text-[12px] leading-relaxed text-stone-600">
                Join for instant <strong className="text-canopy-950">10% off</strong>, seasonal Pune nursery drops, and
                easy plant care tips.
              </p>

              <form onSubmit={handleSub} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-11 flex-1 rounded-full border border-canopy-950/12 bg-linen-50 px-4 text-[12.5px] text-canopy-950 placeholder:text-stone-400 transition focus:border-canopy-600/45 focus:bg-white focus:outline-none"
                />
                <button className="btn btn-dark h-11 px-5 text-[12px]">
                  <Send className="h-3.5 w-3.5 text-emerald-300" /> Join
                </button>
              </form>

              {code && (
                <div className="mt-3 rounded-xl border border-canopy-600/20 bg-canopy-50 px-3 py-2 text-[11.5px] font-medium text-canopy-800">
                  Welcome — use <strong className="font-mono text-canopy-950">{code}</strong> at checkout!
                </div>
              )}

              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500">
                <Lock className="h-3 w-3" /> Zero spam · unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Watermark Wordmark */}
        <div className="pointer-events-none mt-10 select-none overflow-hidden">
          <p className="bg-gradient-to-b from-white/[0.08] to-white/0 bg-clip-text font-serif text-[15vw] leading-[0.82] tracking-[-0.05em] text-transparent">
            greenzo
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Greenzo.in · Grown at Empire Agro, Pune, India.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#top" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#top" className="transition hover:text-white">
              Terms
            </a>
            <a href="#consult" className="transition hover:text-white">
              Contact
            </a>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Plastic-free honeycomb pods
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
