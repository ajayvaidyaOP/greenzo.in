import React from 'react';
import { Sparkles } from 'lucide-react';

const ITEMS = [
  '4 Self-Watering Plants @ ₹999',
  '14-Day Capillary Hydro-Wick Pots',
  'Free Delivery Above ₹499',
  'Live WhatsApp Photo Before Dispatch',
  '7-Day Healthy Replacement Guarantee',
  'Shade-Hardened in Pune for AC Rooms',
  'Razorpay Secure · UPI, Cards & COD'
];

export default function PromoMarquee({ text }) {
  const phrases = text ? [text, ...ITEMS] : ITEMS;
  const loop = [...phrases, ...phrases, ...phrases];

  return (
    <div className="relative overflow-hidden bg-canopy-950 py-3 text-white">
      <div className="marquee-wrap">
        <div className="marquee-track">
          {loop.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 whitespace-nowrap pr-5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/90">
                {item}
              </span>
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
