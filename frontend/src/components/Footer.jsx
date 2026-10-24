import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Lock, MessageCircle } from 'lucide-react';
import { api } from '../lib/api.js';

export default function Footer({ onNotify, onOpenTrackOrder, onOpenBundle }) {
  const [email, setEmail] = useState('');
  const [subscribedCode, setSubscribedCode] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const res = await api.subscribeNewsletter(email);
      setSubscribedCode(res.welcomeCoupon);
      setEmail('');
      onNotify(`Subscribed! Use code ${res.welcomeCoupon} for 10% OFF 🌿`);
    } catch (err) {
      onNotify(err.message);
    }
  };

  return (
    <>
      <footer className="bg-linen-100 border-t border-canopy-900/10 text-canopy-950">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-14 lg:py-16">
          <div className="grid md:grid-cols-12 gap-10">
            {/* Brand & Pune Nursery Address */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-canopy-900 text-emerald-300 font-serif italic text-2xl font-bold flex items-center justify-center">
                  g
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-tight block leading-none">
                    GREENZO.IN
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] text-canopy-700 font-semibold">
                    Bringing Nature to Your Doorstep
                  </span>
                </div>
              </div>

              <p className="text-[13.5px] text-canopy-800/75 max-w-sm leading-relaxed">
                Pune’s architectural indoor plant studio specializing in capillary self-watering
                planters, air-purifying foliage, and sustainable eco-packaging.
              </p>

              <ul className="space-y-2.5 text-[13px] text-canopy-900/85 pt-2">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-canopy-700 mt-0.5 shrink-0" />
                  <span>Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-canopy-700 shrink-0" />
                  <a href="mailto:Greenzo.pune@gmail.com" className="hover:underline">
                    Greenzo.pune@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-canopy-700 shrink-0" />
                  <a href="tel:+918883639639" className="hover:underline font-semibold">
                    +91 8883639639
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Storefront Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-serif text-lg font-semibold text-canopy-950">Explore</h4>
              <ul className="space-y-2 text-[13px] text-canopy-800/80">
                <li>
                  <a href="#top" className="hover:text-canopy-950 transition">
                    Home Sanctuary
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-canopy-950 transition">
                    Shop All Plants
                  </a>
                </li>
                <li>
                  <button
                    onClick={onOpenBundle}
                    className="hover:text-terracotta-600 font-semibold text-terracotta-600 transition"
                  >
                    4-Plant Combo @ ₹999
                  </button>
                </li>
                <li>
                  <a href="#deal" className="hover:text-canopy-950 transition">
                    Weekly Nursery Deal
                  </a>
                </li>
                <li>
                  <a href="#journal" className="hover:text-canopy-950 transition">
                    Plant Care Journal
                  </a>
                </li>
                <li>
                  <button
                    onClick={onOpenTrackOrder}
                    className="hover:text-canopy-950 underline underline-offset-4 transition"
                  >
                    Track Your Order
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-serif text-lg font-semibold text-canopy-950">
                Join the Greenzo Club
              </h4>
              <p className="text-[13px] text-canopy-800/75 leading-relaxed">
                Subscribe for seasonal Pune nursery drops, monsoon care notes & an instant{' '}
                <strong>10% welcome code</strong>.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 rounded-xl bg-white border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shrink-0"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {subscribedCode && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-600/20 text-xs text-emerald-900 font-medium">
                  Welcome! Apply code <strong>{subscribedCode}</strong> at checkout for 10% OFF.
                </div>
              )}

              <p className="text-[11.5px] text-canopy-700/65 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5" /> Zero spam. Unsubscribe with one click anytime.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-canopy-900/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-canopy-800/70">
            <p>© {new Date().getFullYear()} Greenzo.in • Crafted with care in Pune, India.</p>
            <div className="flex items-center gap-5">
              <span>7-Day Healthy Replacement</span>
              <span>•</span>
              <span>100% Plastic-Free Eco Pods</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Concierge Button */}
      <a
        href="https://wa.me/918883639639?text=Hi%20Greenzo%20Pune!%20I%20would%20love%20help%20choosing%20indoor%20plants."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 left-5 z-40 h-12 px-4 rounded-full bg-[#1FAF54] hover:bg-[#199947] text-white shadow-lg flex items-center gap-2 text-xs font-semibold transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4 fill-white/20" />
        <span className="hidden sm:inline">WhatsApp Nursery</span>
      </a>
    </>
  );
}
