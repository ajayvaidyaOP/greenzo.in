import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PromoMarquee({ text }) {
  const items = Array.from({ length: 12 }).map((_, i) => i);
  const label = text || 'FREE SHIPPING ₹499+ • 7-DAY HEALTHY GUARANTEE • 14-DAY CAPILLARY RESERVOIR • PUNE ATELIER • RAZORPAY SECURE • CARBON-NEUTRAL PODS';
  return (
    <div className="relative overflow-hidden bg-canopy-950 border-y border-white/10">
      <div className="marquee-track">
        {items.map((idx) => (
          <div key={idx} className="flex items-center gap-4 pr-6 py-2 text-[11px] font-bold tracking-[0.16em] uppercase whitespace-nowrap text-white/90">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span>{label}</span>
            <Sparkles className="w-3 h-3 text-emerald-300/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
