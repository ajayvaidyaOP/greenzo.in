import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Lock, MessageCircle, Leaf, ArrowUpRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { api } from '../lib/api.js';

export default function Footer({ onNotify, onOpenTrackOrder, onOpenBundle }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(null);
  const handleSub = async (e) => {
    e.preventDefault(); if (!email.trim()) return;
    try { const r = await api.subscribeNewsletter(email); setCode(r.welcomeCoupon); setEmail(''); onNotify(`Use ${r.welcomeCoupon} for 10% OFF`); } catch (err) { onNotify(err.message); }
  };
  return (
    <>
      <footer className="bg-canopy-950 text-white">
        {/* Top trust strip */}
        <div className="border-b border-white/10">
          <div className="max-w-[1360px] mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-6">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-300" /> 7-Day Healthy Guarantee</span>
              <span className="inline-flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-300" /> Free Delivery ₹499+</span>
              <span className="inline-flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-300" /> Razorpay Secure — UPI, Cards, COD</span>
            </div>
            <span className="hidden sm:inline text-white/60">Pune Atelier • Pan-India Delivery • Plastic-Free Pods</span>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-5 lg:px-8 py-12 lg:py-14">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-[14px] bg-white flex items-center justify-center"><Leaf className="w-5 h-5 text-canopy-950" /></div><div><p className="font-serif text-[20px] font-bold leading-none tracking-tight">GREENZO.IN</p><p className="text-[10px] tracking-[0.18em] uppercase text-white/60 font-semibold">Botanical Atelier — Pune</p></div></div>
              <p className="text-sm leading-relaxed text-white/70 max-w-sm">Capillary self-watering indoor plants — low-light & AC-ready, air-purifying foliage, timeless matte pots. Grown in Theur, Pune.</p>
              <ul className="space-y-2.5 text-sm text-white/80 pt-1">
                <li className="flex gap-2.5"><MapPin className="w-4 h-4 text-white/60 mt-0.5" /> Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110</li>
                <li className="flex gap-2.5"><Mail className="w-4 h-4 text-white/60" /> Greenzo.pune@gmail.com</li>
                <li className="flex gap-2.5"><Phone className="w-4 h-4 text-white/60" /> +91 8883639639</li>
              </ul>
              <div className="pt-3">
                <p className="text-[11px] tracking-[0.16em] uppercase font-bold text-white/60 mb-2">We Accept</p>
                <div className="flex flex-wrap gap-2">
                  {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'NetBanking', 'COD'].map((p) => <span key={p} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium">{p}</span>)}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-serif text-lg font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><a href="#top" className="hover:text-white">Atelier Home</a></li>
                <li><a href="#shop" className="hover:text-white">Collection</a></li>
                <li><button onClick={onOpenBundle} className="text-emerald-300 hover:text-emerald-200 font-semibold">4 Plants @ ₹999</button></li>
                <li><a href="#deal" className="hover:text-white">Weekly Atelier Deal</a></li>
                <li><a href="#journal" className="hover:text-white">Care Journal</a></li>
                <li><button onClick={onOpenTrackOrder} className="underline underline-offset-4 hover:text-white">Track Order</button></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-serif text-lg font-semibold">Help</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Shipping & Delivery</li>
                <li>Returns & Guarantee</li>
                <li>Plant Care Support</li>
                <li>Bulk & Corporate Gifts</li>
                <li>WhatsApp Concierge</li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-[20px] bg-white text-canopy-950 p-6">
                <h4 className="font-serif text-xl font-semibold leading-tight">Join the Atelier List</h4>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">Seasonal drops & care notes + instant <strong>10% off</strong>. No spam.</p>
                <form onSubmit={handleSub} className="flex gap-2 mt-4">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 h-11 px-4 rounded-full bg-stone-50 border border-stone-200 text-sm outline-none focus:bg-white focus:border-canopy-950" />
                  <button className="h-11 px-5 rounded-full bg-canopy-950 text-white text-xs font-semibold inline-flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Join</button>
                </form>
                {code && <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">Welcome — use <strong>{code}</strong> at checkout.</div>}
                <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-3"><Lock className="w-3.5 h-3.5" /> Unsubscribe anytime.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
            <p>© {new Date().getFullYear()} Greenzo.in • Grown in Pune, India.</p>
            <div className="flex items-center gap-4"><span>Privacy</span><span>Terms</span><span>Contact</span><span className="hidden sm:inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Carbon-neutral pods</span></div>
          </div>
        </div>
      </footer>
      <a href="https://wa.me/918883639639?text=Hi%20Greenzo%20Pune!%20Help%20me%20choose%20plants." target="_blank" rel="noreferrer" className="fixed bottom-5 left-5 z-40 h-11 px-4 rounded-full bg-[#1FAF54] text-white shadow-elevated flex items-center gap-2 text-xs font-semibold hover:scale-[1.02] transition"><MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp Atelier</span></a>
    </>
  );
}
