import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Lock, MessageCircle, Leaf, ShieldCheck, Truck, CreditCard, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';
import Reveal from './Reveal.jsx';

export default function Footer({ onNotify, onOpenTrackOrder, onOpenBundle }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(null);

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
    <>
      <footer className="relative overflow-hidden bg-canopy-950 text-linen-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_0%,rgba(176,138,62,0.16),transparent_55%)]" />

        {/* Trust strip */}
        <div className="relative border-b border-white/10">
          <div className="shell flex flex-wrap items-center justify-between gap-4 py-4 text-[11px] text-linen-100/70">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brass-300" /> 7-day healthy guarantee</span>
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-brass-300" /> Free delivery ₹499+</span>
              <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-brass-300" /> Razorpay secure · UPI · cards · COD</span>
            </div>
            <span className="hidden text-linen-100/50 sm:inline">Pune atelier · pan-India delivery · plastic-free pods</span>
          </div>
        </div>

        <div className="shell relative py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Brand */}
            <Reveal className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-[15px] bg-brass-400 text-canopy-950">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-serif text-[23px] leading-none tracking-[-0.03em]">greenzo<span className="font-sans text-[13px] font-light text-brass-300">.in</span></p>
                  <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.26em] text-linen-100/50">Botanical atelier · Pune</p>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-[12.5px] leading-relaxed text-linen-100/60">
                Capillary self-watering indoor plants — low-light and AC-ready, air-purifying foliage, timeless matte
                planters. Grown at Empire Agro, Theur.
              </p>

              <ul className="mt-5 space-y-2.5 text-[12px] text-linen-100/70">
                <li className="flex gap-2.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass-400" /> Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110</li>
                <li className="flex items-center gap-2.5"><Mail className="h-3.5 w-3.5 shrink-0 text-brass-400" /> Greenzo.pune@gmail.com</li>
                <li className="flex items-center gap-2.5"><Phone className="h-3.5 w-3.5 shrink-0 text-brass-400" /> +91 8883639639</li>
              </ul>

              <div className="mt-6">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-linen-100/40">We accept</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'NetBanking', 'COD'].map((p) => (
                    <span key={p} className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-linen-100/75">{p}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Explore */}
            <Reveal delay={70} className="lg:col-span-2">
              <h4 className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-brass-300">Explore</h4>
              <ul className="mt-4 space-y-2.5 text-[12px] text-linen-100/60">
                <li><a href="#top" className="transition hover:text-linen-50">Atelier home</a></li>
                <li><a href="#shop" className="transition hover:text-linen-50">Collection</a></li>
                <li><button onClick={onOpenBundle} className="font-semibold text-brass-300 transition hover:text-brass-200">4 plants @ ₹999</button></li>
                <li><a href="#deal" className="transition hover:text-linen-50">Weekly deal</a></li>
                <li><a href="#journal" className="transition hover:text-linen-50">Care journal</a></li>
                <li><button onClick={onOpenTrackOrder} className="underline decoration-white/25 underline-offset-4 transition hover:text-linen-50">Track order</button></li>
              </ul>
            </Reveal>

            {/* Help */}
            <Reveal delay={130} className="lg:col-span-2">
              <h4 className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-brass-300">Help</h4>
              <ul className="mt-4 space-y-2.5 text-[12px] text-linen-100/60">
                <li className="transition hover:text-linen-50">Shipping & delivery</li>
                <li className="transition hover:text-linen-50">Returns & guarantee</li>
                <li className="transition hover:text-linen-50">Plant care support</li>
                <li className="transition hover:text-linen-50">Bulk & corporate gifts</li>
                <li className="transition hover:text-linen-50">WhatsApp concierge</li>
                <li><a href="#consult" className="transition hover:text-linen-50">Free consultation</a></li>
              </ul>
            </Reveal>

            {/* Newsletter */}
            <Reveal delay={190} className="lg:col-span-4">
              <div className="rounded-[22px] border border-brass-500/25 bg-brass-50 p-6 text-canopy-950">
                <span className="eyebrow">The atelier list</span>
                <h4 className="mt-1.5 font-serif text-[22px] leading-tight">Seasonal drops & care notes</h4>
                <p className="mt-2 text-[12px] leading-relaxed text-stone-600">
                  Join the list for instant <strong className="text-canopy-950">10% off</strong>, new arrivals and
                  practical plant care. No spam, ever.
                </p>

                <form onSubmit={handleSub} className="mt-4 flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="h-11 flex-1 rounded-full border border-canopy-950/10 bg-white px-4 text-[12.5px] text-canopy-950 placeholder:text-stone-400 transition focus:border-canopy-950/30 focus:outline-none focus:ring-4 focus:ring-brass-500/10"
                  />
                  <button className="btn btn-dark h-11 px-5 text-[12px]">
                    <Send className="h-3.5 w-3.5 text-brass-300" /> Join
                  </button>
                </form>

                {code && (
                  <div className="mt-3 rounded-xl border border-canopy-700/20 bg-white px-3 py-2 text-[11px] text-canopy-800">
                    Welcome — use <strong className="font-mono text-canopy-950">{code}</strong> at checkout.
                  </div>
                )}

                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500"><Lock className="h-3 w-3" /> Unsubscribe anytime.</p>
              </div>
            </Reveal>
          </div>

          {/* Wordmark */}
          <div className="pointer-events-none mt-12 select-none overflow-hidden">
            <p className="bg-gradient-to-b from-white/[0.09] to-white/0 bg-clip-text font-serif text-[16vw] leading-[0.8] tracking-[-0.05em] text-transparent">
              greenzo
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[10.5px] text-linen-100/50 sm:flex-row">
            <p>© {new Date().getFullYear()} Greenzo.in · grown in Pune, India.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#top" className="transition hover:text-linen-100">Privacy</a>
              <a href="#top" className="transition hover:text-linen-100">Terms</a>
              <a href="#consult" className="transition hover:text-linen-100">Contact</a>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-brass-400" /> Carbon-neutral pods</span>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/918883639639?text=Hi%20Greenzo%20Pune!%20Help%20me%20choose%20plants."
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-5 left-5 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-[#128C7E] px-4 text-[11.5px] font-semibold text-white shadow-elevated transition-all duration-500 ease-silk hover:scale-[1.03] hover:bg-[#0f7a6d]"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp atelier</span>
        <ArrowUpRight className="hidden h-3 w-3 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:inline" />
      </a>
    </>
  );
}
