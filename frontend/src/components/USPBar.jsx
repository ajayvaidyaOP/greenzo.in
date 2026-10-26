import React from 'react';
import { Truck, ShieldCheck, Droplets, Camera } from 'lucide-react';
import Reveal from './Reveal.jsx';

const USPS = [
  { icon: Droplets, title: '14-Day Self-Watering', desc: 'Dual-chamber wick pots, zero spills' },
  { icon: Truck, title: 'Free Fast Delivery', desc: 'Above ₹499 · Same-day Pune dispatch' },
  { icon: Camera, title: 'WhatsApp Live Photo', desc: 'Exact plant photo shared pre-dispatch' },
  { icon: ShieldCheck, title: '7-Day Guarantee', desc: 'Free healthy plant replacement' }
];

export default function USPBar() {
  return (
    <div className="border-b border-canopy-950/[0.08] bg-white">
      <div className="shell">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {USPS.map(({ icon: Icon, title, desc }, idx) => (
            <Reveal
              key={title}
              delay={idx * 70}
              className={`group flex items-center gap-3.5 py-5 ${
                idx !== 0 ? 'lg:border-l lg:border-canopy-950/[0.07] lg:pl-6' : ''
              } ${idx % 2 === 1 ? 'border-l border-canopy-950/[0.07] pl-4 lg:pl-6' : ''} ${
                idx > 1 ? 'border-t border-canopy-950/[0.07] lg:border-t-0' : ''
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-canopy-600/20 bg-canopy-50 text-canopy-700 transition-all duration-300 group-hover:bg-canopy-700 group-hover:text-white">
                <Icon className="h-[19px] w-[19px]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-extrabold leading-tight text-canopy-950">{title}</p>
                <p className="mt-0.5 truncate text-[11px] leading-tight text-stone-500">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
