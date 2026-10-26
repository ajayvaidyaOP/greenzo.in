import React from 'react';
import { Truck, ShieldCheck, Droplets, Leaf } from 'lucide-react';
import Reveal from './Reveal.jsx';

const USPS = [
  { icon: Truck, title: 'Free fast delivery', desc: '₹499+ · next-day in Pune' },
  { icon: Droplets, title: 'Hydro-wick atelier', desc: '14-day reservoir, no spills' },
  { icon: ShieldCheck, title: '7-day guarantee', desc: 'Healthy plant replacement' },
  { icon: Leaf, title: 'Pune acclimatised', desc: '50K+ homes · 4.9★ rated' }
];

export default function USPBar() {
  return (
    <div className="border-b border-canopy-950/[0.08] bg-white">
      <div className="shell">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {USPS.map(({ icon: Icon, title, desc }, idx) => (
            <Reveal
              key={title}
              delay={idx * 80}
              className={`group flex items-center gap-3.5 py-5 ${
                idx !== 0 ? 'lg:border-l lg:border-canopy-950/[0.07] lg:pl-6' : ''
              } ${idx % 2 === 1 ? 'border-l border-canopy-950/[0.07] pl-4 lg:pl-6' : ''} ${
                idx > 1 ? 'border-t border-canopy-950/[0.07] lg:border-t-0' : ''
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-canopy-950/10 bg-linen-50 text-canopy-800 transition-all duration-500 ease-silk group-hover:border-brass-500/40 group-hover:bg-brass-50 group-hover:text-brass-700">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold leading-tight text-canopy-950">{title}</p>
                <p className="truncate text-[11px] leading-tight text-stone-500">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
