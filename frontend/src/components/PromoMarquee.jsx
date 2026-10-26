import React from 'react';
import { Leaf } from 'lucide-react';

export default function PromoMarquee({ text }) {
  const items = Array.from({ length: 10 }).map((_, i) => i);
  const label =
    text ||
    'Free shipping ₹499+ · 7-day healthy guarantee · 14-day capillary reservoir · grown in Pune · Razorpay secure · carbon-neutral pods';

  return (
    <div className="relative overflow-hidden border-y border-canopy-950/[0.08] bg-linen-75">
      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((idx) => (
            <div key={idx} className="flex items-center gap-5 whitespace-nowrap py-2.5 pr-5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-canopy-900/80">{label}</span>
              <Leaf className="h-3 w-3 shrink-0 text-brass-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
